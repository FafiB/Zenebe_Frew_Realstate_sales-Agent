import React, { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase, uploadMedia } from "./lib/supabase.js";
import "./admin.css";

const blankSettings = {
  id: 1,
  brand_name: "Zenebe Frew Real Estate",
  logo_url: "",
  agent_name: "Helen Hidbachew",
  agent_title: "Real Estate Agent",
  agent_title_am: "",
  agent_bio: "",
  agent_bio_am: "",
  agent_photo_url: "",
  contact_phone: "",
  whatsapp_number: "",
  tiktok_url: "",
  facebook_url: "",
  instagram_url: "",
  telegram_url: "",
  currency_code: "ETB",
  area_unit: "sqft",
};

const blankProperty = {
  title: "",
  title_am: "",
  location: "",
  location_am: "",
  price: "",
  beds: 1,
  baths: 1,
  area: "",
  property_type: "Apartment",
  status: "For sale",
  image_url: "",
  video_url: "",
  description: "",
  description_am: "",
  featured: false,
};

const settingsFields = [
  ["brand_name", "Business name", "text"],
  ["logo_url", "Logo image URL (optional)", "url"],
  ["agent_name", "Agent name", "text"],
  ["agent_title", "Agent title", "text"],
  ["agent_title_am", "Agent title in Amharic (optional)", "text"],
  ["agent_bio", "Short agent biography", "textarea"],
  ["agent_bio_am", "Short agent biography in Amharic (optional)", "textarea"],
  ["agent_photo_url", "Agent photo URL (optional)", "url"],
  ["contact_phone", "Phone number", "tel"],
  ["whatsapp_number", "WhatsApp number (international digits)", "tel"],
  ["tiktok_url", "TikTok profile URL", "url"],
  ["facebook_url", "Facebook profile URL", "url"],
  ["instagram_url", "Instagram profile URL", "url"],
  ["telegram_url", "Telegram profile URL", "url"],
  ["currency_code", "Currency code", "text"],
  ["area_unit", "Area unit", "text"],
];

