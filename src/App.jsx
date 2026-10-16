import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const apiUrl = (path) => `${API_BASE_URL}${path}`;
const apiAssetUrl = (url) => {
  if (!url || /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url) || url.startsWith("data:")) return url;
  return apiUrl(url.startsWith("/") ? url : `/${url}`);
};

const fallbackHomes = [
  {
    id: 1,
    title: "The Sunday House",
    location: "Silver Lake, Los Angeles",
    price: 1845000,
    beds: 3,
    baths: 2,
    area: 2180,
    property_type: "House",
    status: "For sale",
    image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85",
    description: "A sun-drenched California bungalow with an open, easy flow, original details, and a garden made for slow Sundays.",
    featured: true,
  },
  {
    id: 2,
    title: "Olive & Oak",
    location: "Pasadena, Los Angeles",
    price: 1295000,
    beds: 4,
    baths: 3,
    area: 2640,
    property_type: "House",
    status: "For sale",
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85",
    description: "A graceful Spanish-style home with a welcoming courtyard, warm oak floors, and room to gather.",
    featured: true,
  },
  {
    id: 3,
    title: "A Little Above It All",
    location: "Los Feliz, Los Angeles",
    price: 875000,
    beds: 2,
    baths: 2,
    area: 1480,
    property_type: "Condo",
    status: "For sale",
    image_url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=85",
    description: "A light-filled hillside retreat with leafy views, a generous terrace, and a little more room to breathe.",
    featured: true,
  },
];

