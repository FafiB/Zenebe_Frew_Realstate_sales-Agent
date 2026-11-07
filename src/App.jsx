import React, { useEffect, useMemo, useState } from "react";
import AdminApp from "./AdminApp.jsx";
import { supabase } from "./lib/supabase.js";
import { calculateDownPayment, formatPrice as formatCurrency, localizeHome } from "./lib/format.js";
import { PropertyMedia } from "./components/PropertyMedia.jsx";

const UI_COPY = {
  en: {
    home: "Home", listings: "Listings", projects: "Featured", areas: "Areas", buyingGuide: "Buying guide",
    contact: "Contact", pastSales: "Past sales", callNow: "Call now", call: "Call",
    close: "Close", openMenu: "Open menu", closeMenu: "Close menu",
    language: "አማ", languageTitle: "Switch language to Amharic",
    kicker: "HOMES & SHOPS · ADDIS ABABA", heroLead: "Find a place",
    heroEmphasis: "to call home.", heroDescription: "Explore homes and business spaces, with personal guidance at every step.",
    exploreListings: "Explore listings", bookViewing: "Book a viewing",
    area: "AREA OR NEIGHBORHOOD", areaPlaceholder: "Search Addis Ababa areas",
    propertyType: "PROPERTY TYPE", allSpaces: "All spaces", apartment: "Apartment", shop: "Shop",
    bedrooms: "BEDROOMS", anyNumber: "Any number", studio: "Studio (no separate bedroom)", orMore: "or more",
    maxPrice: "MAXIMUM PRICE · ETB", anyBudget: "Any budget",
    availability: "AVAILABILITY", allCurrent: "All current listings",
    forSale: "For sale", underContract: "Under contract", search: "Search homes",
    currentCollection: "THE CURRENT COLLECTION", statsNote: "Counts update from active property listings.",
    activeListings: "Active listings", apartmentsForSale: "Apartments for sale",
    shopsForSale: "Shops for sale", neighborhoods: "Neighborhoods",
    collectionEyebrow: "HOMES AND SHOPS IN ADDIS ABABA", exploreCollection: "Explore the",
    listingsWord: "listings.", browseCopy: "Browse apartments to call home and shop spaces for your next business move.",
    property: "property", properties: "properties", saved: "Saved",
    featuredFirst: "Featured first", priceLow: "Price: low to high", priceHigh: "Price: high to low",
    noSaved: "Your shortlist is ready when you are.", removeSaved: "Remove from saved homes",
    saveHome: "Save home",
    noMatches: "No properties match your search.",
    savedHint: "Tap the heart on any home to keep it close while you explore.",
    searchHint: "Try another area or clear your search to see all available listings.",
    showAll: "Show all listings", completedSales: "Browse completed sales",
    closerLook: "A CLOSER LOOK", featuredProperties: "Featured properties.",
    featuredDescription: "A closer look at selected homes and business spaces.",
    viewProperty: "View property", featuredEmpty: "Featured properties will appear here.",
    featuredEmptyHint: "Mark a property as featured in Admin to show it in this section.",
    clearStart: "A CLEARER WAY TO BEGIN", planMove: "Plan your next",
    move: "move.", planDescription: "Explore the available details, choose a property, and ask about a visit.",
    guideExplore: "Explore the collection", guideExploreCopy: "Filter homes and shops by neighborhood, type, bedrooms, availability, or price.",
    guideCompare: "Compare the details", guideCompareCopy: "Review the listed location, size, price, and property information before deciding what suits you.",
    guideTalk: "Arrange a conversation", guideTalkCopy: "Open a listing and send an inquiry, or use the contact options to ask about a viewing.",
    goodToKnow: "GOOD TO KNOW", questions: "Common questions.",
    faqTypes: "What kinds of properties can I browse?",
    faqTypesAnswer: "The listings include apartments and shops. Use the property-type filter to narrow the collection.",
    faqAreas: "How can I find properties in a particular area?",
    faqAreasAnswer: "Type an area or neighborhood into the search field. Suggestions are based on locations in the current listings.",
    faqViewing: "How do I ask about a property or arrange a viewing?",
    faqViewingAnswer: "Choose a listing to open its inquiry form, or use the contact options on this page to get in touch.",
    faqSave: "Can I save properties while I compare them?",
    faqSaveAnswer: "Select the heart on a listing to add it to your saved homes on this device.",
    contactEyebrow: "A PERSONAL HELLO IS JUST A CLICK AWAY",
    contactTitle: "Let’s find your", nextPlace: "next place.",
    contactDescription: "Whether you’re looking for a place to call home or the right space for your business, we’re here to help.",
    connect: "Let’s connect", chooseContact: "Choose the way that works for you.",
    friendlyAdvice: "Friendly advice, no pressure.", footerTagline: "Your next move starts here.",
    sendInquiry: "LET’S TALK ABOUT THIS HOME", curious: "Curious about this home?",
    lookingSimilar: "Looking for a home like this?", inquireTitle: "Tell us what home means to you.",
    preferTalk: "Prefer to talk directly?", chooseContactSimple: "Choose a contact option. No form needed.",
    msgUs: "Message us", visitProfile: "Visit profile",
    leaveNote: "Or leave a note", yourName: "Your name", email: "Email address",
    phone: "Phone", optional: "(optional)", lookingFor: "A little about what you’re looking for",
    notePlaceholder: "I’d love to know more about...",
    sending: "Sending...", sendNote: "Send a note", privacy: "Your details stay with us. No spam, ever.",
    noteReceived: "REQUEST RECEIVED", inTouch: "We’ll be in touch.",
    thanks: "Thanks for reaching out. A real person from our team will get back to you shortly.",
    thankYou: "Thank you", viewDetails: "View details", beds: "beds", studioShort: "Studio", baths: "baths",
    retailSpace: "Retail space", videoTour: "Video tour", soldEyebrow: "A LOOK BACK AT COMPLETED SALES",
    previouslySold: "Previously sold.", soldIntro: "Explore completed sales and get in touch to discuss your next move.",
    soldEmpty: "Completed sales will be shared here.", pastSalesAdded: "Past sales added in Admin will appear on this page.",
    getInTouch: "Get in touch", contactAgent: "Contact us",
    contactOn: "Contact on {name}", siteTitle: "{brand} | Homes & Shops in Addis Ababa",
    soldPageTitle: "Previously Sold Properties | {brand} | Addis Ababa",
    siteDescription: "Explore apartments and commercial properties for sale in Addis Ababa. Compare locations, prices, and property details with {brand}.",
    soldPageDescription: "Browse completed property sales in Addis Ababa from {brand}, and get in touch to discuss your next move.",
    compare: "Compare", comparing: "Comparing", selectForCompare: "Select to compare",
    compareLimit: "Compare up to 3 properties.", chooseTwo: "Choose at least two listings to compare them side by side.",
    inventoryTitle: "Sizes and prices at a glance", inventoryIntro: "Compare current listing details using the information provided for each property.",
    areaBrowse: "Explore by area", areaBrowseIntro: "Browse properties grouped by their listed location.",
    viewArea: "View properties", bedroomsShort: "Bedrooms", bathroomsShort: "Baths",
    statusLabel: "Status", locationLabel: "Location", typeLabel: "Type", areaLabel: "Size",
    priceLabel: "Price", downPaymentLabel: "Down payment (10%)", listingLabel: "Listing", noListingData: "No listing details are available for this table yet.",
    previousSlide: "Previous items", nextSlide: "Next items",
    unmuteVideo: "Turn on hero video sound", muteVideo: "Mute hero video",
    noAreas: "Neighborhoods will appear when listings have locations.",
    footerExplore: "Explore", footerAreas: "Neighborhoods", footerVisit: "Contact",
    footerDescription: "Browse the available homes and commercial properties, then get in touch to ask about a listing.",
    footerNoAreas: "Locations will appear as properties are added.",
    phoneNumber: "Phone", callBusiness: "Call",
    requestCall: "Request a call", namePlaceholder: "Your name", phonePlaceholder: "Your phone number",
    fromPrice: "From {price}", downPayment: "Down payment (10%): {amount}", propertyDetails: "Property details",
    propertyGallery: "Property photos", noPhotos: "More photos will be added soon.",
    bathroomsLabel: "Bathrooms", bedroomsLabel: "Bedrooms", sizeLabel: "Property size",
    descriptionLabel: "About this property", askAboutHome: "Interested in this property?",
    modalEyebrow: "LET’S TALK ABOUT THIS HOME",
    formNotReady: "The contact form is not configured yet. Please use the contact links instead.",
    formSendError: "We couldn't send your note. Please try again.",
    pastSalesError: "Past sales could not be loaded right now. Please try again later.",
    listingsError: "Listings could not be refreshed right now. Please check back soon.",
    savedAdded: "{name} added to your saved homes.", savedRemoved: "{name} removed from your saved homes.",
    callUpper: "CALL NOW",
  },
  am: {
    home: "መነሻ", listings: "የንብረት ዝርዝሮች", projects: "ተለይተው የቀረቡ", areas: "አካባቢዎች", buyingGuide: "የግዢ መመሪያ",
    contact: "ያግኙን", pastSales: "የተጠናቀቁ ሽያጮች", callNow: "አሁኑኑ ይደውሉ", call: "ይደውሉ",
    close: "ዝጋ", openMenu: "ምናሌውን ክፈት", closeMenu: "ምናሌውን ዝጋ",
    language: "EN", languageTitle: "ቋንቋውን ወደ እንግሊዝኛ ቀይር",
    kicker: "ቤቶችና ሱቆች · አዲስ አበባ", heroLead: "የሚመችዎትን",
    heroEmphasis: "ቤት ያግኙ።", heroDescription: "የሚወዱትን ቤት ወይም ለንግድዎ የሚሆን ቦታ ያስሱ፤ በደስታ እናግዝዎታለን።",
    exploreListings: "ያሉትን ንብረቶች ይመልከቱ", bookViewing: "ለጉብኝት ቀጠሮ ይያዙ",
    area: "አካባቢ ወይም ሰፈር", areaPlaceholder: "በአዲስ አበባ ውስጥ ይፈልጉ",
    propertyType: "የንብረት ዓይነት", allSpaces: "ሁሉም ዓይነቶች", apartment: "አፓርታማ", shop: "ሱቅ",
    bedrooms: "የመኝታ ክፍሎች", anyNumber: "ሁሉም", studio: "ስቱዲዮ (ያለ መኝታ ክፍል)", orMore: "ወይም ከዚያ በላይ",
    maxPrice: "ከፍተኛ ዋጋ · ብር", anyBudget: "ማንኛውም ዋጋ",
    availability: "የሽያጭ ሁኔታ", allCurrent: "ሁሉም የአሁኑ ንብረቶች",
    forSale: "ለሽያጭ", underContract: "በስምምነት ላይ", search: "ንብረት ይፈልጉ",
    currentCollection: "በአሁኑ ጊዜ የቀረቡ ንብረቶች", statsNote: "ቁጥሮቹ በዚህ ገጽ ላይ ባሉ የንብረት ዝርዝሮች ላይ የተመሠረቱ ናቸው።",
    activeListings: "የቀረቡ ንብረቶች", apartmentsForSale: "ለሽያጭ የቀረቡ አፓርታማዎች",
    shopsForSale: "ለሽያጭ የቀረቡ ሱቆች", neighborhoods: "አካባቢዎች",
    collectionEyebrow: "በአዲስ አበባ ያሉ ቤቶችና ሱቆች", exploreCollection: "ያሉትን",
    listingsWord: "ንብረቶች ይመልከቱ።", browseCopy: "ለመኖሪያ የሚሆኑ አፓርታማዎችንና ለንግድ የሚሆኑ ሱቆችን ያስሱ።",
    property: "ንብረት", properties: "ንብረቶች", saved: "የተቀመጡ",
    featuredFirst: "ተለይተው የቀረቡት ቀድመው", priceLow: "ዋጋ፦ ከዝቅተኛ ወደ ከፍተኛ", priceHigh: "ዋጋ፦ ከከፍተኛ ወደ ዝቅተኛ",
    noSaved: "ያስቀመጧቸው ንብረቶች እዚህ ይታያሉ።",
    removeSaved: "ከተቀመጡት ዝርዝር ያስወግዱ", saveHome: "ወደ ተቀመጡት ያክሉ",
    noMatches: "ይቅርታ፣ ከፍለጋዎ ጋር የሚስማማ ንብረት አልተገኘም።",
    savedHint: "የወደዱትን ቤት ለማስቀመጥ የልብ ምልክቱን ይጫኑ።",
    searchHint: "ሌላ አካባቢ ይሞክሩ፤ ወይም ሁሉንም ንብረቶች ለማየት ማጣሪያዎቹን ያጽዱ።",
    showAll: "ሁሉንም ንብረቶች ይመልከቱ", completedSales: "የተጠናቀቁ ሽያጮችን ይመልከቱ",
    closerLook: "በቅርበት ይመልከቱ", featuredProperties: "ተለይተው የቀረቡ ንብረቶች።",
    featuredDescription: "የተመረጡ መኖሪያ ቤቶችንና የንግድ ቦታዎችን ይመልከቱ።",
    viewProperty: "ዝርዝሩን ይመልከቱ", featuredEmpty: "ተለይተው የቀረቡ ንብረቶች እዚህ ይታያሉ።",
    featuredEmptyHint: "በአስተዳደር ገጹ ላይ ንብረትን ተለይቶ እንዲታይ ይምረጡ።",
    clearStart: "በቀላሉ ይጀምሩ", planMove: "ቀጣዩን እርምጃ",
    move: "ያቅዱ።", planDescription: "የሚወዱትን ንብረት ይመልከቱ፣ የሚመችዎትን ይምረጡ፣ ለጉብኝትም ያግኙን።",
    guideExplore: "ንብረቶችን ያስሱ", guideExploreCopy: "ቤቶችንና ሱቆችን በአካባቢ፣ በዓይነት፣ በመኝታ ብዛት፣ በሽያጭ ሁኔታ ወይም በዋጋ ማጣራት ይችላሉ።",
    guideCompare: "ዝርዝሮቹን ያነጻጽሩ", guideCompareCopy: "የእያንዳንዱን ንብረት አካባቢ፣ ስፋት፣ ዋጋና ሌሎች መረጃዎች ይመልከቱ።",
    guideTalk: "ለጉብኝት ያግኙን", guideTalkCopy: "የወደዱትን ንብረት ይምረጡና መልዕክት ይላኩልን፤ ወይም በቀጥታ ያግኙን።",
    goodToKnow: "ጠቃሚ መረጃ", questions: "ተደጋጋሚ ጥያቄዎች።",
    faqTypes: "ምን ዓይነት ንብረቶችን ማየት እችላለሁ?",
    faqTypesAnswer: "የቀረቡት ንብረቶች አፓርታማዎችንና ሱቆችን ያካትታሉ። ውጤቶቹን ለማጣራት የንብረት ዓይነት ማጣሪያውን ይጠቀሙ።",
    faqAreas: "በተወሰነ አካባቢ ያሉ ንብረቶችን እንዴት አገኛለሁ?",
    faqAreasAnswer: "የአካባቢውን ስም በፍለጋ ሳጥኑ ውስጥ ያስገቡ። የሚታዩት ጥቆማዎች ከቀረቡት ንብረቶች አካባቢ የተወሰዱ ናቸው።",
    faqViewing: "ስለ ንብረት ወይም ጉብኝት እንዴት መጠየቅ እችላለሁ?",
    faqViewingAnswer: "የጥያቄ ቅጹን ለመክፈት ንብረት ይምረጡ፤ ወይም በዚህ ገጽ ያሉትን የመገናኛ አማራጮች ይጠቀሙ።",
    faqSave: "እያነጻጸርኩ ያሉትን ንብረቶች ማስቀመጥ እችላለሁ?",
    faqSaveAnswer: "ንብረትን ወደ ተቀመጡት ዝርዝር ለመጨመር በንብረቱ ላይ ያለውን የልብ ምልክት ይጫኑ።",
    contactEyebrow: "አንድ ጠቅታ ብቻ ቀርቶታል",
    contactTitle: "የሚቀጥለውን", nextPlace: "ቤትዎን እንፈልግ።",
    contactDescription: "መኖሪያ ቤትም ይሁን የንግድ ቦታ እየፈለጉ ከሆነ፣ ልንረዳዎት ዝግጁ ነን።",
    connect: "ያግኙን",     chooseContact: "በሚመችዎት መንገድ ያግኙን።",
    friendlyAdvice: "ያለ ግፊት፣ በወዳጅነት እናግዝዎታለን።", footerTagline: "ቀጣዩ እርምጃዎ እዚህ ይጀምራል።",
    sendInquiry: "ስለዚህ ቤት ይጠይቁ", curious: "ስለዚህ ቤት ተጨማሪ ማወቅ ይፈልጋሉ?",
    lookingSimilar: "እንደዚህ ያለ ቤት ይፈልጋሉ?", inquireTitle: "ምን እንደሚፈልጉ ይንገሩን።",
    preferTalk: "በቀጥታ ማነጋገር ይፈልጋሉ?", chooseContactSimple: "ቅጽ መሙላት አያስፈልግም፤ በሚመችዎት መንገድ ያግኙን።",
    msgUs: "መልዕክት ይላኩልን", visitProfile: "መገለጫውን ይመልከቱ",
    leaveNote: "ወይም መልዕክት ይተዉ", yourName: "ሙሉ ስም", email: "የኢሜይል አድራሻ",
    phone: "ስልክ ቁጥር", optional: "(አማራጭ)", lookingFor: "የሚፈልጉትን በአጭሩ ይግለጹ",
    notePlaceholder: "ስለዚህ ንብረት ተጨማሪ መረጃ እፈልጋለሁ...",
    sending: "በመላክ ላይ...", sendNote: "መልዕክት ይላኩ", privacy: "የግል መረጃዎ በደህና ይጠበቃል።",
    noteReceived: "ጥያቄዎ ደርሶናል", inTouch: "በቅርቡ እናገኝዎታለን።",
    thanks: "ስላነጋገሩን እናመሰግናለን። ከቡድናችን አንዱ በቅርቡ ምላሽ ይሰጥዎታል።",
    thankYou: "እናመሰግናለን", viewDetails: "ዝርዝሩን ይመልከቱ",
    beds: "መኝታ ክፍሎች", studioShort: "ስቱዲዮ", baths: "መታጠቢያ ቤቶች", retailSpace: "የንግድ ቦታ",
    videoTour: "የቪዲዮ ጉብኝት", soldEyebrow: "የተጠናቀቁ ሽያጮች",
    previouslySold: "ቀደም ሲል የተሸጡ ንብረቶች።", soldIntro: "የተጠናቀቁ ሽያጮችን ይመልከቱ፤ ስለ ቀጣይ የንብረት ፍላጎትዎ ለመወያየትም ያግኙን።",
    soldEmpty: "የተጠናቀቁ ሽያጮች እዚህ ይታያሉ።",
    pastSalesAdded: "በአስተዳደር ገጹ ላይ የሚጨመሩ የተሸጡ ንብረቶች እዚህ ይታያሉ።",
    getInTouch: "ያግኙን", contactAgent: "ያግኙን",
    contactOn: "በ{name} ያግኙን", siteTitle: "{brand} | ቤቶችና ሱቆች በአዲስ አበባ",
    soldPageTitle: "የተሸጡ ንብረቶች | {brand} | አዲስ አበባ",
    siteDescription: "{brand} በአዲስ አበባ የሚገኙ አፓርታማዎችንና የንግድ ቦታዎችን ያስሱ። አካባቢ፣ ዋጋና ዝርዝሮችን ያነጻጽሩ።",
    soldPageDescription: "በ{brand} በኩል በአዲስ አበባ የተጠናቀቁ የንብረት ሽያጮችን ይመልከቱ፤ ስለ ቀጣይ እቅድዎም ያግኙን።",
    compare: "ያነጻጽሩ", comparing: "እያነጻጸሩ ነው", selectForCompare: "ለማነጻጸር ይምረጡ",
    compareLimit: "እስከ 3 ንብረቶችን ማነጻጸር ይችላሉ።", chooseTwo: "ለማነጻጸር ቢያንስ ሁለት ንብረቶችን ይምረጡ።",
    inventoryTitle: "መጠንና ዋጋ በአንድ እይታ", inventoryIntro: "የእያንዳንዱን ንብረት መጠን፣ ዋጋና ቅድመ ክፍያ በቀላሉ ያነጻጽሩ።",
    areaBrowse: "በአካባቢ ያስሱ", areaBrowseIntro: "ንብረቶችን በተመዘገቡበት አካባቢ ይመልከቱ።",
    viewArea: "ንብረቶቹን ይመልከቱ", bedroomsShort: "መኝታ ክፍሎች", bathroomsShort: "መታጠቢያ",
    statusLabel: "ሁኔታ", locationLabel: "አካባቢ", typeLabel: "ዓይነት", areaLabel: "ስፋት",
    priceLabel: "ዋጋ", downPaymentLabel: "ቅድመ ክፍያ (10%)", listingLabel: "ንብረት", noListingData: "ለጊዜው የሚታይ የንብረት መረጃ የለም።",
    previousSlide: "ያለፉትን ይመልከቱ", nextSlide: "ቀጣዮቹን ይመልከቱ",
    unmuteVideo: "የጀርባ ቪዲዮውን ድምፅ ያብሩ", muteVideo: "የጀርባ ቪዲዮውን ድምፅ ያጥፉ",
    noAreas: "ንብረቶች ሲጨመሩ አካባቢዎች እዚህ ይታያሉ።",
    footerExplore: "ያስሱ", footerAreas: "አካባቢዎች", footerVisit: "ያግኙን",
    footerDescription: "ያሉትን መኖሪያ ቤቶችና የንግድ ቦታዎች ይመልከቱ፤ ስለ ንብረት ለመጠየቅም ያግኙን።",
    footerNoAreas: "ንብረቶች ሲጨመሩ አካባቢዎች እዚህ ይታያሉ።",
    phoneNumber: "ስልክ ቁጥር", callBusiness: "ይደውሉ",
    requestCall: "እንዲደውሉልኝ ይጠይቁ", namePlaceholder: "ሙሉ ስምዎ", phonePlaceholder: "ስልክ ቁጥርዎ",
    fromPrice: "ዋጋው {price} ነው", downPayment: "ቅድመ ክፍያ (10%)፦ {amount}", propertyDetails: "የንብረት ዝርዝር",
    propertyGallery: "የንብረቱ ፎቶዎች", noPhotos: "ተጨማሪ ፎቶዎች በቅርቡ ይጨመራሉ።",
    bathroomsLabel: "መታጠቢያ ቤቶች", bedroomsLabel: "መኝታ ክፍሎች", sizeLabel: "የንብረቱ ስፋት",
    descriptionLabel: "ስለ ንብረቱ", askAboutHome: "ስለዚህ ንብረት መጠየቅ ይፈልጋሉ?",
    modalEyebrow: "ስለዚህ ቤት ይጠይቁ",
    formNotReady: "የመገናኛ ቅጹ ገና አልተዘጋጀም። እባክዎ የመገናኛ አገናኞቹን ይጠቀሙ።",
    formSendError: "መልዕክትዎን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
    pastSalesError: "የተሸጡ ንብረቶችን አሁን ማምጣት አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።",
    listingsError: "የንብረት ዝርዝሮችን አሁን ማዘመን አልተቻለም። እባክዎ ቆይተው እንደገና ይመልከቱ።",
    savedAdded: "{name} ወደ ተቀመጡት ዝርዝር ታክሏል።", savedRemoved: "{name} ከተቀመጡት ዝርዝር ተወግዷል።",
    callUpper: "አሁኑኑ ይደውሉ",
  },
};

