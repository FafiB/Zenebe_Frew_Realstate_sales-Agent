/**
 * Listing presentation: search & sort cards, featured project tiles,
 * and the empty state.
 */

import React from "react";
import { Icon } from "./atoms.jsx";
import { apiAssetUrl, formatArea, formatPrice, localizeHome } from "../lib/format.js";
import { statusLabelMap } from "../lib/channels.js";
import { PROPERTY_TYPE } from "../lib/constants.js";

export function PropertyCard({ home, saved, onSave, onOpen, settings, t, language }) {
  const displayHome = localizeHome(home, language);
  const { title: displayTitle, location: displayLocation, description: displayDescription } = displayHome;
  const price = formatPrice(home.price, settings.currency_code, language);
  const isApartment = home.property_type === PROPERTY_TYPE.APARTMENT;

  return (
    <article className="property-card">
      <button className="image-button" onClick={() => onOpen(displayHome)} aria-label={`${t.viewDetails}: ${displayTitle}`}>
        {home.image_url
          ? <img src={apiAssetUrl(home.image_url)} alt={displayTitle} loading="lazy" />
          : <span className="no-property-image">{t.videoTour}</span>}
        <span className="status-pill">{statusLabelMap(t)[home.status] || t.forSale}</span>
        <span className="type-pill">{isApartment ? t.apartment : t.shop}</span>
        {home.video_url && <span className="video-pill">▶ {t.videoTour}</span>}
      </button>
      <button
        className={`save-button ${saved ? "is-saved" : ""}`}
        onClick={() => onSave(home.id)}
        aria-label={saved ? t.removeSaved : t.saveHome}
        aria-pressed={saved}
      >
        <Icon name="heart" size={19} />
      </button>
      <button className="property-info" onClick={() => onOpen(home)}>
        <span className="property-title-row">
          <span className="property-title">{displayTitle}</span>
          <span className="property-price">{price}</span>
        </span>
        <span className="property-location"><Icon name="pin" size={15} />{displayLocation}</span>
        {displayDescription && <span className="property-description">{displayDescription}</span>}
        <span className="property-specs">
          {isApartment ? (
            <>
              <span><Icon name="bed" size={16} />{home.beds} {t.beds}</span>
              <span><Icon name="bath" size={16} />{home.baths} {t.baths}</span>
            </>
          ) : (
            <span className="property-use">{t.retailSpace}</span>
          )}
          <span><Icon name="area" size={16} />{formatArea(home.area)} {settings.area_unit || "sqft"}</span>
        </span>
        <span className="property-card-link">{t.viewDetails} <Icon name="arrow" size={15} /></span>
      </button>
    </article>
  );
}

export function PropertyGrid({ homes, saved, onSave, onOpen, settings, t, language }) {
  return (
    <div className="property-grid">
      {homes.map((home) => (
        <PropertyCard
          key={home.id}
          home={home}
          settings={settings}
          saved={saved.includes(home.id)}
          onSave={onSave}
          onOpen={onOpen}
          t={t}
          language={language}
        />
      ))}
    </div>
  );
}

export function FeaturedProjects({ homes, onOpen, t, language }) {
  return (
    <div className="project-grid">
      {homes.map((home) => {
        const title = (language === "am" && home.title_am) || home.title;
        const location = (language === "am" && home.location_am) || home.location;
        return (
          <button
            className="project-tile"
            key={home.id}
            onClick={() => onOpen({ ...home, title, location, description: (language === "am" && home.description_am) || home.description })}
          >
            <img src={home.image_url} alt={home.title} loading="lazy" />
            <span className="project-tile-shade" />
            <span className="project-tile-label">{home.property_type === "Apartment" ? t.apartment : t.shop} · {location}</span>
            <span className="project-tile-title">{title}</span>
            <span className="project-tile-link">{t.viewProperty} <Icon name="arrow" size={16} /></span>
          </button>
        );
      })}
    </div>
  );
}

export function EmptyResults({ t, savedOnly, onReset }) {
  return (
    <div className="empty-results">
      <span>⌂</span>
      <h3>{savedOnly ? t.noSavedHomes : t.noSearchMatches}</h3>
      <p>{savedOnly ? t.savedHomesHint : t.searchHint}</p>
      <button className="text-link" onClick={onReset}>{t.showAllListings} <Icon name="arrow" size={16} /></button>
    </div>
  );
}
