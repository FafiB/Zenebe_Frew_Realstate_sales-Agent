/**
 * Full-width page sections: hero with search panel, listings section,
 * featured projects, agent profile, and contact block.
 */

import React from "react";
import { Icon } from "./atoms.jsx";
import { PropertyGrid, FeaturedProjects, EmptyResults } from "./listings.jsx";

export function Hero({ branding, heroImage, agentName, agentTitle, criteria, onCriteriaChange, onSearchSubmit, t }) {
  const { query, type, bedrooms, maxPrice } = criteria;
  const change = (key) => (event) => onCriteriaChange({ ...criteria, [key]: event.target.value });

  return (
    <section className="hero">
      <div className="hero-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,24,48,.88) 0%, rgba(12,35,64,.68) 48%, rgba(13,35,63,.23) 100%), url("${heroImage}")` }} />
      <div className="hero-content">
        <span className="hero-kicker"><span /> {t.heroKicker}</span>
        <h1>{t.heroTitle}<br /><em>{t.heroTitleAccent}</em></h1>
        <p>{t.heroIntro}</p>
        <div className="hero-actions">
          <a className="button button-blue" href="#homes">{t.exploreListings} <Icon name="arrow" size={17} /></a>
          <a className="button hero-outline" href="#projects">{t.ourProjects}</a>
        </div>
      </div>
      <span className="hero-caption">{branding.brand_name}</span>
      <div className="hero-note" aria-hidden="true">
        <span className="hero-note-mark">✦</span>
        <span><strong>{t.heroNoteTitle}</strong><small>{t.heroNoteText}</small></span>
      </div>
      <form className="search-panel" onSubmit={onSearchSubmit}>
        <label className="search-location">
          <span>{t.areaOrNeighborhood}</span>
          <span className="search-input-wrap"><Icon name="pin" size={18} /><input value={query} onChange={change("query")} placeholder={t.searchArea} /></span>
        </label>
        <label className="search-type">
          <span>{t.propertyType}</span>
          <select value={type} onChange={change("type")}>
            <option value="">{t.allSpaces}</option>
            <option value="Apartment">{t.apartment}</option>
            <option value="Shop">{t.shop}</option>
          </select>
        </label>
        <label className="search-bedrooms">
          <span>{t.bedrooms}</span>
          <select value={bedrooms} onChange={change("bedrooms")}>
            <option value="">{t.anyNumber}</option>
            <option value="1">{t.orMore(1)}</option>
            <option value="2">{t.orMore(2)}</option>
            <option value="3">{t.orMore(3)}</option>
          </select>
        </label>
        <label className="search-budget">
          <span>{t.maximumPrice}</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={maxPrice}
            onChange={change("maxPrice")}
            placeholder={t.anyBudget}
            aria-label={t.maxPriceLabel}
          />
        </label>
        <button className="search-submit" type="submit"><Icon name="search" size={19} /><span>{t.searchHomes}</span></button>
      </form>
      <div className="hero-bottom">
        <span>{t.personalGuidance}</span>
        <span>{agentName.toUpperCase()} · {(agentTitle || "REAL ESTATE AGENT").toUpperCase()}</span>
      </div>
    </section>
  );
}

export function ListingsSection({
  homes,
  saved,
  savedOnly,
  savedCount,
  savedAnnouncement,
  apiNotice,
  onToggleSavedOnly,
  sort,
  onSortChange,
  onSave,
  onOpen,
  onResetFilters,
  settings,
  t,
  language,
}) {
  return (
    <section className="listings-section section-shell" id="homes">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.findNextPlace}</p>
          <h2>{t.featuredListings} <em>{t.listingsAccent}</em></h2>
          <p className="section-intro">{t.listingsIntro}</p>
        </div>
        <div className="listing-controls">
          <span>{t.propertyCount(homes.length)}</span>
          <button
            className={`saved-filter${savedOnly ? " is-active" : ""}`}
            type="button"
            onClick={onToggleSavedOnly}
            aria-pressed={savedOnly}
          >
            <Icon name="heart" size={15} /> {t.saved} <span className="saved-count">{savedCount}</span>
          </button>
          <label className="sort-control"><span className="sr-only">Sort homes</span>
            <select value={sort} onChange={onSortChange}>
              <option value="featured">{t.featuredFirst}</option>
              <option value="price-low">{t.priceLowHigh}</option>
              <option value="price-high">{t.priceHighLow}</option>
            </select>
          </label>
        </div>
      </div>
      {apiNotice && <p className="api-notice" role="status">{apiNotice}</p>}
      <p className="sr-only" aria-live="polite">{savedAnnouncement}</p>
      {homes.length ? (
        <PropertyGrid
          homes={homes}
          saved={saved}
          onSave={onSave}
          onOpen={onOpen}
          settings={settings}
          t={t}
          language={language}
        />
      ) : (
        <EmptyResults t={t} savedOnly={savedOnly} onReset={onResetFilters} />
      )}
      <div className="center-action"><a href="/#sold-homes" className="text-link">{t.browsePastSales} <Icon name="arrow" size={16} /></a></div>
    </section>
  );
}

