/**
 * Small, pure helpers with no React or Supabase dependency.
 * Pure functions are trivially testable and reusable (Single Responsibility).
 */

import {
  DEFAULT_AGENT_BIO,
  DEFAULT_AGENT_NAME,
  DEFAULT_AGENT_TITLE,
  DEFAULT_BRAND_NAME,
  DEFAULT_CURRENCY,
  DEFAULT_AREA_UNIT,
  PAST_SALES_HASH,
  PAST_SALES_PATH,
} from "./constants.js";

export const apiAssetUrl = (url) => url || "";

/** Fallback branding used before site settings load from Supabase. */
export const defaultBranding = () => ({
  brand_name: DEFAULT_BRAND_NAME,
  logo_url: "",
  agent_name: DEFAULT_AGENT_NAME,
  agent_title: DEFAULT_AGENT_TITLE,
  agent_bio: DEFAULT_AGENT_BIO,
  agent_photo_url: "",
  contact_phone: "",
  whatsapp_number: "",
  tiktok_url: "",
  facebook_url: "",
  instagram_url: "",
  telegram_url: "",
  currency_code: DEFAULT_CURRENCY,
  area_unit: DEFAULT_AREA_UNIT,
});

export const isPastSalesPage = () =>
  window.location.pathname === PAST_SALES_PATH || window.location.hash === PAST_SALES_HASH;

export const isAdminRoute = () =>
  window.location.pathname.replace(/\/+$/, "") === "/admin";

/** Amharic-aware display value: falls back to the English field. */
export const localized = (value, amharicValue, language) =>
  language === "am" ? (amharicValue || value) : value;

/** A home object rewritten for the current language. */
export const localizeHome = (home, language) => ({
  ...home,
  title: localized(home.title, home.title_am, language),
  location: localized(home.location, home.location_am, language),
  description: localized(home.description, home.description_am, language),
});

export const formatPrice = (price, currencyCode, language = "en") =>
  new Intl.NumberFormat(language === "am" ? "am-ET" : "en-ET", {
    style: "currency",
    currency: currencyCode || DEFAULT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(price);

export const formatArea = (area) => Number(area || 0).toLocaleString();

export const phoneHref = (phone) => {
  const digits = (phone || "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
};

export const whatsappHref = (whatsapp) => {
  const digits = (whatsapp || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
};
