import type { CatalogGroup, CatalogProduct, CatalogSection } from "./catalog";
import {
  filterCatalogSections,
  getCatalogGalleryImages,
  getHeroImageUrl,
} from "./catalog";

export function formatCatalogProductTitle(title: string): string {
  const t = title.replace(/\s*[-–]\s*SoundBox\s*$/i, "").trim();
  return t || title;
}

export function getCatalogCardImage(product: CatalogProduct): string {
  return getHeroImageUrl(product) ?? getCatalogGalleryImages(product)[0]?.url ?? "";
}

export function getCatalogCardDescription(product: CatalogProduct): string {
  const sections = filterCatalogSections(product.sections);
  const p = sections.find(
    (s): s is Extract<CatalogSection, { type: "p" }> =>
      s.type === "p" && s.text.trim().length > 24
  );
  const text = p?.text.trim() ?? "";
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export function catalogHeadlineFromSections(
  product: CatalogProduct
): string {
  const sections = filterCatalogSections(product.sections);
  const h2 = sections.find((s) => s.type === "h2" && s.text.trim());
  if (h2 && h2.type === "h2") return h2.text;
  return formatCatalogProductTitle(product.title);
}

export function catalogTaglineFromSections(product: CatalogProduct): string {
  const sections = filterCatalogSections(product.sections);
  const p = sections.find(
    (s): s is Extract<CatalogSection, { type: "p" }> =>
      s.type === "p" && s.text.trim().length > 20
  );
  return p?.text.trim() ?? "";
}

export function catalogCategoryLabel(group: CatalogGroup): string {
  const m = group.maincategory.trim();
  return m ? m.replace(/\b\w/g, (c) => c.toUpperCase()) : "Products";
}
