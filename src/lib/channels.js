/**
 * Derived, domain-specific collections (social links, contact channels).
 * Extracted so the header/footer/modal components share one definition.
 */

import { whatsappHref, phoneHref } from "./format.js";

export const socialChannels = (branding) => [
  { name: "TikTok", href: branding.tiktok_url || "", mark: "♪" },
  { name: "WhatsApp", href: whatsappHref(branding.whatsapp_number), account: branding.whatsapp_number, mark: "W" },
  { name: "Facebook", href: branding.facebook_url || "", mark: "f" },
  { name: "Instagram", href: branding.instagram_url || "", mark: "◎" },
  { name: "Telegram", href: branding.telegram_url || "", mark: "➤" },
];

export const directContactChannels = (branding, t) => {
  const phone = phoneHref(branding.contact_phone);
  const whatsapp = whatsappHref(branding.whatsapp_number);
  return [
    phone && { name: t.callNow, href: phone, detail: branding.contact_phone, mark: "☎" },
    whatsapp && { name: "WhatsApp", href: whatsapp, detail: branding.whatsapp_number, mark: "W" },
    branding.telegram_url && { name: "Telegram", href: branding.telegram_url, detail: "Message Helen", mark: "➤" },
    branding.facebook_url && { name: "Facebook", href: branding.facebook_url, detail: "Visit profile", mark: "f" },
    branding.instagram_url && { name: "Instagram", href: branding.instagram_url, detail: "Visit profile", mark: "◎" },
    branding.tiktok_url && { name: "TikTok", href: branding.tiktok_url, detail: "Visit profile", mark: "♪" },
  ].filter(Boolean);
};

export const isExternal = (href) => href.startsWith("http");

export const statusLabelMap = (t) => ({
  "For sale": t.forSale,
  "Under contract": t.underContract,
  Sold: t.sold,
});
