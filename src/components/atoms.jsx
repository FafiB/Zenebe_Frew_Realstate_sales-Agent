/**
 * Atoms: inline SVG icon registry and the brand wordmark.
 */

import React, { useState } from "react";

const ICON_PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.7L7.1 10a16 16 0 0 0 6 6l1.8-1.9a2 2 0 0 1 1.7-.6l2.8.5a2 2 0 0 1 1.6 1.9Z" />,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  bed: <><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M6 9V6a2 2 0 0 1 2-2h3v5" /></>,
  bath: <><path d="M9 6 7.5 4.5a2.12 2.12 0 0 0-3 3L6 9M3 12h18v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-2Zm3 7-1 2m12-2 1 2" /></>,
  area: <><path d="M4 8V4h4M20 8V4h-4M4 16v4h4m12-4v4h-4" /><path d="m8 8 8 8m0-8-8 8" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
};

export function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export function Brand({ settings, footer = false }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const brandName = settings.brand_name || "Zenebe Frew Real Estate";
  const nameParts = brandName.split("&");
  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href="/" aria-label={`${brandName} home`}>
      {settings.logo_url && !logoFailed ? (
        <img className="brand-logo" src={settings.logo_url} alt="" onError={() => setLogoFailed(true)} />
      ) : (
        <span className="brand-mark" aria-hidden="true"><Icon name="home" size={19} /></span>
      )}
      <span className="brand-name">
        {nameParts.length > 1 ? <>{nameParts[0].trim()} <i>&amp;</i> {nameParts.slice(1).join("&").trim()}</> : brandName}
      </span>
    </a>
  );
}
