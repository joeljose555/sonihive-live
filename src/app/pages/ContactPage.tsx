import { useEffect } from "react";
import { ContactSection } from "../components/ContactSection";
import { usePageMeta } from "../hooks/usePageMeta";

export function ContactPage() {
  usePageMeta(
    "Contact Sonic Hive Acoustics | Get in Touch",
    "Reach Sonic Hive Acoustics for acoustic engineering, product inquiries, and project support."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <ContactSection />;
}