export function ProjectsSection({ featuredHomes, onOpen, t, language }) {
  return (
    <section className="projects-section section-shell" id="projects">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.closerLook}</p>
          <h2>{t.selectedProjects} <em>{t.projectsAccent}</em></h2>
          <p className="section-intro">{t.projectsIntro}</p>
        </div>
        <a href="#homes" className="text-link">{t.exploreProperties} <Icon name="arrow" size={16} /></a>
      </div>
      {featuredHomes.length ? (
        <FeaturedProjects homes={featuredHomes} onOpen={onOpen} t={t} language={language} />
      ) : (
        <div className="empty-results"><h3>{t.featuredProjectsEmpty}</h3><p>{t.featuredProjectsHint}</p></div>
      )}
    </section>
  );
}

export function AgentSection({ branding, agentName, agentTitle, agentBio, t }) {
  const firstName = agentName.split(" ")[0];
  const restOfName = agentName.split(" ").slice(1).join(" ");
  return (
    <section className="manifesto" id="about">
      <div className={`manifesto-image profile-portrait${branding.agent_photo_url ? " has-agent-photo" : ""}`} aria-label={`Profile of ${agentName}`}>
        {branding.agent_photo_url
          ? <img src={branding.agent_photo_url} alt={agentName} loading="lazy" />
          : <span className="profile-photo-prompt">{t.uploadPhoto(firstName)}</span>}
        <span className="profile-placeholder-caption">{agentName.toUpperCase()} <i>{(agentTitle || "REAL ESTATE AGENT").toUpperCase()}</i></span>
      </div>
      <div className="manifesto-copy">
        <p className="eyebrow">{t.meetAgent}</p>
        <h2>{firstName} <em>{restOfName}.</em></h2>
        <p className="agent-role">{agentTitle}</p>
        <p>{agentBio}</p>
        <a className="text-link" href="#contact">{t.getInTouch} <Icon name="arrow" size={16} /></a>
        <div className="handwritten">{t.agentTagline}</div>
      </div>
    </section>
  );
}

export function ContactSection({ branding, socialLinks, t }) {
  const phone = (branding.contact_phone || "").trim();
  const phoneDigits = phone ? phone.replace(/[^\d+]/g, "") : "";
  return (
    <section className="contact-section" id="contact">
      <div className="contact-copy">
        <p className="eyebrow">{t.personalHello}</p>
        <h2>{t.findPlace}<br /><em>{t.nextPlace}</em></h2>
        <p>{t.contactIntro(branding.agent_name || "")}</p>
        {phoneDigits ? (
          <a className="contact-primary-action" href={`tel:${phoneDigits}`}>
            <span className="contact-action-icon"><Icon name="phone" size={19} /></span>
            <span><small>{t.callAgentUpper(branding.agent_name || "")}</small><strong>{phone}</strong></span>
            <Icon name="arrow" size={18} />
          </a>
        ) : null}
        {!phoneDigits && !socialLinks.length && (
          <p className="contact-unavailable">{t.contactDetailsPrompt}</p>
        )}
      </div>
      <div className="contact-card">
        <div className="contact-card-heading">
          <span className="contact-card-icon"><Icon name="home" size={21} /></span>
          <span><strong>{t.letsConnect}</strong><small>{t.chooseContact}</small></span>
        </div>
        <div className="contact-channels">
          {socialLinks.length ? socialLinks.map((item) => (
            <a className="contact-channel" href={item.href} key={item.name} target="_blank" rel="noreferrer">
              <span className={`contact-channel-mark channel-${item.name.toLowerCase()}`}>{item.mark}</span>
              <span><strong>{item.name}</strong><small>{item.account || t.connectHelen}</small></span>
              <Icon name="arrow" size={16} />
            </a>
          )) : <p className="contact-channel-empty">{t.socialEmpty}</p>}
        </div>
        <p className="contact-card-note"><span>✦</span> {t.friendlyAdvice}</p>
      </div>
    </section>
  );
}

export function SoldPage({ homes, saved, onSave, onOpen, apiNotice, settings, t, language }) {
  return (
    <main>
      <section className="sold-page section-shell">
        <p className="eyebrow">{t.soldEyebrow}</p>
        <h1>{t.previously} <em>{t.soldAccent}</em></h1>
        <p className="section-intro">{t.soldIntro}</p>
        {apiNotice && <p className="api-notice" role="status">{apiNotice}</p>}
        {homes.length ? (
          <PropertyGrid
            homes={homes}
            saved={saved}
            onSave={onSave}
            onOpen={onOpen}
            settings={settings}
            t={t}
            language={language}
          />
        ) : (
          <div className="empty-results">
            <span>⌂</span>
            <h3>{t.soldHomesEmpty}</h3>
            <p>{t.soldHomesHint}</p>
            <a className="text-link" href="/#contact">{t.askHelen} <Icon name="arrow" size={16} /></a>
          </div>
        )}
        <div className="center-action"><a href="/#contact" className="button button-outline">{t.talkHelen} <Icon name="arrow" size={17} /></a></div>
      </section>
    </main>
  );
}
