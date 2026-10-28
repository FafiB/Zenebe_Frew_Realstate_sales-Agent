/**
 * Data-access service. The only module that knows about Supabase tables.
 * UI components depend on this interface, not on the ORM directly
 * (Dependency Inversion / Adapter pattern).
 */

import { supabase } from "./supabase.js";
import { apiAssetUrl } from "./format.js";
import { PROPERTY_TYPE, STATUS } from "./constants.js";

async function fetchSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function fetchProperties(soldPage) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("status", soldPage ? [STATUS.SOLD] : [STATUS.FOR_SALE, STATUS.UNDER_CONTRACT])
    .in("property_type", [PROPERTY_TYPE.APARTMENT, PROPERTY_TYPE.SHOP])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function insertInquiry({ name, email, phone, message, propertyId }) {
  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone: phone || "",
    message,
    property_id: propertyId ?? null,
  });
  if (error) throw error;
}

export const realEstateApi = {
  loadBranding: async () => {
    const data = await fetchSettings();
    if (!data) return null;
    return {
      ...data,
      brand_name: data.brand_name || undefined,
      logo_url: apiAssetUrl(data.logo_url),
      agent_photo_url: apiAssetUrl(data.agent_photo_url),
    };
  },
  loadHomes: fetchProperties,
  submitInquiry: insertInquiry,
};
