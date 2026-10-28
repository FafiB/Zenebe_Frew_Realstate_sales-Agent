/**
 * Central domain constants. Keeping these in one module makes the
 * vocabulary of the app discoverable and changes safe (Single Source of Truth).
 */

export const DEFAULT_BRAND_NAME = "Zenebe Frew Real Estate";
export const DEFAULT_AGENT_NAME = "Helen Hidbachew";
export const DEFAULT_AGENT_TITLE = "Real Estate Agent";
export const DEFAULT_AGENT_BIO =
  "Buying or selling a home is a personal decision. I’m here to help you explore your options, understand the next steps, and find a home that feels right for you.";

export const DEFAULT_CURRENCY = "ETB";
export const DEFAULT_AREA_UNIT = "sqft";

/** Listing statuses accepted by the database. */
export const STATUS = {
  FOR_SALE: "For sale",
  UNDER_CONTRACT: "Under contract",
  SOLD: "Sold",
};

/** Property types accepted by the database. */
export const PROPERTY_TYPE = {
  APARTMENT: "Apartment",
  SHOP: "Shop",
};

export const PAST_SALES_PATH = "/sold-homes";
export const PAST_SALES_HASH = "#sold-homes";
export const ADMIN_PATH = "/admin";

export const STORAGE_KEYS = {
  SAVED_HOMES: "saved-homes",
  LANGUAGE: "site-language",
  THEME: "site-theme",
};

/** Sample listings shown before Supabase data arrives (or when none is configured). */
export const fallbackHomes = [
  {
    id: 1,
    title: "The Morning Light",
    location: "Bole, Addis Ababa",
    price: 18500000,
    beds: 3,
    baths: 2,
    area: 168,
    property_type: PROPERTY_TYPE.APARTMENT,
    status: STATUS.FOR_SALE,
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
    property_type: PROPERTY_TYPE.SHOP,
    status: STATUS.FOR_SALE,
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
    property_type: PROPERTY_TYPE.APARTMENT,
    status: STATUS.FOR_SALE,
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
    description: "A calm, contemporary city home with open views, thoughtful details, and an easy everyday feel.",
    featured: true,
  },
];