function AdminApp() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("properties");
  const [settings, setSettings] = useState(blankSettings);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [propertyFormOpen, setPropertyFormOpen] = useState(false);
  const [propertyDraft, setPropertyDraft] = useState(blankProperty);
  const [logoFile, setLogoFile] = useState(null);
  const [agentPhotoFile, setAgentPhotoFile] = useState(null);
  const [propertyImageFile, setPropertyImageFile] = useState(null);
  const [propertyVideoFile, setPropertyVideoFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const isAdmin = session?.user?.app_metadata?.role === "admin";

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return undefined;
    }

    supabase.auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (sessionError) throw sessionError;
        setSession(data.session);
      })
      .catch((sessionError) => setError(sessionError.message))
      .finally(() => setCheckingSession(false));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setError("");
      setNotice("");
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin || !supabase) return undefined;

    let active = true;
    setBusy(true);
    Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("properties").select("*").order("updated_at", { ascending: false }),
      supabase.from("inquiries").select("*, properties(title)").order("created_at", { ascending: false }),
    ])
      .then(([settingsResult, propertiesResult, inquiriesResult]) => {
        const failed = [settingsResult, propertiesResult, inquiriesResult].find((result) => result.error);
        if (failed?.error) throw failed.error;
        if (!active) return;
        setSettings(settingsResult.data || blankSettings);
        setProperties(propertiesResult.data || []);
        setInquiries(inquiriesResult.data || []);
      })
      .catch((loadError) => {
        if (active) setError(`Could not load admin data: ${loadError.message}`);
      })
      .finally(() => {
        if (active) setBusy(false);
      });

    return () => {
      active = false;
    };
  }, [isAdmin]);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
    } catch (signInError) {
      setError(signInError.message);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (signOutError) {
      setError(signOutError.message);
    }
  }

  async function saveSettings(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      let updatedSettings = { ...settings };
      if (logoFile) updatedSettings.logo_url = await uploadMedia(logoFile, "site-logos");
      if (agentPhotoFile) updatedSettings.agent_photo_url = await uploadMedia(agentPhotoFile, "agent-photos");
      const { data, error: saveError } = await supabase
        .from("site_settings")
        .upsert(updatedSettings)
        .select()
        .single();
      if (saveError) throw saveError;
      setSettings(data);
      setLogoFile(null);
      setAgentPhotoFile(null);
      setNotice("Branding saved.");
    } catch (saveError) {
      setError(`Could not save branding: ${saveError.message}`);
    } finally {
      setBusy(false);
    }
  }

  function startNewProperty() {
    setPropertyFormOpen(true);
    setEditingId(null);
    setPropertyDraft(blankProperty);
    setPropertyImageFile(null);
    setPropertyVideoFile(null);
    setError("");
    setNotice("");
  }

  function editProperty(property) {
    setPropertyFormOpen(true);
    setEditingId(property.id);
    setPropertyDraft({
      ...property,
      price: String(property.price),
      beds: String(property.beds),
      baths: String(property.baths),
      area: String(property.area),
    });
    setPropertyImageFile(null);
    setPropertyVideoFile(null);
    setError("");
    setNotice("");
  }

  async function saveProperty(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const property = {
        ...propertyDraft,
        price: Number(propertyDraft.price),
        beds: Number(propertyDraft.beds),
        baths: Number(propertyDraft.baths),
        area: Number(propertyDraft.area),
      };
      if (propertyImageFile) property.image_url = await uploadMedia(propertyImageFile, "property-images");
      if (propertyVideoFile) property.video_url = await uploadMedia(propertyVideoFile, "property-videos");
      if (editingId) property.id = editingId;

      const { error: saveError } = await supabase.from("properties").upsert(property);
      if (saveError) throw saveError;
      const { data, error: loadError } = await supabase
        .from("properties")
        .select("*")
        .order("updated_at", { ascending: false });
      if (loadError) throw loadError;
      setProperties(data || []);
      setEditingId(null);
      setPropertyFormOpen(false);
      setPropertyDraft(blankProperty);
      setPropertyImageFile(null);
      setPropertyVideoFile(null);
      setNotice(editingId ? "Property updated." : "Property added.");
    } catch (saveError) {
      setError(`Could not save property: ${saveError.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProperty(property) {
    if (!window.confirm(`Delete “${property.title}”? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      const { error: deleteError } = await supabase.from("properties").delete().eq("id", property.id);
      if (deleteError) throw deleteError;
      setProperties((current) => current.filter((item) => item.id !== property.id));
      setNotice("Property deleted.");
    } catch (deleteError) {
      setError(`Could not delete property: ${deleteError.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function toggleContacted(inquiry) {
    setError("");
    try {
      const { error: updateError } = await supabase
        .from("inquiries")
        .update({ contacted: !inquiry.contacted })
        .eq("id", inquiry.id);
      if (updateError) throw updateError;
      setInquiries((current) => current.map((item) => (
        item.id === inquiry.id ? { ...item, contacted: !item.contacted } : item
      )));
    } catch (updateError) {
      setError(`Could not update inquiry: ${updateError.message}`);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <AdminFrame>
        <AdminMessage title="Admin is not configured">
          Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Cloudflare Pages environment, then deploy again.
        </AdminMessage>
      </AdminFrame>
    );
  }

  if (checkingSession) {
    return <AdminFrame><p className="admin-loading">Checking secure admin session…</p></AdminFrame>;
  }

  if (!session) {
    return (
      <AdminFrame>
        <form className="admin-login" onSubmit={signIn}>
          <a className="admin-back-link" href="/">← Back to the website</a>
          <p className="admin-eyebrow">ZENEBE FREW REAL ESTATE</p>
          <h1>Admin sign in</h1>
          <p>Sign in with the administrator account configured in Supabase Auth.</p>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="admin-primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"}</button>
        </form>
      </AdminFrame>
    );
  }

  if (!isAdmin) {
    return (
      <AdminFrame>
        <AdminMessage title="This account does not have admin access">
          Sign in with an account that has the server-side `app_metadata.role` value set to `admin`. Supabase Auth user metadata alone does not grant admin permissions.
          <button className="admin-secondary-button" onClick={signOut}>Sign out</button>
        </AdminMessage>
      </AdminFrame>
    );
  }

  return (
    <AdminFrame>
      <header className="admin-header">
        <div><p className="admin-eyebrow">ZENEBE FREW REAL ESTATE</p><h1>Site manager</h1></div>
        <div className="admin-header-actions"><a className="admin-secondary-button" href="/">View website</a><button className="admin-secondary-button" onClick={signOut}>Sign out</button></div>
      </header>
      <nav className="admin-tabs" aria-label="Admin sections">
        <button className={activeTab === "properties" ? "is-active" : ""} onClick={() => { setActiveTab("properties"); setError(""); }}>Properties <span>{properties.length}</span></button>
        <button className={activeTab === "branding" ? "is-active" : ""} onClick={() => { setActiveTab("branding"); setError(""); }}>Site branding</button>
        <button className={activeTab === "inquiries" ? "is-active" : ""} onClick={() => { setActiveTab("inquiries"); setError(""); }}>Inquiries <span>{inquiries.filter((item) => !item.contacted).length}</span></button>
      </nav>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {busy && <p className="admin-loading">Working…</p>}

      {activeTab === "branding" && (
        <form className="admin-panel admin-form" onSubmit={saveSettings}>
          <div className="admin-panel-heading"><div><h2>Site branding</h2><p>Update business details and the agent profile shown on the public website.</p></div></div>
          <div className="admin-field-grid">
            {settingsFields.map(([name, label, type]) => (
              <label className={type === "textarea" ? "field-wide" : ""} key={name}>{label}
                {type === "textarea"
                  ? <textarea rows="4" value={settings[name] || ""} onChange={(event) => setSettings({ ...settings, [name]: event.target.value })} />
                  : <input type={type} value={settings[name] || ""} onChange={(event) => setSettings({ ...settings, [name]: event.target.value })} />}
              </label>
            ))}
            <label>Upload a logo<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} /></label>
            <label>Upload agent photo<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => setAgentPhotoFile(event.target.files?.[0] || null)} /></label>
          </div>
          <button className="admin-primary-button" disabled={busy}>Save branding</button>
        </form>
      )}

      {activeTab === "properties" && (
        <section className="admin-properties-layout">
          <div className="admin-panel admin-property-list">
            <div className="admin-panel-heading"><div><h2>Properties</h2><p>Manage the homes and business spaces on your site.</p></div><button className="admin-primary-button" type="button" onClick={startNewProperty}>Add property</button></div>
            {properties.length ? properties.map((property) => (
              <article className="admin-property-row" key={property.id}>
                <img src={property.image_url || undefined} alt="" />
                <div className="admin-property-summary"><strong>{property.title}</strong><span>{property.location} · {property.status}</span><small>{property.property_type} · {Number(property.price).toLocaleString()} {settings.currency_code}</small></div>
                <button className="admin-secondary-button" onClick={() => editProperty(property)}>Edit</button>
                <button className="admin-danger-button" onClick={() => deleteProperty(property)} aria-label={`Delete ${property.title}`}>Delete</button>
              </article>
            )) : <p className="admin-empty">No properties yet. Add the first listing.</p>}
          </div>

          {propertyFormOpen && (
            <form className="admin-panel admin-form admin-property-form" onSubmit={saveProperty}>
              <div className="admin-panel-heading"><div><h2>{editingId ? "Edit property" : "Add a property"}</h2><p>Fields marked required must be filled in.</p></div>{editingId !== null && <button className="admin-secondary-button" type="button" onClick={startNewProperty}>New</button>}</div>
              <label>Property title<input value={propertyDraft.title} onChange={(event) => setPropertyDraft({ ...propertyDraft, title: event.target.value })} required maxLength="120" /></label>
              <label>Property title in Amharic (optional)<input value={propertyDraft.title_am || ""} onChange={(event) => setPropertyDraft({ ...propertyDraft, title_am: event.target.value })} maxLength="120" /></label>
              <label>Location<input value={propertyDraft.location} onChange={(event) => setPropertyDraft({ ...propertyDraft, location: event.target.value })} required maxLength="180" /></label>
              <label>Location in Amharic (optional)<input value={propertyDraft.location_am || ""} onChange={(event) => setPropertyDraft({ ...propertyDraft, location_am: event.target.value })} maxLength="180" /></label>
              <div className="admin-field-grid admin-field-grid-three">
                <label>Price<input type="number" min="1" value={propertyDraft.price} onChange={(event) => setPropertyDraft({ ...propertyDraft, price: event.target.value })} required /></label>
                <label>Bedrooms<input type="number" min="0" value={propertyDraft.beds} onChange={(event) => setPropertyDraft({ ...propertyDraft, beds: event.target.value })} required /></label>
                <label>Bathrooms<input type="number" min="0" step="0.5" value={propertyDraft.baths} onChange={(event) => setPropertyDraft({ ...propertyDraft, baths: event.target.value })} required /></label>
                <label>Area<input type="number" min="0" value={propertyDraft.area} onChange={(event) => setPropertyDraft({ ...propertyDraft, area: event.target.value })} required /></label>
                <label>Type<select value={propertyDraft.property_type} onChange={(event) => setPropertyDraft({ ...propertyDraft, property_type: event.target.value })}><option>Apartment</option><option>Shop</option></select></label>
                <label>Status<select value={propertyDraft.status} onChange={(event) => setPropertyDraft({ ...propertyDraft, status: event.target.value })}><option>For sale</option><option>Under contract</option><option>Sold</option></select></label>
              </div>
              <label>Photo URL<input type="url" value={propertyDraft.image_url || ""} onChange={(event) => setPropertyDraft({ ...propertyDraft, image_url: event.target.value })} placeholder="https://…" /></label>
              <label>Upload property photo<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => setPropertyImageFile(event.target.files?.[0] || null)} /></label>
              <label>Video URL<input type="url" value={propertyDraft.video_url || ""} onChange={(event) => setPropertyDraft({ ...propertyDraft, video_url: event.target.value })} placeholder="https://…" /></label>
              <label>Upload property video<input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" onChange={(event) => setPropertyVideoFile(event.target.files?.[0] || null)} /></label>
              <label>Description<textarea rows="4" value={propertyDraft.description || ""} onChange={(event) => setPropertyDraft({ ...propertyDraft, description: event.target.value })} /></label>
              <label>Description in Amharic (optional)<textarea rows="4" value={propertyDraft.description_am || ""} onChange={(event) => setPropertyDraft({ ...propertyDraft, description_am: event.target.value })} /></label>
              <label className="admin-checkbox"><input type="checkbox" checked={Boolean(propertyDraft.featured)} onChange={(event) => setPropertyDraft({ ...propertyDraft, featured: event.target.checked })} /> Feature this property</label>
              <button className="admin-primary-button" disabled={busy}>{editingId ? "Save property" : "Add property"}</button>
            </form>
          )}
        </section>
      )}

      {activeTab === "inquiries" && (
        <section className="admin-panel">
          <div className="admin-panel-heading"><div><h2>Customer inquiries</h2><p>Private messages are visible only to administrator accounts.</p></div></div>
          {inquiries.length ? (
            <div className="admin-inquiry-list">
              {inquiries.map((inquiry) => (
                <article className={`admin-inquiry${inquiry.contacted ? " is-contacted" : ""}`} key={inquiry.id}>
                  <div className="admin-inquiry-heading"><div><strong>{inquiry.name}</strong><span>{new Date(inquiry.created_at).toLocaleString()}</span></div><button className="admin-secondary-button" onClick={() => toggleContacted(inquiry)}>{inquiry.contacted ? "Mark new" : "Mark contacted"}</button></div>
                  <p>{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ""}</p>
                  {inquiry.properties?.title && <p className="admin-inquiry-property">Asking about: {inquiry.properties.title}</p>}
                  <blockquote>{inquiry.message}</blockquote>
                  <a className="admin-inline-link" href={`mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent("Your property inquiry")}`}>Reply by email</a>
                </article>
              ))}
            </div>
          ) : <p className="admin-empty">No inquiries have been received yet.</p>}
        </section>
      )}
    </AdminFrame>
  );
}

function AdminFrame({ children }) {
  return <main className="admin-app"><a className="admin-brand" href="/">Zenebe Frew <span>Real Estate</span></a>{children}</main>;
}

function AdminMessage({ title, children }) {
  return <section className="admin-message"><p className="admin-eyebrow">SITE ADMINISTRATION</p><h1>{title}</h1><p>{children}</p><a className="admin-secondary-button" href="/">Return to website</a></section>;
}

export default AdminApp;
