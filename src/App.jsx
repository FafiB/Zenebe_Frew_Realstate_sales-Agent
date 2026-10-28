/**
 * Composition root for the public website. Delegates state to hooks,
 * data to the API service, presentation to components — this file only
 * wires things together (Single Responsibility, Dependency Inversion).
 */

import React, { useCallback, useState } from "react";
import AdminApp from "./AdminApp.jsx";
import { translations } from "./translations.js";
import { isAdminRoute } from "./lib/format.js";
import { supabase } from "./lib/supabase.js";
import { realEstateApi } from "./lib/api.js";
import { socialChannels } from "./lib/channels.js";
import { localizeHome } from "./lib/format.js";
import { fallbackHomes } from "./lib/constants.js";
import { useBranding, useLanguage, useListings, useSavedHomes, useSoldPage, useTheme, useFilteredHomes } from "./hooks/useSiteState.js";
import { useContactInView, usePageTitle } from "./hooks/useDocumentEffects.js";
import { SiteHeader, SiteFooter, FloatingContact } from "./components/chrome.jsx";
import { Hero, ListingsSection, ProjectsSection, AgentSection, ContactSection, SoldPage } from "./components/sections.jsx";
import { InquiryModal } from "./components/InquiryModal.jsx";

const EMPTY_FILTERS = { query: "", type: "", bedrooms: "", maxPrice: "" };

function PublicSite() {
  const branding = useBranding();
  const [language, toggleLanguage] = useLanguage();
  const [darkMode, toggleTheme] = useTheme();
  const t = translations[language];

  const [menuOpen, setMenuOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedAnnouncement, setSavedAnnouncement] = useState("");
  const [selectedHome, setSelectedHome] = useState(null);
  const [apiNotice, setApiNotice] = useState("");
  const [criteria, setCriteria] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("featured");

  const [saved, setSaved] = useSavedHomes();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const soldPage = useSoldPage(closeMenu);

  const requestNotice = useCallback((message) => setApiNotice(message), []);
  const homes = useListings(soldPage, {
    listingsUnavailable: t.listingsUnavailable,
    listingsError: t.listingsError,
    soldError: t.soldError,
    notify: requestNotice,
  });

  usePageTitle(branding.brand_name, t);
  useContactInView();

  const filteredHomes = useFilteredHomes(homes, criteria, saved, savedOnly);

  const agentName = branding.agent_name || "Helen Hidbachew";
  const agentTitle = localizeHome({ title: branding.agent_title || "", title_am: branding.agent_title_am }, language).title;
  const agentBio = localizeHome({ title: branding.agent_bio || "", title_am: branding.agent_bio_am }, language).title;
  const socialLinks = socialChannels(branding).filter((item) => item.href);
  const featuredHomes = homes.filter((home) => home.featured).slice(0, 2);
  const heroImage = homes[0]?.image_url || fallbackHomes[0].image_url;

  function toggleSaved(id) {
    const home = homes.find((item) => item.id === id);
    const alreadySaved = saved.includes(id);
    setSaved(alreadySaved ? saved.filter((item) => item !== id) : [...saved, id]);
    const label = (language === "am" && home?.title_am) || home?.title || t.home.toLowerCase();
    setSavedAnnouncement(alreadySaved ? t.savedRemoved(label) : t.savedAdded(label));
  }

  function resetFilters() {
    setCriteria(EMPTY_FILTERS);
    setSavedOnly(false);
  }

  function searchSubmit(event) {
    event.preventDefault();
    document.getElementById("homes")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitInquiry(payload) {
    if (!supabase) throw new Error(t.unavailableForm);
    return realEstateApi.submitInquiry(payload);
  }

  if (soldPage) {
    return (
      <>
        <SiteHeader
          branding={branding}
          language={language}
          onToggleLanguage={toggleLanguage}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen(!menuOpen)}
          onCloseMenu={closeMenu}
          soldPage
          agentName={agentName}
          t={t}
        />
        <SoldPage
          homes={homes}
          saved={saved}
          onSave={toggleSaved}
          onOpen={setSelectedHome}
          apiNotice={apiNotice}
          settings={branding}
          t={t}
          language={language}
        />
        <SiteFooter branding={branding} agentName={agentName} t={t} />
        <FloatingContact branding={branding} t={t} />
        {selectedHome && <InquiryModal home={selectedHome} settings={branding} onClose={() => setSelectedHome(null)} t={t} onSubmit={submitInquiry} />}
      </>
    );
  }

  return (
    <>
      <SiteHeader
        branding={branding}
        language={language}
        onToggleLanguage={toggleLanguage}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        onCloseMenu={closeMenu}
        soldPage={false}
        agentName={agentName}
        t={t}
      />
      <main>
        <Hero
          branding={branding}
          heroImage={heroImage}
          agentName={agentName}
          agentTitle={agentTitle}
          criteria={criteria}
          onCriteriaChange={setCriteria}
          onSearchSubmit={searchSubmit}
          t={t}
        />
        <ListingsSection
          homes={filteredHomes}
          saved={saved}
          savedOnly={savedOnly}
          savedCount={saved.length}
          savedAnnouncement={savedAnnouncement}
          apiNotice={apiNotice}
          onToggleSavedOnly={() => setSavedOnly((current) => !current)}
          sort={sort}
          onSortChange={(event) => setSort(event.target.value)}
          onSave={toggleSaved}
          onOpen={setSelectedHome}
          onResetFilters={resetFilters}
          settings={branding}
          t={t}
          language={language}
        />
        <ProjectsSection
          featuredHomes={featuredHomes}
          onOpen={setSelectedHome}
          t={t}
          language={language}
        />
        <AgentSection
          branding={branding}
          agentName={agentName}
          agentTitle={agentTitle}
          agentBio={agentBio}
          t={t}
        />
        <ContactSection branding={branding} socialLinks={socialLinks} t={t} />
      </main>
      <SiteFooter branding={branding} agentName={agentName} t={t} />
      <FloatingContact branding={branding} t={t} />
      {selectedHome && <InquiryModal home={selectedHome} settings={branding} onClose={() => setSelectedHome(null)} t={t} onSubmit={submitInquiry} />}
    </>
  );
}

export default function App() {
  return isAdminRoute() ? <AdminApp /> : <PublicSite />;
}
