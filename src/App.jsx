import React, { useEffect, useMemo, useState } from "react";
import AdminApp from "./AdminApp.jsx";
import { supabase } from "./lib/supabase.js";

const apiAssetUrl = (url) => {
  return url || "";
};

const fallbackHomes = [
  {
    id: 1,
    title: "The Morning Light",
    location: "Bole, Addis Ababa",
    price: 18500000,
    beds: 3,
    baths: 2,
    area: 168,
    property_type: "Apartment",
    status: "For sale",
    image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
    description: "A sunlit, beautifully finished apartment with generous living spaces and room to settle in.",
    featured: true,
  },
  {
    id: 2,
    title: "Bole Avenue Retail",
    location: "Bole, Addis Ababa",
    price: 24000000,
    beds: 0,
    baths: 1,
    area: 112,
    property_type: "Shop",
    status: "For sale",
    image_url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1600&q=90",
    description: "A bright, flexible retail space in a lively neighborhood, ready for your next business idea.",
    featured: true,
  },
  {
    id: 3,
    title: "City View Residence",
    location: "Kazanchis, Addis Ababa",
    price: 14800000,
    beds: 2,
    baths: 1,
    area: 124,
    property_type: "Apartment",
    status: "For sale",
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
    description: "A calm, contemporary city home with open views, thoughtful details, and an easy everyday feel.",
    featured: true,
  },
];

