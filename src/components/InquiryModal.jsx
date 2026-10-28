/**
 * The inquiry modal: direct-contact channels plus the Supabase inquiry form.
 * Submission logic is delegated to the injected `onSubmit` handler
 * (the view knows nothing about Supabase — Dependency Inversion).
 */

import React, { useState } from "react";
import { Icon } from "./atoms.jsx";
import { apiAssetUrl } from "../lib/format.js";
import { directContactChannels, isExternal } from "../lib/channels.js";
import { STATUS } from "../lib/constants.js";

export function InquiryModal({ home, onClose, settings, t, onSubmit }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const directContacts = directContactChannels(settings, t);

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await onSubmit({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
        propertyId: home?.id ?? null,
      });
      setSent(true);
    } catch (requestError) {
      setError(requestError.message || t.sendError);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
        <button className="modal-close" onClick={onClose} aria-label={t.close}><Icon name="close" /></button>
        {sent ? (
          <div className="success-state">
            <span className="success-mark">✓</span>
            <p className="eyebrow">{t.noteReceived}</p>
            <h2 id="inquiry-title">{t.inTouchSoon}</h2>
            <p>{t.thankYouMessage}</p>
            <button className="button button-dark" onClick={onClose}>{t.lovelyThanks}</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">{t.letsTalkHomes}</p>
            <h2 id="inquiry-title">{home ? (home.status === STATUS.SOLD ? t.lookingSimilar : t.curiousHome) : t.tellUsHome}</h2>
            {home && <p className="modal-home-name">{home.title}</p>}
            {home?.video_url && <video className="property-video" src={apiAssetUrl(home.video_url)} controls playsInline preload="metadata">{t.videoUnsupported}</video>}
            <div className="direct-contact">
              <div className="direct-contact-heading">
                <span>{t.preferDirect}</span>
                <p>{t.contactNoForm}</p>
              </div>
              {directContacts.length ? (
                <div className="direct-contact-actions">
                  {directContacts.map((contact) => (
                    <a
                      className={`direct-contact-button direct-${contact.name.toLowerCase()}`}
                      href={contact.href}
                      key={contact.name}
                      target={isExternal(contact.href) ? "_blank" : undefined}
                      rel={isExternal(contact.href) ? "noreferrer" : undefined}
                    >
                      <span className="direct-contact-mark" aria-hidden="true">{contact.mark}</span>
                      <span><strong>{contact.name}</strong><small>{contact.detail}</small></span>
                      <Icon name="arrow" size={16} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="direct-contact-unavailable">{t.linksUnavailable}</p>
              )}
            </div>
            <div className="inquiry-divider"><span>{t.orLeaveNote}</span></div>
            <form className="inquiry-form" onSubmit={handleSubmit}>
              <label>{t.yourName}<input name="name" required autoComplete="name" placeholder={t.namePlaceholder} /></label>
              <label>{t.emailAddress}<input name="email" required type="email" autoComplete="email" placeholder={t.emailPlaceholder} /></label>
              <label>{t.phone} <span>{t.optional}</span><input name="phone" type="tel" autoComplete="tel" placeholder={t.phonePlaceholder} /></label>
              <label>{t.messagePrompt}<textarea name="message" required rows="3" placeholder={t.messagePlaceholder} /></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-dark submit-button" type="submit" disabled={sending}>
                {sending ? t.sending : t.sendNote} <Icon name="arrow" size={17} />
              </button>
              <p className="privacy-note">{t.privacyNote}</p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