const apiAssetUrl = (url) => {
  return url || "";
};

const bedroomLabel = (beds, t) =>
  Number(beds) === 0 ? t.studioShort : `${beds} ${t.beds}`;

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

function AutoCarousel({ itemCount, className, label, children, t }) {
  const trackRef = React.useRef(null);
  const animationRef = React.useRef(0);
  const snapRestoreRef = React.useRef(null);
  const cycleWidthRef = React.useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const items = React.Children.toArray(children);
  const loopItems = [
    ...items,
    ...(items.length > 1
      ? [0, 1, 2].flatMap((copyIndex) => items.map((item, index) => (
        <div className="carousel-loop-copy" key={`loop-copy-${copyIndex}-${index}`} aria-hidden="true">
          {item}
        </div>
      )))
      : []),
  ];

  const cancelAnimation = React.useCallback(() => {
    window.cancelAnimationFrame(animationRef.current);
    animationRef.current = 0;
    if (snapRestoreRef.current) {
      snapRestoreRef.current.track.style.scrollSnapType = snapRestoreRef.current.scrollSnapType;
      snapRestoreRef.current = null;
    }
  }, []);

  const scrollTo = React.useCallback((track, target) => {
    cancelAnimation();
    const start = track.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = target;
      return;
    }

    const duration = Math.min(4200, Math.max(1300, Math.abs(distance) / 0.18));
    const scrollSnapType = track.style.scrollSnapType;
    snapRestoreRef.current = { track, scrollSnapType };
    track.style.scrollSnapType = "none";
    const startedAt = performance.now();
    function animate(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 0.5 - Math.cos(Math.PI * progress) / 2;
      track.scrollLeft = start + distance * eased;
      if (progress < 1) animationRef.current = window.requestAnimationFrame(animate);
      else {
        const firstCopy = track.children[itemCount];
        const firstCopyItem = firstCopy?.firstElementChild || firstCopy;
        const cycleWidth = firstCopy
          ? firstCopyItem.getBoundingClientRect().left - track.children[0].getBoundingClientRect().left
          : 0;
        if (cycleWidth > 0 && track.scrollLeft >= cycleWidth) track.scrollLeft %= cycleWidth;
        animationRef.current = 0;
        track.style.scrollSnapType = scrollSnapType;
        snapRestoreRef.current = null;
      }
    }
    animationRef.current = window.requestAnimationFrame(animate);
  }, [cancelAnimation]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    track.querySelectorAll(".carousel-loop-copy").forEach((copy) => {
      copy.setAttribute("inert", "");
      copy.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((element) => {
        element.setAttribute("tabindex", "-1");
      });
    });
    return undefined;
  }, [itemCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isVisible || itemCount < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    function measureCycle() {
      const firstCopy = track.children[itemCount];
      const firstCopyItem = firstCopy?.firstElementChild || firstCopy;
      cycleWidthRef.current = firstCopy
        ? firstCopyItem.getBoundingClientRect().left - track.children[0].getBoundingClientRect().left
        : 0;
    }
    measureCycle();
    window.addEventListener("resize", measureCycle);
    let frame = 0;
    let previousTime = 0;
    function animate(now) {
      if (previousTime && !document.hidden && !animationRef.current) {
        const cycleWidth = cycleWidthRef.current;
        if (cycleWidth > 0) {
          track.scrollLeft += (now - previousTime) * 0.024;
          if (track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
        }
      }
      previousTime = now;
      frame = window.requestAnimationFrame(animate);
    }
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureCycle);
    };
  }, [isVisible, itemCount]);

  useEffect(() => () => cancelAnimation(), [cancelAnimation]);

  function move(direction) {
    const track = trackRef.current;
    const firstItem = track?.firstElementChild;
    if (!track || !firstItem) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const step = firstItem.getBoundingClientRect().width + gap;
    const cycleWidth = cycleWidthRef.current || track.scrollWidth / 2;
    const target = direction > 0
      ? track.scrollLeft + step
      : track.scrollLeft <= 8 ? cycleWidth - step : track.scrollLeft - step;
    scrollTo(track, target);
  }

  return (
    <div className="carousel-shell">
      <div className="carousel-controls" aria-label={label}>
        <button type="button" onClick={() => move(-1)} aria-label={t.previousSlide}><span aria-hidden="true">←</span></button>
        <button type="button" onClick={() => move(1)} aria-label={t.nextSlide}><span aria-hidden="true">→</span></button>
      </div>
      <div
        ref={trackRef}
        className={className}
        role="region"
        aria-label={label}
        tabIndex={0}
        onWheel={cancelAnimation}
        onPointerDown={cancelAnimation}
        onKeyDown={cancelAnimation}
      >
        {loopItems}
      </div>
    </div>
  );
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