function Brand({ settings, footer = false }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const brandName = settings.brand_name || "Zenebe Frew Real Estate";
  const nameParts = brandName.split("&");
  const mark = nameParts.length > 1
    ? `${nameParts[0].trim().charAt(0)}&${nameParts.slice(1).join("&").trim().charAt(0)}`
    : brandName.trim().split(/\s+/).slice(0, 2).map((word) => word.charAt(0)).join("");

  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href="/" aria-label={`${brandName} home`}>
      {settings.logo_url && !logoFailed ? (
        <img className="brand-logo" src={settings.logo_url} alt="" onError={() => setLogoFailed(true)} />
      ) : (
        <span className="brand-mark">{mark}</span>
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
          <span><Icon name="bed" size={16} />{home.beds} beds</span>
          <span><Icon name="bath" size={16} />{home.baths} baths</span>
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

  async function submitInquiry(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const csrfResponse = await fetch(apiUrl("/api/csrf/"), { credentials: "include" });
      if (!csrfResponse.ok) throw new Error("We couldn't prepare the secure form. Please try again.");
      const { csrfToken } = await csrfResponse.json();
      const response = await fetch(apiUrl("/api/inquiries/"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
          property: home?.id ?? null,
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.detail || "We couldn't send your note. Please try again.");
      }
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

function App() {
  const soldPage = window.location.pathname === "/sold-homes";
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
  const [sort, setSort] = useState("featured");
  const [saved, setSaved] = useState(readSavedHomes);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedAnnouncement, setSavedAnnouncement] = useState("");
  const [selectedHome, setSelectedHome] = useState(null);
  const [apiNotice, setApiNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl("/api/site-settings/"), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Site branding could not be loaded.");
        return response.json();
      })
      .then((data) => setBranding((current) => ({
        ...current,
        ...data,
        brand_name: data.brand_name || "Zenebe Frew Real Estate",
        logo_url: apiAssetUrl(data.logo_url || ""),
        agent_photo_url: apiAssetUrl(data.agent_photo_url || ""),
      })))
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Could not load site branding:", error);
      });
    return () => controller.abort();
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
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("site-theme") === "dark");

  useEffect(() => {
    try {
      localStorage.setItem("saved-homes", JSON.stringify(saved));
    } catch (error) {
      console.error("Could not save your shortlist in this browser:", error);
    }
  }, [saved]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("site-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    document.title = `${branding.brand_name} — Your next move`;
  }, [branding.brand_name]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl(`/api/properties/${soldPage ? "?status=sold" : ""}`), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Listings service is unavailable.");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) setHomes(data.map((home) => ({
          ...home,
          image_url: apiAssetUrl(home.image_url),
          video_url: apiAssetUrl(home.video_url),
        })));
        else if (Array.isArray(data)) setHomes([]);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setApiNotice(soldPage
            ? "Helen’s past sales could not be loaded. Please try again when the listings service is available."
            : "Showing a few of our favorite homes. Connect the Django server to see live listings.");
        }
      });
    return () => controller.abort();
  }, [soldPage]);

  const filteredHomes = useMemo(() => {
    const matching = homes.filter((home) => {
      const matchesQuery = !query || `${home.title} ${home.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = !type || home.property_type === type;
      return matchesQuery && matchesType;
    });
    if (sort === "price-low") matching.sort((a, b) => a.price - b.price);
    if (sort === "price-high") matching.sort((a, b) => b.price - a.price);
    return matching;
  }, [homes, query, type, sort]);
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
        <button className="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/#homes" onClick={() => setMenuOpen(false)}>Listings</a>
          {!soldPage && <a href="/#projects" onClick={() => setMenuOpen(false)}>Projects</a>}
          <a href="/#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="/sold-homes" onClick={() => setMenuOpen(false)}>Past sales</a>
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
          <div className="hero-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,24,48,.79) 0%, rgba(12,35,64,.53) 49%, rgba(13,35,63,.13) 100%), url("${heroImage}")` }} />
          <div className="hero-content">
            <span className="hero-kicker"><span /> YOUR NEXT MOVE, MADE CLEARER</span>
            <h1>A home for<br />your <em>next chapter.</em></h1>
            <p>Local guidance, thoughtful service, and a home that feels right for you.</p>
            <div className="hero-actions">
              <a className="button button-blue" href="#homes">Explore listings <Icon name="arrow" size={17} /></a>
              <a className="button hero-outline" href="#projects">Our projects</a>
            </div>
          </div>
          <span className="hero-caption">{branding.brand_name}</span>
          <form className="search-panel" onSubmit={searchSubmit}>
            <label className="search-location">
              <span>WHERE TO?</span>
              <span className="search-input-wrap"><Icon name="pin" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Neighborhood, city, or ZIP" /></span>
            </label>
            <label className="search-type">
              <span>HOME TYPE</span>
              <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="">Any kind of home</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Apartment">Apartment</option>
                <option value="Shop">Shop</option>
              </select>
            </label>
            <button className="search-submit" type="submit"><Icon name="search" size={19} /><span>Find a property</span></button>
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
              <p className="section-intro">Explore current properties and find the one that fits your next move.</p>
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
            <div className="empty-results"><span>⌂</span><h3>{savedOnly ? "Your shortlist is ready when you are." : "No properties match your search."}</h3><p>{savedOnly ? "Tap the heart on any home to keep it close while you explore." : "Try another area or clear your search to see all available listings."}</p><button className="text-link" onClick={() => { setQuery(""); setType(""); setSavedOnly(false); }}>Show all listings <Icon name="arrow" size={16} /></button></div>
          )}
          <div className="center-action"><a href="/sold-homes" className="text-link">Browse past sales <Icon name="arrow" size={16} /></a></div>
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
            <p className="eyebrow">GET IN TOUCH</p>
            <h2>Contact <em>{agentName}.</em></h2>
            <p>Call Helen or connect with her on social media.</p>
            {phoneDigits || configuredSocialLinks.length ? (
              <div className="contact-details" aria-label={`${agentName} contact details`}>
                {phoneDigits && (
                  <div className="contact-detail">
                    <span>Phone</span>
                    <a href={`tel:${phoneDigits}`}>{branding.contact_phone}</a>
                  </div>
                )}
                {configuredSocialLinks.map((item) => (
                  <div className="contact-detail" key={item.name}>
                    <span>{item.name}</span>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.account || item.href}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="contact-unavailable">Helen’s phone number and social media accounts will appear here once they’re added.</p>
            )}
          </div>
          <div className="contact-decoration" aria-hidden="true"><span>{agentName.split(/\s+/).map((part) => part.charAt(0)).join("")}</span><i>Here for your next move.</i></div>
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
            title={`Add ${item.name} account in Django Admin`}
          >
            <span aria-hidden="true">{item.mark}</span>
          </button>
        ))}
      </nav>
      {selectedHome && <InquiryModal home={selectedHome} settings={branding} onClose={() => setSelectedHome(null)} />}
    </>
  );
}

export default App;
