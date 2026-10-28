/**
 * Reusable hooks that keep stateful logic out of the view layer
 * (Separation of Concerns, custom-hook pattern).
 */

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { realEstateApi } from "../lib/api.js";
import { storage } from "../lib/storage.js";
import { defaultBranding, isPastSalesPage } from "../lib/format.js";
import { fallbackHomes } from "../lib/constants.js";

/** Persisted light/dark preference applied to <html data-theme>. */
export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => storage.readTheme() === "dark");

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    storage.writeTheme(theme);
  }, [darkMode]);

  return [darkMode, () => setDarkMode((current) => !current)];
}

/** Persisted en/am preference synced to <html lang>. */
export function useLanguage() {
  const [language, setLanguage] = useState(storage.readLanguage);

  useEffect(() => {
    document.documentElement.lang = language === "am" ? "am" : "en";
    storage.writeLanguage(language);
  }, [language]);

  return [language, () => setLanguage((current) => (current === "en" ? "am" : "en"))];
}

/** Shortlist of property ids persisted per browser. */
export function useSavedHomes() {
  const [saved, setSaved] = useState(storage.readSavedHomes);

  useEffect(() => {
    storage.writeSavedHomes(saved);
  }, [saved]);

  return [saved, setSaved];
}

/** Loads branding from Supabase into local state, tolerating failures. */
export function useBranding() {
  const [branding, setBranding] = useState(defaultBranding);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    realEstateApi.loadBranding()
      .then((data) => {
        if (active && data) {
          setBranding((current) => ({ ...current, ...data }));
        }
      })
      .catch((error) => {
        console.error("Could not load site branding from Supabase:", error);
      });
    return () => {
      active = false;
    };
  }, []);

  return branding;
}

/** Loads the listing feed for the current page (public feed or past sales). */
export function useListings(soldPage, notice) {
  const [homes, setHomes] = useState(soldPage ? [] : fallbackHomes);

  useEffect(() => {
    if (!supabase) {
      notice.notify?.(notice.listingsUnavailable);
      return undefined;
    }
    let active = true;
    realEstateApi.loadHomes(soldPage)
      .then((data) => {
        if (active) setHomes(data);
      })
      .catch((error) => {
        if (active) {
          console.error("Could not load listings from Supabase:", error);
          notice.notify?.(soldPage ? notice.soldError : notice.listingsError);
        }
      });
    return () => {
      active = false;
    };
  }, [soldPage, notice.listingsUnavailable, notice.listingsError, notice.soldError, notice.notify]);

  return homes;
}

/** Tracks whether the visitor is on the past-sales page and reacts to navigation. */
export function useSoldPage(onPageChange) {
  const [soldPage, setSoldPage] = useState(isPastSalesPage);

  useEffect(() => {
    function syncFromLocation() {
      const next = isPastSalesPage();
      setSoldPage((current) => {
        if (next === current) return current;
        if (next) {
          window.scrollTo({ top: 0, behavior: "auto" });
        } else if (window.location.hash) {
          const targetId = decodeURIComponent(window.location.hash.slice(1));
          requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView());
        }
        return next;
      });
      onPageChange?.();
    }
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, [onPageChange]);

  return soldPage;
}

/** Filters and sorts the loaded homes by the current search criteria. */
export function useFilteredHomes(homes, criteria, saved, savedOnly) {
  return useMemo(() => {
    const matching = homes.filter((home) => {
      const query = (criteria.query || "").toLowerCase();
      const haystack = `${home.title} ${home.location} ${home.title_am || ""} ${home.location_am || ""}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesType = !criteria.type || home.property_type === criteria.type;
      const matchesBedrooms = !criteria.bedrooms
        || (home.property_type === "Apartment" && home.beds >= Number(criteria.bedrooms));
      const matchesBudget = !criteria.maxPrice || home.price <= Number(criteria.maxPrice);
      return matchesQuery && matchesType && matchesBedrooms && matchesBudget;
    });
    if (criteria.sort === "price-low") matching.sort((a, b) => a.price - b.price);
    if (criteria.sort === "price-high") matching.sort((b, a) => a.price - b.price);
    return savedOnly ? matching.filter((home) => saved.includes(home.id)) : matching;
  }, [homes, criteria, saved, savedOnly]);
}