function readLanguage() {
  try {
    return localStorage.getItem("site-language") === "am" ? "am" : "en";
  } catch (error) {
    console.error("Could not read the language preference from this browser:", error);
    return "en";
  }
}

function isPastSalesPage() {
  return window.location.pathname === "/sold-homes" || window.location.hash === "#sold-homes";
}

function PropertyCard({ home: sourceHome, saved, onSave, onOpen, settings, language, t }) {
  const home = localizeHome(sourceHome, language);
  const formattedPrice = formatCurrency(home.price, settings.currency_code, language);
  const price = t.fromPrice.replace("{price}", formattedPrice);
  const downPayment = t.downPayment.replace(
    "{amount}",
    formatCurrency(calculateDownPayment(home.price), settings.currency_code, language),
  );

  return (
    <article className={`property-card property-card-${home.property_type.toLowerCase()}`}>
      <button className="image-button" onClick={() => onOpen(home)} aria-label={`${t.viewDetails}: ${home.title}`}>
        <span className="no-property-image">{home.property_type === "Apartment" ? t.apartment : t.shop}</span>
        <PropertyMedia imageUrl={home.image_url} videoUrl={home.video_url} alt={home.title} className="property-card-media" />
        <span className="status-pill">{home.status === "Under contract" ? t.underContract : home.status === "Sold" ? t.previouslySold : t.forSale}</span>
        <span className="type-pill">{home.property_type === "Apartment" ? t.apartment : t.shop}</span>
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
          <span className="property-title">{home.title}</span>
          <span className="property-price">{price}</span>
        </span>
        {home.status !== "Sold" && Number(home.price) > 0 && <span className="property-down-payment">{downPayment}</span>}
        <span className="property-location"><Icon name="pin" size={15} />{home.location}</span>
        {home.description && <span className="property-description">{home.description}</span>}
        <span className="property-specs">
          {home.property_type === "Apartment" ? (
            <span title={Number(home.beds) === 0 ? t.studio : undefined}><Icon name="bed" size={16} />{bedroomLabel(home.beds, t)}</span>
          ) : (
            <span className="property-use">{t.retailSpace}</span>
          )}
          <span><Icon name="area" size={16} />{Number(home.area).toLocaleString()} {settings.area_unit || "sqft"}</span>
        </span>
        <span className="property-card-link">{t.viewDetails} <Icon name="arrow" size={15} /></span>
      </button>
    </article>
  );
}

