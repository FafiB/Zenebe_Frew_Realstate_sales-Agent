/**
 * Page chrome: sticky header with navigation, footer, and the floating
 * social-contact rail.
 */

import React from "react";
import { Brand, Icon } from "./atoms.jsx";
import { phoneHref } from "../lib/format.js";
import { socialChannels } from "../lib/channels.js";

export function LanguageToggle({ language, onToggle, t, mobile = false }) {
  return (
    <button
      className={`language-toggle${mobile ? " language-toggle-mobile" : " language-toggle-desktop"}`}
      type="button"
      onClick={onToggle}
      aria-label={t.switchLanguage}
      title={t.switchLanguage}
    >
      <span aria-hidden="true">{language === "en" ? "አማ" : "EN"}</span>
      <span>{language === "en" ? "አርማኛ" : "English"}</span>
    </button>
  );
}

export function SiteHeader({
  branding,
  language,
  onToggleLanguage,
  darkMode,
  onToggleTheme,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  soldPage,
  agentName,
  t,
}) {
  const phone = phoneHref(branding.contact_phone?.trim() || branding.contact_phone);
  const callHref = phone || "#contact";
  return (
    <header className="site-header">
      <Brand settings={branding} />
      <a
        className="mobile-header-call"
        href={callHref}
        aria-label={phone ? t.callAgent(agentName) : t.contactAgent}
      >
        <Icon name="phone" size={17} />
        <span>{phone ? t.callNow : t.contact}</span>
      </a>
      <LanguageToggle language={language} onToggle={onToggleLanguage} t={t} mobile />
      <button className="mobile-menu-toggle" aria-label={menuOpen ? t.close : t.listings} aria-expanded={menuOpen} onClick={onToggleMenu}>
        <Icon name={menuOpen ? "close" : "menu"} />
      </button>
      <nav className={menuOpen ? "nav-open" : ""} aria-label={t.home}>
        <a href="/" onClick={onCloseMenu}>{t.home}</a>
        <a href="/#homes" onClick={onCloseMenu}>{t.listings}</a>
        {!soldPage && <a href="/#projects" onClick={onCloseMenu}>{t.projects}</a>}
        <a href="/#about" onClick={onCloseMenu}>{t.about}</a>
        <a href="/#contact" onClick={onCloseMenu}>{t.contact}</a>
        <a href="/#sold-homes" onClick={onCloseMenu}>{t.pastSales}</a>
        <LanguageToggle language={language} onToggle={onToggleLanguage} t={t} />
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          title={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          <Icon name={darkMode ? "sun" : "moon"} size={17} />
        </button>
        <a
          className={phone ? "nav-call" : "nav-contact"}
          href={phone || (soldPage ? "/#contact" : "#contact")}
          onClick={onCloseMenu}
        >
          {phone ? t.callAgent(agentName) : t.contactHelen} <Icon name="arrow" size={16} />
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter({ branding, agentName, t }) {
  return (
    <footer className="site-footer">
      <Brand settings={branding} footer />
      <span>{t.footerTagline(agentName)}</span>
      <span>© 2026 {branding.brand_name}</span>
    </footer>
  );
}

export function FloatingContact({ branding, t }) {
  return (
    <nav className="floating-contact" aria-label={t.socialAccounts}>
      {socialChannels(branding).map((item) => item.href ? (
        <a
          className={`social-circle social-${item.name.toLowerCase()}`}
          href={item.href}
          key={item.name}
          target="_blank"
          rel="noreferrer"
          aria-label={t.contactOn(item.name)}
          title={item.name}
        >
          <span aria-hidden="true">{item.mark}</span>
        </a>
      ) : (
        <button
          className={`social-circle social-${item.name.toLowerCase()} social-unconfigured`}
          key={item.name}
          type="button"
          disabled
          aria-label={t.accountNotConfigured(item.name)}
          title={t.configureSocial(item.name)}
        >
          <span aria-hidden="true">{item.mark}</span>
        </button>
      ))}
    </nav>
  );
}
