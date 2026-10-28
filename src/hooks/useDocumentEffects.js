/**
 * Observable document effects (theme, language, observers) that are page-level
 * concerns, isolated so the main view remains declarative.
 */

import { useEffect } from "react";

/** Toggles a css class when the #contact section scrolls into view. */
export function useContactInView() {
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
}

/** Keeps <title> in sync with brand + language. */
export function usePageTitle(brandName, t) {
  useEffect(() => {
    document.title = t.pageTitle(brandName);
  }, [brandName, t]);
}