function Brand({ settings, footer = false }) {
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

function Icon({ name, size = 18 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
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
  return <svg {...shared}>{paths[name]}</svg>;
}

function readSavedHomes() {
  try {
    const stored = JSON.parse(localStorage.getItem("saved-homes") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error("Could not read saved homes from this browser:", error);
    return [];
  }
}

function isPastSalesPage() {
  return window.location.pathname === "/sold-homes" || window.location.hash === "#sold-homes";
}

function PropertyCard({ home, saved, onSave, onOpen, settings }) {
  const price = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: settings.currency_code || "ETB",
    maximumFractionDigits: 0,
  }).format(home.price);

  return (
    <article className="property-card">
      <button className="image-button" onClick={() => onOpen(home)} aria-label={`View ${home.title}`}>
        {home.image_url
          ? <img src={apiAssetUrl(home.image_url)} alt={home.title} loading="lazy" />
          : <span className="no-property-image">Property video</span>}
        <span className="status-pill">{home.status || "For sale"}</span>
        <span className="type-pill">{home.property_type}</span>
        {home.video_url && <span className="video-pill">▶ Video tour</span>}
      </button>
      <button
        className={`save-button ${saved ? "is-saved" : ""}`}
        onClick={() => onSave(home.id)}
        aria-label={saved ? "Remove from saved homes" : "Save home"}
        aria-pressed={saved}
      >
        <Icon name="heart" size={19} />
      </button>
      <button className="property-info" onClick={() => onOpen(home)}>
        <span className="property-title-row">
          <span className="property-title">{home.title}</span>
          <span className="property-price">{price}</span>
        </span>
        <span className="property-location"><Icon name="pin" size={15} />{home.location}</span>
        {home.description && <span className="property-description">{home.description}</span>}
        <span className="property-specs">
          {home.property_type === "Apartment" ? (
            <>
              <span><Icon name="bed" size={16} />{home.beds} beds</span>
              <span><Icon name="bath" size={16} />{home.baths} baths</span>
            </>
          ) : (
            <span className="property-use">Retail space</span>
          )}
          <span><Icon name="area" size={16} />{Number(home.area).toLocaleString()} {settings.area_unit || "sqft"}</span>
        </span>
        <span className="property-card-link">View details <Icon name="arrow" size={15} /></span>
      </button>
    </article>
  );
}

function InquiryModal({ home, onClose, settings }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const phoneDigits = (settings.contact_phone || "").replace(/[^\d+]/g, "");
  const whatsappDigits = (settings.whatsapp_number || "").replace(/\D/g, "");
  const directContacts = [
    phoneDigits && { name: "Call", detail: settings.contact_phone, href: `tel:${phoneDigits}`, mark: "☎" },
    whatsappDigits && { name: "WhatsApp", detail: settings.whatsapp_number, href: `https://wa.me/${whatsappDigits}`, mark: "W" },
    settings.telegram_url && { name: "Telegram", detail: "Message Helen", href: settings.telegram_url, mark: "➤" },
    settings.facebook_url && { name: "Facebook", detail: "Visit profile", href: settings.facebook_url, mark: "f" },
    settings.instagram_url && { name: "Instagram", detail: "Visit profile", href: settings.instagram_url, mark: "◎" },
    settings.tiktok_url && { name: "TikTok", detail: "Visit profile", href: settings.tiktok_url, mark: "♪" },
  ].filter(Boolean);

  async function submitInquiry(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      if (!supabase) throw new Error("The contact form is not configured yet. Please contact Helen directly.");
      const { error: insertError } = await supabase.from("inquiries").insert({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone") || "",
        message: form.get("message"),
        property_id: home?.id ?? null,
      });
      if (insertError) throw insertError;
      setSent(true);
    } catch (requestError) {
      setError(requestError.message || "We couldn't send your note. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        {sent ? (
          <div className="success-state">
            <span className="success-mark">✓</span>
            <p className="eyebrow">NOTE RECEIVED</p>
            <h2 id="inquiry-title">We’ll be in touch.</h2>
            <p>Thanks for reaching out. A real person from our team will get back to you shortly.</p>
            <button className="button button-dark" onClick={onClose}>Lovely, thank you</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">LET’S TALK HOMES</p>
            <h2 id="inquiry-title">{home ? (home.status === "Sold" ? "Looking for a home like this?" : "Curious about this home?") : "Tell us what home means to you."}</h2>
            {home && <p className="modal-home-name">{home.title}</p>}
            {home?.video_url && <video className="property-video" src={apiAssetUrl(home.video_url)} controls playsInline preload="metadata">Your browser does not support property video playback.</video>}
            <div className="direct-contact">
              <div className="direct-contact-heading">
                <span>Prefer to talk directly?</span>
                <p>Choose a contact option. No form needed.</p>
              </div>
              {directContacts.length ? (
                <div className="direct-contact-actions">
                  {directContacts.map((contact) => (
                    <a
                      className={`direct-contact-button direct-${contact.name.toLowerCase()}`}
                      href={contact.href}
                      key={contact.name}
                      target={contact.href.startsWith("http") ? "_blank" : undefined}
                      rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      <span className="direct-contact-mark" aria-hidden="true">{contact.mark}</span>
                      <span><strong>{contact.name}</strong><small>{contact.detail}</small></span>
                      <Icon name="arrow" size={16} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="direct-contact-unavailable">Helen’s phone and social links will appear here when they’re added to Site branding.</p>
              )}
            </div>
            <div className="inquiry-divider"><span>Or leave a note</span></div>
            <form className="inquiry-form" onSubmit={submitInquiry}>
              <label>Your name<input name="name" required autoComplete="name" placeholder="Jane Smith" /></label>
              <label>Email address<input name="email" required type="email" autoComplete="email" placeholder="jane@example.com" /></label>
              <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" placeholder="(555) 000-0000" /></label>
              <label>A little about what you’re looking for<textarea name="message" required rows="3" placeholder="I’d love to know more about..." /></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-dark submit-button" type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send a note"} <Icon name="arrow" size={17} />
              </button>
              <p className="privacy-note">Your details stay with us. No spam, ever.</p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function PublicSite() {
  const [soldPage, setSoldPage] = useState(isPastSalesPage);
  const [branding, setBranding] = useState({
    brand_name: "Zenebe Frew Real Estate",
    logo_url: "",
    agent_name: "Helen Hidbachew",
    agent_title: "Real Estate Agent",
    agent_bio: "Buying or selling a home is a personal decision. I’m here to help you explore your options, understand the next steps, and find a home that feels right for you.",
    agent_photo_url: "",
    contact_phone: "",
    whatsapp_number: "",
    tiktok_url: "",
    facebook_url: "",
    instagram_url: "",
    telegram_url: "",
    currency_code: "ETB",
    area_unit: "sqft",
  });
  const [homes, setHomes] = useState(soldPage ? [] : fallbackHomes);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [saved, setSaved] = useState(readSavedHomes);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedAnnouncement, setSavedAnnouncement] = useState("");
  const [selectedHome, setSelectedHome] = useState(null);
  const [apiNotice, setApiNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setApiNotice("Listings and contact forms are being configured. Please use the contact links below.");
      return undefined;
    }

    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data) return;
        setBranding((current) => ({
          ...current,
          ...data,
          brand_name: data.brand_name || "Zenebe Frew Real Estate",
          logo_url: apiAssetUrl(data.logo_url),
          agent_photo_url: apiAssetUrl(data.agent_photo_url),
        }));
      })
      .catch((error) => {
        console.error("Could not load site branding from Supabase:", error);
      });
  }, []);

  const agentName = branding.agent_name || "Helen Hidbachew";
  const phoneDigits = (branding.contact_phone || "").replace(/[^\d+]/g, "");
  const whatsappDigits = (branding.whatsapp_number || "").replace(/\D/g, "");
  const socialLinks = [
    { name: "TikTok", href: branding.tiktok_url, mark: "♪" },
    { name: "WhatsApp", href: whatsappDigits ? `https://wa.me/${whatsappDigits}` : "", account: branding.whatsapp_number, mark: "W" },
    { name: "Facebook", href: branding.facebook_url, mark: "f" },
    { name: "Instagram", href: branding.instagram_url, mark: "◎" },
    { name: "Telegram", href: branding.telegram_url, mark: "➤" },
  ];
  const configuredSocialLinks = socialLinks.filter((item) => item.href);
  const featuredHomes = homes.filter((home) => home.featured).slice(0, 2);
  const heroImage = homes[0]?.image_url || fallbackHomes[0].image_url;
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("site-theme") !== "light");

  useEffect(() => {
    try {
      localStorage.setItem("saved-homes", JSON.stringify(saved));
    } catch (error) {
      console.error("Could not save your shortlist in this browser:", error);
    }
  }, [saved]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    try {
      localStorage.setItem("site-theme", darkMode ? "dark" : "light");
    } catch (error) {
      console.error("Could not save your theme preference in this browser:", error);
    }
  }, [darkMode]);

  useEffect(() => {
    function syncPageFromLocation() {
      const nextSoldPage = isPastSalesPage();
      if (nextSoldPage === soldPage) return;
      setSoldPage(nextSoldPage);
      setMenuOpen(false);
      if (nextSoldPage) {
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (window.location.hash) {
        const targetId = decodeURIComponent(window.location.hash.slice(1));
        requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView());
      }
    }
    window.addEventListener("hashchange", syncPageFromLocation);
    window.addEventListener("popstate", syncPageFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncPageFromLocation);
      window.removeEventListener("popstate", syncPageFromLocation);
    };
  }, [soldPage]);

  useEffect(() => {
    document.title = `${branding.brand_name} — Your next move`;
  }, [branding.brand_name]);

  useEffect(() => {
    const contactSection = document.getElementById("contact");
    if (!contactSection) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle("contact-in-view", entry.isIntersecting);
    }, { threshold: 0.15 });
    observer.observe(contactSection);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("contact-in-view");
    };
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    let query = supabase.from("properties").select("*")
      .in("status", soldPage ? ["Sold"] : ["For sale", "Under contract"])
      .in("property_type", ["Apartment", "Shop"])
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    query.then(({ data, error }) => {
      if (error) throw error;
      if (active) setHomes(data || []);
    }).catch((error) => {
      if (active) {
        console.error("Could not load listings from Supabase:", error);
        setApiNotice(soldPage
          ? "Past sales could not be loaded right now. Please try again later."
          : "Listings could not be refreshed right now. Please check back soon.");
      }
    });
    return () => {
      active = false;
    };
  }, [soldPage]);

  const filteredHomes = useMemo(() => {
    const matching = homes.filter((home) => {
      const matchesQuery = !query || `${home.title} ${home.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = !type || home.property_type === type;
      const matchesBedrooms = !bedrooms
        || (home.property_type === "Apartment" && home.beds >= Number(bedrooms));
      const matchesBudget = !maxPrice || home.price <= Number(maxPrice);
      return matchesQuery && matchesType && matchesBedrooms && matchesBudget;
    });
    if (sort === "price-low") matching.sort((a, b) => a.price - b.price);
    if (sort === "price-high") matching.sort((a, b) => b.price - a.price);
    return matching;
  }, [homes, query, type, bedrooms, maxPrice, sort]);
  const visibleHomes = savedOnly
    ? filteredHomes.filter((home) => saved.includes(home.id))
    : filteredHomes;

  function toggleSaved(id) {
    const home = homes.find((item) => item.id === id);
    const alreadySaved = saved.includes(id);
    setSaved((current) => alreadySaved
      ? current.filter((item) => item !== id)
      : [...current, id]);
    setSavedAnnouncement(alreadySaved
      ? `${home?.title || "Home"} removed from your saved homes.`
      : `${home?.title || "Home"} added to your saved homes.`);
  }

  function searchSubmit(event) {
    event.preventDefault();
    document.getElementById("homes")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header className="site-header">
        <Brand settings={branding} />
        <a
          className="mobile-header-call"
          href={phoneDigits ? `tel:${phoneDigits}` : "#contact"}
          aria-label={phoneDigits ? `Call ${agentName}` : "Contact the agent"}
        >
          <Icon name="phone" size={17} />
          <span>{phoneDigits ? "Call now" : "Contact"}</span>
        </a>
        <button className="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/#homes" onClick={() => setMenuOpen(false)}>Listings</a>
          {!soldPage && <a href="/#projects" onClick={() => setMenuOpen(false)}>Projects</a>}
          <a href="/#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="/#sold-homes" onClick={() => setMenuOpen(false)}>Past sales</a>
          <button className="theme-toggle" onClick={() => setDarkMode((current) => !current)} aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`} title={`Switch to ${darkMode ? "light" : "dark"} mode`}>
            <Icon name={darkMode ? "sun" : "moon"} size={17} />
          </button>
          <a
            className={phoneDigits ? "nav-call" : "nav-contact"}
            href={phoneDigits ? `tel:${phoneDigits}` : (soldPage ? "/#contact" : "#contact")}
            onClick={() => setMenuOpen(false)}
          >
            {phoneDigits ? `Call ${agentName}` : "Contact Helen"} <Icon name="arrow" size={16} />
          </a>
        </nav>
      </header>

      {soldPage ? (
        <main>
          <section className="sold-page section-shell">
            <p className="eyebrow">A LOOK BACK AT THE KEYS HANDED OVER</p>
            <h1>Previously <em>sold.</em></h1>
            <p className="section-intro">A collection of homes sold by Helen Hidbachew. Every sale has a story; here are a few of the places that found their people.</p>
            {apiNotice && <p className="api-notice" role="status">{apiNotice}</p>}
            {homes.length ? (
              <div className="property-grid">
                {homes.map((home) => <PropertyCard key={home.id} home={home} settings={branding} saved={saved.includes(home.id)} onSave={toggleSaved} onOpen={setSelectedHome} />)}
              </div>
            ) : (
              <div className="empty-results"><span>⌂</span><h3>Helen’s sold homes will be shared here.</h3><p>Past sales added in the admin will appear on this page.</p><a className="text-link" href="/#contact">Ask Helen a question <Icon name="arrow" size={16} /></a></div>
            )}
            <div className="center-action"><a href="/#contact" className="button button-outline">Talk with Helen <Icon name="arrow" size={17} /></a></div>
          </section>
        </main>
      ) : (
      <main>
        <section className="hero">
          <div className="hero-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,24,48,.88) 0%, rgba(12,35,64,.68) 48%, rgba(13,35,63,.23) 100%), url("${heroImage}")` }} />
          <div className="hero-content">
            <span className="hero-kicker"><span /> HOMES &amp; SHOPS · ADDIS ABABA</span>
            <h1>Find a place<br />to <em>call home.</em></h1>
            <p>Explore thoughtful homes and promising business spaces, with personal guidance at every step.</p>
            <div className="hero-actions">
              <a className="button button-blue" href="#homes">Explore listings <Icon name="arrow" size={17} /></a>
              <a className="button hero-outline" href="#projects">Our projects</a>
            </div>
          </div>
          <span className="hero-caption">{branding.brand_name}</span>
          <div className="hero-note" aria-hidden="true">
            <span className="hero-note-mark">✦</span>
            <span><strong>A better move</strong><small>Starts with the right space</small></span>
          </div>
          <form className="search-panel" onSubmit={searchSubmit}>
            <label className="search-location">
              <span>AREA OR NEIGHBORHOOD</span>
              <span className="search-input-wrap"><Icon name="pin" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Addis Ababa areas" /></span>
            </label>
            <label className="search-type">
              <span>PROPERTY TYPE</span>
              <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="">All spaces</option>
                <option value="Apartment">Apartment</option>
                <option value="Shop">Shop</option>
              </select>
            </label>
            <label className="search-bedrooms">
              <span>BEDROOMS</span>
              <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
                <option value="">Any number</option>
                <option value="1">1 or more</option>
                <option value="2">2 or more</option>
                <option value="3">3 or more</option>
              </select>
            </label>
            <label className="search-budget">
              <span>MAXIMUM PRICE · ETB</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Any budget"
                aria-label="Maximum price in Ethiopian birr"
              />
            </label>
            <button className="search-submit" type="submit"><Icon name="search" size={19} /><span>Search homes</span></button>
          </form>
          <div className="hero-bottom">
            <span>PERSONAL GUIDANCE. LOCAL KNOWLEDGE.</span>
            <span>{agentName.toUpperCase()} · {(branding.agent_title || "REAL ESTATE AGENT").toUpperCase()}</span>
          </div>
        </section>

        <section className="listings-section section-shell" id="homes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR NEXT PLACE</p>
              <h2>Featured <em>listings.</em></h2>
              <p className="section-intro">Browse apartments to call home and shop spaces for your next business move.</p>
            </div>
            <div className="listing-controls">
              <span>{visibleHomes.length} {visibleHomes.length === 1 ? "property" : "properties"}</span>
              <button
                className={`saved-filter${savedOnly ? " is-active" : ""}`}
                type="button"
                onClick={() => setSavedOnly((current) => !current)}
                aria-pressed={savedOnly}
              >
                <Icon name="heart" size={15} /> Saved <span className="saved-count">{saved.length}</span>
              </button>
              <label className="sort-control"><span className="sr-only">Sort homes</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">Featured first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>
          {apiNotice && <p className="api-notice" role="status">{apiNotice}</p>}
          <p className="sr-only" aria-live="polite">{savedAnnouncement}</p>
          {visibleHomes.length ? (
            <div className="property-grid">
              {visibleHomes.map((home) => <PropertyCard key={home.id} home={home} settings={branding} saved={saved.includes(home.id)} onSave={toggleSaved} onOpen={setSelectedHome} />)}
            </div>
          ) : (
            <div className="empty-results"><span>⌂</span><h3>{savedOnly ? "Your shortlist is ready when you are." : "No properties match your search."}</h3><p>{savedOnly ? "Tap the heart on any home to keep it close while you explore." : "Try another area or clear your search to see all available listings."}</p><button className="text-link" onClick={() => { setQuery(""); setType(""); setBedrooms(""); setMaxPrice(""); setSavedOnly(false); }}>Show all listings <Icon name="arrow" size={16} /></button></div>
          )}
          <div className="center-action"><a href="/#sold-homes" className="text-link">Browse past sales <Icon name="arrow" size={16} /></a></div>
        </section>

        <section className="projects-section section-shell" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A CLOSER LOOK</p>
              <h2>Selected <em>projects.</em></h2>
              <p className="section-intro">A few featured properties from the current portfolio.</p>
            </div>
            <a href="#homes" className="text-link">Explore listings <Icon name="arrow" size={16} /></a>
          </div>
          {featuredHomes.length ? (
            <div className="project-grid">
              {featuredHomes.map((home) => (
                <button className="project-tile" key={home.id} onClick={() => setSelectedHome(home)}>
                  <img src={home.image_url} alt={home.title} loading="lazy" />
                  <span className="project-tile-shade" />
                  <span className="project-tile-label">{home.property_type} · {home.location}</span>
                  <span className="project-tile-title">{home.title}</span>
                  <span className="project-tile-link">View property <Icon name="arrow" size={16} /></span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-results"><h3>Featured projects will appear here.</h3><p>Mark a property as featured in Admin to show it in this section.</p></div>
          )}
        </section>

        <section className="manifesto" id="about">
          <div className={`manifesto-image profile-portrait${branding.agent_photo_url ? " has-agent-photo" : ""}`} aria-label={`Profile of ${agentName}`}>
            {branding.agent_photo_url
              ? <img src={branding.agent_photo_url} alt={agentName} loading="lazy" />
              : <span className="profile-photo-prompt">Upload {agentName.split(" ")[0]}’s photo in Admin → Site branding</span>}
            <span className="profile-placeholder-caption">{agentName.toUpperCase()} <i>{(branding.agent_title || "REAL ESTATE AGENT").toUpperCase()}</i></span>
          </div>
          <div className="manifesto-copy">
            <p className="eyebrow">MEET YOUR REAL ESTATE PROFESSIONAL</p>
            <h2>{agentName.split(" ")[0]} <em>{agentName.split(" ").slice(1).join(" ")}.</em></h2>
            <p className="agent-role">{branding.agent_title}</p>
            <p>{branding.agent_bio}</p>
            <a className="text-link" href="#contact">Get in touch <Icon name="arrow" size={16} /></a>
            <div className="handwritten">Here to help with your next move.</div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">A PERSONAL HELLO IS JUST A CLICK AWAY</p>
            <h2>Let’s find your<br /><em>next place.</em></h2>
            <p>Whether you’re looking for a place to call home or the right space for your business, {agentName} is ready to help.</p>
            {phoneDigits && (
              <a className="contact-primary-action" href={`tel:${phoneDigits}`}>
                <span className="contact-action-icon"><Icon name="phone" size={19} /></span>
                <span><small>CALL {agentName.toUpperCase()}</small><strong>{branding.contact_phone}</strong></span>
                <Icon name="arrow" size={18} />
              </a>
            )}
            {!phoneDigits && !configuredSocialLinks.length && (
              <p className="contact-unavailable">Contact details will appear here once they’re added in Site branding.</p>
            )}
          </div>
          <div className="contact-card">
            <div className="contact-card-heading">
              <span className="contact-card-icon"><Icon name="home" size={21} /></span>
              <span><strong>Let’s connect</strong><small>Choose the way that works for you.</small></span>
            </div>
            <div className="contact-channels">
              {configuredSocialLinks.length ? configuredSocialLinks.map((item) => (
                <a className="contact-channel" href={item.href} key={item.name} target="_blank" rel="noreferrer">
                  <span className={`contact-channel-mark channel-${item.name.toLowerCase()}`}>{item.mark}</span>
                  <span><strong>{item.name}</strong><small>{item.account || "Connect with Helen"}</small></span>
                  <Icon name="arrow" size={16} />
                </a>
              )) : <p className="contact-channel-empty">Social links are being updated. Please check back soon.</p>}
            </div>
            <p className="contact-card-note"><span>✦</span> Friendly advice, no pressure.</p>
          </div>
        </section>
      </main>
      )}

      <footer className="site-footer">
        <Brand settings={branding} footer />
        <span>Real estate with {agentName}.</span>
        <span>© 2026 {branding.brand_name}</span>
      </footer>

      <nav className="floating-contact" aria-label="Social media accounts">
        {socialLinks.map((item) => item.href ? (
          <a
            className={`social-circle social-${item.name.toLowerCase()}`}
            href={item.href}
            key={item.name}
            target="_blank"
            rel="noreferrer"
            aria-label={`Contact on ${item.name}`}
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
            aria-label={`${item.name} account not configured`}
            title={`Add ${item.name} account in Site branding`}
          >
            <span aria-hidden="true">{item.mark}</span>
          </button>
        ))}
      </nav>
      {selectedHome && <InquiryModal home={selectedHome} settings={branding} onClose={() => setSelectedHome(null)} />}
    </>
  );
}

export default function App() {
  const isAdminRoute = window.location.pathname.replace(/\/+$/, "") === "/admin";
  return isAdminRoute ? <AdminApp /> : <PublicSite />;
}