function InquiryModal({ home, onClose, settings, language, t }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(home?.image_url || "");
  const phoneDigits = (settings.contact_phone || "").replace(/[^\d+]/g, "");
  const whatsappDigits = (settings.whatsapp_number || "").replace(/\D/g, "");
  const gallery = home
    ? [...new Set([home.image_url, ...(Array.isArray(home.gallery_urls) ? home.gallery_urls : [])].filter(Boolean))]
    : [];
  const price = home ? new Intl.NumberFormat(language === "am" ? "am-ET" : "en-ET", {
    style: "currency",
    currency: settings.currency_code || "ETB",
    maximumFractionDigits: 0,
  }).format(home.price) : "";
  const downPayment = home
    ? t.downPayment.replace(
      "{amount}",
      formatCurrency(calculateDownPayment(home.price), settings.currency_code, language),
    )
    : "";
  const directContacts = [
    phoneDigits && { name: t.call, detail: settings.contact_phone, href: `tel:${phoneDigits}`, mark: "☎" },
    whatsappDigits && { name: "WhatsApp", detail: settings.whatsapp_number, href: `https://wa.me/${whatsappDigits}`, mark: "W" },
    settings.telegram_url && { name: "Telegram", detail: t.msgUs, href: settings.telegram_url, mark: "➤" },
    settings.facebook_url && { name: "Facebook", detail: t.visitProfile, href: settings.facebook_url, mark: "f" },
    settings.instagram_url && { name: "Instagram", detail: t.visitProfile, href: settings.instagram_url, mark: "◎" },
    settings.tiktok_url && { name: "TikTok", detail: t.visitProfile, href: settings.tiktok_url, mark: "♪" },
  ].filter(Boolean);

  async function submitInquiry(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      if (!supabase) throw new Error(t.formNotReady);
      const { error: insertError } = await supabase.from("inquiries").insert({
        name: form.get("name"),
        phone: form.get("phone"),
        property_id: home?.id ?? null,
      });
      if (insertError) throw insertError;
      setSent(true);
    } catch (requestError) {
      setError(requestError.message || t.formSendError);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`inquiry-modal${home ? " property-detail-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
        <button className="modal-close" onClick={onClose} aria-label={t.close}><Icon name="close" /></button>
        {sent ? (
          <div className="success-state">
            <span className="success-mark">✓</span>
            <p className="eyebrow">{t.noteReceived}</p>
            <h2 id="inquiry-title">{t.inTouch}</h2>
            <p>{t.thanks}</p>
            <button className="button button-dark" onClick={onClose}>{t.thankYou}</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">{t.modalEyebrow}</p>
            <h2 id="inquiry-title">{home ? (home.status === "Sold" ? t.lookingSimilar : t.curious) : t.inquireTitle}</h2>
            {home && <p className="modal-home-name">{home.title}</p>}
            {home && (
              <section className="property-detail-content" aria-label={t.propertyDetails}>
                <div className="property-detail-gallery">
                  {activePhoto ? (
                    <img className="property-detail-main-photo" src={apiAssetUrl(activePhoto)} alt={home.title} />
                  ) : (
                    <div className="property-detail-no-photo">{t.noPhotos}</div>
                  )}
                  {gallery.length > 1 && (
                    <div className="property-detail-thumbnails" aria-label={t.propertyGallery}>
                      {gallery.map((image, index) => (
                        <button
                          className={image === activePhoto ? "is-active" : ""}
                          type="button"
                          key={image}
                          onClick={() => setActivePhoto(image)}
                          aria-label={`${t.propertyGallery} ${index + 1}`}
                          aria-pressed={image === activePhoto}
                        >
                          <img src={apiAssetUrl(image)} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="property-detail-summary">
                  <p className="property-detail-price">{t.fromPrice.replace("{price}", price)}</p>
                  {home.status !== "Sold" && Number(home.price) > 0 && (
                    <p className="property-detail-down-payment">{downPayment}</p>
                  )}
                  <p className="property-detail-location"><Icon name="pin" size={16} />{home.location}</p>
                  <div className="property-detail-facts">
                    {home.property_type === "Apartment" && (
                      <div><small>{t.bedroomsLabel}</small><strong>{Number(home.beds) === 0 ? t.studio : home.beds || "—"}</strong></div>
                    )}
                    <div><small>{t.sizeLabel}</small><strong>{Number(home.area).toLocaleString(language === "am" ? "am-ET" : "en-ET")} {settings.area_unit || "sqft"}</strong></div>
                    <div><small>{t.typeLabel}</small><strong>{home.property_type === "Apartment" ? t.apartment : t.shop}</strong></div>
                    <div><small>{t.statusLabel}</small><strong>{home.status === "Under contract" ? t.underContract : home.status === "Sold" ? t.previouslySold : t.forSale}</strong></div>
                  </div>
                  {home.description && (
                    <div className="property-detail-description">
                      <h3>{t.descriptionLabel}</h3>
                      <p>{home.description}</p>
                    </div>
                  )}
                  {home.video_url && <video className="property-video" src={apiAssetUrl(home.video_url)} controls playsInline preload="metadata">{t.videoTour}</video>}
                </div>
              </section>
            )}
            <div className="direct-contact">
              <div className="direct-contact-heading">
                <span>{home ? t.askAboutHome : t.preferTalk}</span>
                <p>{t.chooseContactSimple}</p>
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
              ) : null}
            </div>
            <form className="inquiry-form" onSubmit={submitInquiry}>
              <label>{t.yourName}<input name="name" required autoComplete="name" placeholder={t.namePlaceholder} /></label>
              <label>{t.phone}<input name="phone" type="tel" autoComplete="tel" placeholder={t.phonePlaceholder} required /></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-dark submit-button" type="submit" disabled={sending}>
                {sending ? t.sending : t.requestCall} <Icon name="arrow" size={17} />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function PublicSite() {
  const [soldPage, setSoldPage] = useState(isPastSalesPage);
  const [language, setLanguage] = useState(readLanguage);
  const t = UI_COPY[language];
  const [branding, setBranding] = useState({
    brand_name: "Zenebe Frew Real Estate",
    logo_url: "",
    agent_name: "",
    agent_title: "Real Estate Professional",
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
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("featured");
  const [saved, setSaved] = useState(readSavedHomes);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedAnnouncement, setSavedAnnouncement] = useState("");
  const [selectedHome, setSelectedHome] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [apiNotice, setApiNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;

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
  const featuredHomes = homes.filter((home) => home.featured);
  const listingAreas = [...new Set(homes.map((home) => localizeHome(home, language).location?.trim()).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second));
  const areaCards = listingAreas.map((location) => {
    const homesInArea = homes.filter((home) => localizeHome(home, language).location?.trim() === location);
    const mediaHome = homesInArea.find((home) => home.image_url || home.video_url);
    return { location, homes: homesInArea, image: mediaHome?.image_url, video: mediaHome?.video_url };
  });
  const currentListings = homes.filter((home) => home.status === "For sale");
  const liveStats = [
    { value: homes.length, label: "activeListings" },
    { value: currentListings.filter((home) => home.property_type === "Apartment").length, label: "apartmentsForSale" },
    { value: currentListings.filter((home) => home.property_type === "Shop").length, label: "shopsForSale" },
    { value: listingAreas.length, label: "neighborhoods" },
  ];
  const heroHome = homes.find((home) => home.video_url) || homes[0] || fallbackHomes[0];
  const heroImage = heroHome.image_url || fallbackHomes[0].image_url;
  const heroVideo = heroHome.video_url || "";
  const [heroMuted, setHeroMuted] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("site-theme") !== "light");
  const [compareIds, setCompareIds] = useState([]);
  const compareHomes = compareIds
    .map((id) => homes.find((home) => home.id === id))
    .filter(Boolean)
    .map((home) => localizeHome(home, language));

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
    document.documentElement.lang = language;
    try {
      localStorage.setItem("site-language", language);
    } catch (error) {
      console.error("Could not save the language preference in this browser:", error);
    }
  }, [language]);

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
    const brandName = branding.brand_name || "Zenebe Frew Real Estate";
    const titleTemplate = soldPage ? t.soldPageTitle : t.siteTitle;
    const descriptionTemplate = soldPage ? t.soldPageDescription : t.siteDescription;
    const title = titleTemplate.replace("{brand}", brandName);
    const description = descriptionTemplate.replace("{brand}", brandName);
    const canonicalUrl = new URL(soldPage ? "/sold-homes" : "/", window.location.origin).href;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
  }, [branding.brand_name, soldPage, t.siteTitle, t.soldPageTitle, t.siteDescription, t.soldPageDescription]);

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
    const footer = document.querySelector(".site-footer");
    if (!footer) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle("footer-in-view", entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(footer);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("footer-in-view");
    };
  }, []);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle("hero-in-view", entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(hero);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("hero-in-view");
    };
  }, [soldPage]);

  useEffect(() => {
    const targets = document.querySelectorAll(
      ".stats-band, .section-heading, .project-tile, .area-card, .guide-card, .faq-panel, .contact-section",
    );
    if (!("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    targets.forEach((target) => {
      target.classList.add("scroll-reveal");
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, [homes.length, soldPage]);

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
      if (active) {
        setHomes(data || []);
      }
    }).catch((error) => {
      if (active) {
        console.error("Could not load listings from Supabase:", error);
        setApiNotice(soldPage ? t.pastSalesError : t.listingsError);
      }
    });
    return () => {
      active = false;
    };
  }, [soldPage, t.listingsError, t.pastSalesError]);

  const filteredHomes = useMemo(() => {
    const matching = homes.filter((home) => {
      const localizedHome = localizeHome(home, language);
      const matchesQuery = !query || `${localizedHome.title} ${localizedHome.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = !type || home.property_type === type;
      const matchesBedrooms = !bedrooms
        || (home.property_type === "Apartment" && (bedrooms === "studio"
          ? Number(home.beds) === 0
          : Number(home.beds) >= Number(bedrooms)));
      const matchesAvailability = !availability || home.status === availability;
      const matchesBudget = !maxPrice || home.price <= Number(maxPrice);
      return matchesQuery && matchesType && matchesBedrooms && matchesAvailability && matchesBudget;
    });
    if (sort === "price-low") matching.sort((a, b) => a.price - b.price);
    if (sort === "price-high") matching.sort((a, b) => b.price - a.price);
    return matching;
  }, [homes, language, query, type, bedrooms, availability, maxPrice, sort]);
  const visibleHomes = savedOnly
    ? filteredHomes.filter((home) => saved.includes(home.id))
    : filteredHomes;

  function toggleSaved(id) {
    const home = homes.find((item) => item.id === id);
    const alreadySaved = saved.includes(id);
    setSaved((current) => alreadySaved
      ? current.filter((item) => item !== id)
      : [...current, id]);
    setSavedAnnouncement((alreadySaved ? t.savedRemoved : t.savedAdded).replace("{name}", home?.title || t.home));
  }

  function toggleCompare(id) {
    setCompareIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < 3 ? [...current, id] : current);
  }

  function browseArea(area) {
    setQuery(area);
    document.getElementById("homes")?.scrollIntoView({ behavior: "smooth" });
  }

  function displayPrice(price) {
    const formattedPrice = formatCurrency(price, branding.currency_code, language);
    return t.fromPrice.replace("{price}", formattedPrice);
  }

  function displayDownPayment(price) {
    return t.downPayment.replace(
      "{amount}",
      formatCurrency(calculateDownPayment(price), branding.currency_code, language),
    );
  }

  function searchSubmit(event) {
    event.preventDefault();
    document.getElementById("homes")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header className={`site-header${soldPage ? " site-header-solid" : " site-header-hero"}`}>
        <Brand settings={branding} />
        <button className="language-toggle language-toggle-mobile" type="button" onClick={() => setLanguage((current) => current === "en" ? "am" : "en")} aria-label={t.languageTitle} title={t.languageTitle}>
          {t.language}
        </button>
        <a
          className="mobile-header-call"
          href={phoneDigits ? `tel:${phoneDigits}` : "#contact"}
          aria-label={t.contactAgent}
        >
          <Icon name="phone" size={17} />
          <span>{phoneDigits ? t.callNow : t.contact}</span>
        </a>
        <button className="mobile-menu-toggle" aria-label={menuOpen ? t.closeMenu : t.openMenu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label={t.home}>
          <a href="/" onClick={() => setMenuOpen(false)}>{t.home}</a>
          <a href="/#homes" onClick={() => setMenuOpen(false)}>{t.listings}</a>
          {!soldPage && <a href="/#projects" onClick={() => setMenuOpen(false)}>{t.projects}</a>}
          {!soldPage && <a href="/#areas" onClick={() => setMenuOpen(false)}>{t.areas}</a>}
          {!soldPage && <a href="/#buying-guide" onClick={() => setMenuOpen(false)}>{t.buyingGuide}</a>}
          <a href="/#contact" onClick={() => setMenuOpen(false)}>{t.contact}</a>
          <a href="/#sold-homes" onClick={() => setMenuOpen(false)}>{t.pastSales}</a>
          <button className="language-toggle language-toggle-desktop" type="button" onClick={() => setLanguage((current) => current === "en" ? "am" : "en")} aria-label={t.languageTitle} title={t.languageTitle}>
            {t.language}
          </button>
          <button className="theme-toggle" onClick={() => setDarkMode((current) => !current)} aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`} title={`Switch to ${darkMode ? "light" : "dark"} mode`}>
            <Icon name={darkMode ? "sun" : "moon"} size={17} />
          </button>
          <a
            className={phoneDigits ? "nav-call" : "nav-contact"}
            href={phoneDigits ? `tel:${phoneDigits}` : (soldPage ? "/#contact" : "#contact")}
            onClick={() => setMenuOpen(false)}
          >
            {phoneDigits ? t.callNow : t.contactAgent} <Icon name="arrow" size={16} />
          </a>
        </nav>
      </header>

      {soldPage ? (
        <main>
          <section className="sold-page section-shell">
            <p className="eyebrow">{t.soldEyebrow}</p>
            <h1>{t.previouslySold}</h1>
            <p className="section-intro">{t.soldIntro}</p>
            {apiNotice && <p className="api-notice" role="status">{apiNotice}</p>}
            {homes.length ? (
              <div className="property-grid" role="region" aria-label={t.soldEyebrow} tabIndex={0}>
                {homes.map((home) => <PropertyCard key={home.id} home={home} settings={branding} language={language} t={t} saved={saved.includes(home.id)} onSave={toggleSaved} onOpen={setSelectedHome} />)}
              </div>
            ) : (
              <div className="empty-results"><span>⌂</span><h3>{t.soldEmpty}</h3><p>{t.pastSalesAdded}</p><a className="text-link" href="/#contact">{t.getInTouch} <Icon name="arrow" size={16} /></a></div>
            )}
            <div className="center-action"><a href="/#contact" className="button button-outline">{t.getInTouch} <Icon name="arrow" size={17} /></a></div>
          </section>
        </main>
      ) : (
      <main>
        <section className="hero">
          <div className="hero-image" style={{ backgroundImage: `url("${heroImage}")` }}>
            {heroVideo && <video className="hero-background-video" src={apiAssetUrl(heroVideo)} poster={apiAssetUrl(heroImage)} autoPlay muted={heroMuted} loop playsInline aria-hidden="true" />}
          </div>
          {heroVideo && (
            <button className="hero-video-toggle" type="button" onClick={() => setHeroMuted((current) => !current)} aria-label={heroMuted ? t.unmuteVideo : t.muteVideo}>
              <span aria-hidden="true">{heroMuted ? "◖" : "◗"}</span>
            </button>
          )}
          <div className="hero-content">
            <span className="hero-kicker"><span /> {t.kicker}</span>
            <h1>{t.heroLead}<br /><em>{t.heroEmphasis}</em></h1>
            <p>{t.heroDescription}</p>
            <div className="hero-actions">
              <a className="button button-blue" href="#homes">{t.exploreListings} <Icon name="arrow" size={17} /></a>
              <button className="button hero-outline" type="button" onClick={() => setInquiryOpen(true)}>{t.bookViewing}</button>
            </div>
          </div>
          <div className="hero-note" aria-hidden="true">
            <span className="hero-note-mark">✦</span>
            <span><strong>{t.planMove}</strong><small>{t.planDescription}</small></span>
          </div>
          <form className="search-panel" onSubmit={searchSubmit}>
            <label className="search-location">
              <span>{t.area}</span>
              <span className="search-input-wrap"><Icon name="pin" size={18} /><input list="property-locations" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.areaPlaceholder} /></span>
              <datalist id="property-locations">
                {listingAreas.map((area) => <option value={area} key={area} />)}
              </datalist>
            </label>
            <label className="search-type">
              <span>{t.propertyType}</span>
              <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="">{t.allSpaces}</option>
                <option value="Apartment">{t.apartment}</option>
                <option value="Shop">{t.shop}</option>
              </select>
            </label>
            <label className="search-bedrooms">
              <span>{t.bedrooms}</span>
              <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
                <option value="">{t.anyNumber}</option>
                <option value="studio">{t.studio}</option>
                <option value="1">1 {t.orMore}</option>
                <option value="2">2 {t.orMore}</option>
                <option value="3">3 {t.orMore}</option>
              </select>
            </label>
            <label className="search-budget">
              <span>{t.maxPrice}</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder={t.anyBudget}
                aria-label={t.maxPrice}
              />
            </label>
            <label className="search-status">
              <span>{t.availability}</span>
              <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                <option value="">{t.allCurrent}</option>
                <option value="For sale">{t.forSale}</option>
                <option value="Under contract">{t.underContract}</option>
              </select>
            </label>
            <button className="search-submit" type="submit"><Icon name="search" size={19} /><span>{t.search}</span></button>
          </form>
        </section>

        {!soldPage && (
          <section className="stats-band" aria-label="Current listing statistics">
            <div className="stats-band-heading">
              <p className="eyebrow">{t.currentCollection}</p>
              <span>{t.statsNote}</span>
            </div>
            <div className="stats-grid">
              {liveStats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{t[stat.label]}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="listings-section section-shell" id="homes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.collectionEyebrow}</p>
              <h2>{t.exploreCollection} <em>{t.listingsWord}</em></h2>
              <p className="section-intro">{t.browseCopy}</p>
            </div>
            <div className="listing-controls">
              <span>{visibleHomes.length} {visibleHomes.length === 1 ? t.property : t.properties}</span>
              <button
                className={`saved-filter${savedOnly ? " is-active" : ""}`}
                type="button"
                onClick={() => setSavedOnly((current) => !current)}
                aria-pressed={savedOnly}
              >
                <Icon name="heart" size={15} /> {t.saved} <span className="saved-count">{saved.length}</span>
              </button>
              <label className="sort-control"><span className="sr-only">Sort homes</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">{t.featuredFirst}</option>
                  <option value="price-low">{t.priceLow}</option>
                  <option value="price-high">{t.priceHigh}</option>
                </select>
              </label>
            </div>
          </div>
          {apiNotice && <p className="api-notice" role="status">{apiNotice}</p>}
          <p className="sr-only" aria-live="polite">{savedAnnouncement}</p>
          {visibleHomes.length ? (
            <AutoCarousel itemCount={visibleHomes.length} className="property-grid" label={t.collectionEyebrow} t={t}>
              {visibleHomes.map((home) => <PropertyCard key={home.id} home={home} settings={branding} language={language} t={t} saved={saved.includes(home.id)} onSave={toggleSaved} onOpen={setSelectedHome} />)}
            </AutoCarousel>
          ) : (
            <div className="empty-results"><span>⌂</span><h3>{savedOnly ? t.noSaved : t.noMatches}</h3><p>{savedOnly ? t.savedHint : t.searchHint}</p><button className="text-link" onClick={() => { setQuery(""); setType(""); setBedrooms(""); setAvailability(""); setMaxPrice(""); setSavedOnly(false); }}>{t.showAll} <Icon name="arrow" size={16} /></button></div>
          )}
          {visibleHomes.length > 0 && (
            <section className="inventory-section" aria-labelledby="inventory-title">
              <div className="section-heading inventory-heading">
                <div>
                  <p className="eyebrow">{t.compareLimit}</p>
                  <h3 id="inventory-title">{t.inventoryTitle}</h3>
                  <p className="section-intro">{t.inventoryIntro}</p>
                </div>
                <span className="compare-count">{t.comparing}: {compareHomes.length}/3</span>
              </div>
              <div className="data-table-scroll">
                <table className="listing-data-table">
                  <thead>
                    <tr>
                      <th scope="col">{t.listingLabel}</th>
                      <th scope="col">{t.typeLabel}</th>
                      <th scope="col">{t.locationLabel}</th>
                      <th scope="col">{t.bedroomsShort}</th>
                      <th scope="col">{t.areaLabel}</th>
                      <th scope="col">{t.priceLabel}</th>
                      <th scope="col">{t.downPaymentLabel}</th>
                      <th scope="col">{t.statusLabel}</th>
                      <th scope="col">{t.compare}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleHomes.map((sourceHome) => {
                      const home = localizeHome(sourceHome, language);
                      const selected = compareIds.includes(home.id);
                      return (
                        <tr key={home.id}>
                          <th scope="row"><button className="table-home-link" type="button" onClick={() => setSelectedHome(home)}>{home.title}</button></th>
                          <td>{home.property_type === "Apartment" ? t.apartment : t.shop}</td>
                          <td>{home.location}</td>
                          <td>{home.property_type === "Apartment" ? bedroomLabel(home.beds, t) : "—"}</td>
                          <td>{Number(home.area).toLocaleString(language === "am" ? "am-ET" : "en-ET")} {branding.area_unit || "sqft"}</td>
                          <td>{displayPrice(home.price)}</td>
                          <td>{home.status === "Sold" ? "—" : displayDownPayment(home.price)}</td>
                          <td>{home.status === "Under contract" ? t.underContract : home.status === "Sold" ? t.previouslySold : t.forSale}</td>
                          <td>
                            <button
                              className={`table-compare-button${selected ? " is-selected" : ""}`}
                              type="button"
                              onClick={() => toggleCompare(home.id)}
                              disabled={!selected && compareIds.length >= 3}
                              aria-pressed={selected}
                              aria-label={`${t.selectForCompare}: ${home.title}`}
                            >
                              {selected ? "✓" : "+"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {compareHomes.length >= 2 ? (
                <div className="comparison-table-wrap">
                  <h3>{t.compare} ({compareHomes.length})</h3>
                  <div className="data-table-scroll">
                    <table className="comparison-table">
                      <thead>
                        <tr><th scope="col">{t.listingLabel}</th>{compareHomes.map((home) => <th scope="col" key={home.id}>{home.title}</th>)}</tr>
                      </thead>
                      <tbody>
                        <tr><th scope="row">{t.typeLabel}</th>{compareHomes.map((home) => <td key={home.id}>{home.property_type === "Apartment" ? t.apartment : t.shop}</td>)}</tr>
                        <tr><th scope="row">{t.locationLabel}</th>{compareHomes.map((home) => <td key={home.id}>{home.location}</td>)}</tr>
                        <tr><th scope="row">{t.bedroomsShort}</th>{compareHomes.map((home) => <td key={home.id}>{home.property_type === "Apartment" ? bedroomLabel(home.beds, t) : "—"}</td>)}</tr>
                        <tr><th scope="row">{t.areaLabel}</th>{compareHomes.map((home) => <td key={home.id}>{Number(home.area).toLocaleString(language === "am" ? "am-ET" : "en-ET")} {branding.area_unit || "sqft"}</td>)}</tr>
                        <tr><th scope="row">{t.priceLabel}</th>{compareHomes.map((home) => <td key={home.id}>{displayPrice(home.price)}</td>)}</tr>
                        <tr><th scope="row">{t.downPaymentLabel}</th>{compareHomes.map((home) => <td key={home.id}>{home.status === "Sold" ? "—" : displayDownPayment(home.price)}</td>)}</tr>
                        <tr><th scope="row">{t.statusLabel}</th>{compareHomes.map((home) => <td key={home.id}>{home.status === "Under contract" ? t.underContract : home.status === "Sold" ? t.previouslySold : t.forSale}</td>)}</tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="compare-hint">{t.chooseTwo}</p>
              )}
            </section>
          )}
          <div className="center-action"><a href="/#sold-homes" className="text-link">{t.completedSales} <Icon name="arrow" size={16} /></a></div>
        </section>

        <section className="projects-section section-shell" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.closerLook}</p>
              <h2>{t.featuredProperties}</h2>
              <p className="section-intro">{t.featuredDescription}</p>
            </div>
            <a href="#homes" className="text-link">Explore listings <Icon name="arrow" size={16} /></a>
          </div>
          {featuredHomes.length ? (
            <AutoCarousel itemCount={featuredHomes.length} className="project-grid featured-carousel" label={t.featuredProperties} t={t}>
              {featuredHomes.map((home) => (
                <button className="project-tile" key={home.id} onClick={() => setSelectedHome(home)}>
                  <span className="project-tile-placeholder" aria-hidden="true" />
                  <PropertyMedia imageUrl={home.image_url} videoUrl={home.video_url} alt={home.title} className="project-tile-media" />
                  <span className="project-tile-shade" />
                  <span className="project-tile-label">{home.property_type === "Apartment" ? t.apartment : t.shop} · {language === "am" ? (home.location_am || home.location) : home.location}</span>
                  <span className="project-tile-title">{language === "am" ? (home.title_am || home.title) : home.title}</span>
                  <span className="project-tile-link">{t.viewProperty} <Icon name="arrow" size={16} /></span>
                </button>
              ))}
            </AutoCarousel>
          ) : (
            <div className="empty-results"><h3>{t.featuredEmpty}</h3><p>{t.featuredEmptyHint}</p></div>
          )}
        </section>

        <section className="area-section section-shell" id="areas">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.areaBrowse}</p>
              <h2>{t.areaBrowse}</h2>
              <p className="section-intro">{t.areaBrowseIntro}</p>
            </div>
          </div>
          {areaCards.length ? (
            <div className="area-card-grid">
              {areaCards.map((area) => (
                <button className="area-card" type="button" key={area.location} onClick={() => browseArea(area.location)}>
                  <span className="area-card-placeholder" aria-hidden="true"><Icon name="pin" size={28} /></span>
                  <PropertyMedia imageUrl={area.image} videoUrl={area.video} className="area-card-media" />
                  <span className="area-card-shade" />
                  <span className="area-card-copy"><strong>{area.location}</strong><small>{area.homes.length} {area.homes.length === 1 ? t.property : t.properties}</small><span>{t.viewArea} <Icon name="arrow" size={15} /></span></span>
                </button>
              ))}
            </div>
          ) : <p className="empty-area-copy">{t.noAreas}</p>}
        </section>

        <section className="buying-guide section-shell" id="buying-guide">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.clearStart}</p>
              <h2>{t.planMove} <em>{t.move}</em></h2>
              <p className="section-intro">{t.planDescription}</p>
            </div>
          </div>
          <div className="guide-grid">
            <article className="guide-card">
              <span className="guide-number">01</span>
              <h3>{t.guideExplore}</h3>
              <p>{t.guideExploreCopy}</p>
            </article>
            <article className="guide-card">
              <span className="guide-number">02</span>
              <h3>{t.guideCompare}</h3>
              <p>{t.guideCompareCopy}</p>
            </article>
            <article className="guide-card">
              <span className="guide-number">03</span>
              <h3>{t.guideTalk}</h3>
              <p>{t.guideTalkCopy}</p>
            </article>
          </div>
          <div className="faq-panel">
            <div className="faq-heading">
              <p className="eyebrow">{t.goodToKnow}</p>
              <h2>{t.questions}</h2>
            </div>
            <div className="faq-list">
              <details>
                <summary>{t.faqTypes}</summary>
                <p>{t.faqTypesAnswer}</p>
              </details>
              <details>
                <summary>{t.faqAreas}</summary>
                <p>{t.faqAreasAnswer}</p>
              </details>
              <details>
                <summary>{t.faqViewing}</summary>
                <p>{t.faqViewingAnswer}</p>
              </details>
              <details>
                <summary>{t.faqSave}</summary>
                <p>{t.faqSaveAnswer}</p>
              </details>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">{t.contactEyebrow}</p>
            <h2>{t.contactTitle}<br /><em>{t.nextPlace}</em></h2>
            <p>{t.contactDescription}</p>
            {phoneDigits && (
              <a className="contact-primary-action" href={`tel:${phoneDigits}`}>
                <span className="contact-action-icon"><Icon name="phone" size={19} /></span>
                <span><small>{t.callUpper}</small><strong>{branding.contact_phone}</strong></span>
                <Icon name="arrow" size={18} />
              </a>
            )}
          </div>
          <div className="contact-card">
            <div className="contact-card-heading">
              <span className="contact-card-icon"><Icon name="home" size={21} /></span>
              <span><strong>{t.connect}</strong><small>{t.chooseContact}</small></span>
            </div>
            <div className="contact-channels">
              {configuredSocialLinks.length ? configuredSocialLinks.map((item) => (
                <a className="contact-channel" href={item.href} key={item.name} target="_blank" rel="noreferrer">
                  <span className={`contact-channel-mark channel-${item.name.toLowerCase()}`}>{item.mark}</span>
                  <span><strong>{item.name}</strong><small>{item.account || t.msgUs}</small></span>
                  <Icon name="arrow" size={16} />
                </a>
              )) : null}
            </div>
            <p className="contact-card-note"><span>✦</span> {t.friendlyAdvice}</p>
          </div>
        </section>
      </main>
      )}

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-about">
            <Brand settings={branding} footer />
            <p>{t.footerDescription}</p>
            <span className="footer-tagline">{t.footerTagline}</span>
          </div>
          <nav className="footer-column" aria-label={t.footerExplore}>
            <h2>{t.footerExplore}</h2>
            <a href="/#homes">{t.listings}</a>
            <a href="/#projects">{t.projects}</a>
            <a href="/#buying-guide">{t.buyingGuide}</a>
            <a href="/#sold-homes">{t.pastSales}</a>
          </nav>
          <div className="footer-column">
            <h2>{t.footerAreas}</h2>
            {listingAreas.length ? listingAreas.slice(0, 5).map((area) => (
              <button type="button" key={area} onClick={() => browseArea(area)}>{area}</button>
            )) : <span>{t.footerNoAreas}</span>}
          </div>
          <div className="footer-column footer-contact-column">
            <h2>{t.footerVisit}</h2>
            {phoneDigits && <a href={`tel:${phoneDigits}`}><Icon name="phone" size={15} />{t.callBusiness} · {branding.contact_phone}</a>}
            {configuredSocialLinks.map((item) => (
              <a href={item.href} key={item.name} target="_blank" rel="noreferrer">{item.name}</a>
            ))}
            {!phoneDigits && !configuredSocialLinks.length && <a href="/#contact">{t.contact}</a>}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {branding.brand_name}</span>
          <a href="/#contact">{t.contact}</a>
        </div>
      </footer>

      {configuredSocialLinks.length > 0 && (
        <nav className="floating-contact" aria-label={t.contact}>
        {configuredSocialLinks.map((item) => (
          <a
            className={`social-circle social-${item.name.toLowerCase()}`}
            href={item.href}
            key={item.name}
            target="_blank"
            rel="noreferrer"
            aria-label={t.contactOn.replace("{name}", item.name)}
            title={item.name}
          >
            <span aria-hidden="true">{item.mark}</span>
          </a>
        ))}
        </nav>
      )}
      {!soldPage && (
        <a
          className="mobile-contact-bar"
          href={phoneDigits ? `tel:${phoneDigits}` : "#contact"}
          aria-label={t.contactAgent}
        >
          <Icon name="phone" size={18} />
          <span>{phoneDigits ? t.callNow : t.contactAgent}</span>
          <Icon name="arrow" size={17} />
        </a>
      )}
      {(selectedHome || inquiryOpen) && (
        <InquiryModal
          key={selectedHome?.id || "general-inquiry"}
          home={selectedHome}
          settings={branding}
          language={language}
          t={t}
          onClose={() => {
            setSelectedHome(null);
            setInquiryOpen(false);
          }}
        />
      )}
    </>
  );
}

export default function App() {
  const isAdminRoute = window.location.pathname.replace(/\/+$/, "") === "/admin";
  return isAdminRoute ? <AdminApp /> : <PublicSite />;
}
