import catalogData from "./catalog.json";
import { resolveCatalogImageUrl } from "./catalogImages";

export type CatalogImage = {
  file: string;
  alt: string;
  role: string;
  sourceUrl: string;
};

export type CatalogSection =
  | { type: "h2"; level: number; text: string }
  | { type: "p"; level: number; text: string }
  | { type: "ul"; level: number; items: string[] };

export type CatalogProduct = {
  slug: string;
  sourceUrl: string;
  title: string;
  h1: string;
  sections: CatalogSection[];
  specs: { label?: string; value?: string }[];
  images: CatalogImage[];
  scrapedAt: string;
};

export type CatalogGroup = {
  maincategory: string;
  subcategory: string;
  relatedproducts: CatalogProduct[];
};

export const catalogGroups: CatalogGroup[] = catalogData as CatalogGroup[];

export function normalizeSubcategoryKey(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Catalog `subcategory` (normalized) → parent category route + sub-product slug for breadcrumbs */
const SUBCATEGORY_TO_APP: Record<string, { parent: string; sub: string }> = {
  "consumer-door-series": { parent: "soundproof-door", sub: "consumer-series" },
  "commercial door series": { parent: "soundproof-door", sub: "commercial-series" },
  "engineering door series": { parent: "soundproof-door", sub: "engineering-series" },
  "holographic-acoustic-module": {
    parent: "engineering-acoustics",
    sub: "holographic-acoustic-module",
  },
  "acoustic-baffles": { parent: "engineering-acoustics", sub: "acoustic-baffles" },
  "fabric-acoustic-panels": {
    parent: "engineering-acoustics",
    sub: "fabric-acoustic-panels",
  },
  "perforated-acoustic-panels": {
    parent: "engineering-acoustics",
    sub: "perforated-acoustic-panels",
  },
  "acoustic-diffuser": { parent: "engineering-acoustics", sub: "acoustic-diffuser" },
  "acoustic-wool-materials": {
    parent: "engineering-acoustics",
    sub: "acoustic-wool-materials",
  },
  "acoustic-cube-panels": { parent: "portable-acoustics", sub: "acoustic-cube" },
  "imagine-acoustic-art": { parent: "portable-acoustics", sub: "imagine-acoustic-art" },
  "eq-series-acoustic-panels": { parent: "portable-acoustics", sub: "eq-series-panels" },
  "aq-smart-acoustic-module": { parent: "portable-acoustics", sub: "aq-smart-module" },
  "qrd-2d-diffuser": { parent: "portable-acoustics", sub: "qrd-2d-diffuser" },
  "mls-3d-diffuser": { parent: "portable-acoustics", sub: "mls-3d-diffuser" },
  "holographic-sound-insulation-module": {
    parent: "sound-insulation",
    sub: "holographic-sound-insulation-module",
  },
  "damping-coating": { parent: "sound-insulation", sub: "damping-coating" },
  "damping-soundproof-flooring": {
    parent: "sound-insulation",
    sub: "damping-soundproof-flooring",
  },
  "noise-control-curtains": { parent: "sound-insulation", sub: "noise-control-curtains" },
  "soundproofing-panels": { parent: "sound-insulation", sub: "soundproofing-panels" },
  "sound-insulation-felts": { parent: "sound-insulation", sub: "soundproofing-panels" },
  "vibration-damping-components": {
    parent: "sound-insulation",
    sub: "vibration-damping-components",
  },
  "universal kit": { parent: "automotive-series", sub: "automotive-universal-kit" },
  "tesla-model-y-specific": {
    parent: "automotive-series",
    sub: "automotive-tesla-model-y",
  },
  "silent-chair-leg-covers": { parent: "noise-accessories", sub: "silent-chair-leg-covers" },
  "sound-level-meter": { parent: "noise-accessories", sub: "sound-level-meter" },
  "silent-ear-plugs": { parent: "noise-accessories", sub: "silent-ear-plugs" },
  "silent-exhaust-fans": { parent: "noise-accessories", sub: "silent-exhaust-fans" },
};

/** App sub-product slug → catalog `subcategory` string (exact as in JSON) for series pages */
const APP_SUB_TO_CATALOG_SUB: Record<string, string> = {
  "consumer-series": "consumer-door-series",
  "commercial-series": "commercial door series",
  "engineering-series": "engineering door series",
  "acoustic-cube": "acoustic-cube-panels",
  "eq-series-panels": "eq-series-acoustic-panels",
  "aq-smart-module": "aq-smart-acoustic-module",
  "automotive-universal-kit": "universal kit",
  "automotive-tesla-model-y": "tesla-model-y-specific",
};

const slugIndex = new Map<
  string,
  { group: CatalogGroup; product: CatalogProduct }
>();

for (const group of catalogGroups) {
  for (const product of group.relatedproducts) {
    slugIndex.set(product.slug, { group, product });
  }
}

export function getCatalogProductBySlug(
  slug: string
): { group: CatalogGroup; product: CatalogProduct } | undefined {
  return slugIndex.get(slug);
}

export function getCatalogContextForSubcategory(
  catalogSubcategory: string
): { parent: string; sub: string } | undefined {
  const key = normalizeSubcategoryKey(catalogSubcategory);
  return SUBCATEGORY_TO_APP[key];
}

export function getRelatedCatalogProducts(slug: string): CatalogProduct[] {
  const entry = slugIndex.get(slug);
  if (!entry) return [];
  return entry.group.relatedproducts.filter((p) => p.slug !== slug);
}

export function getCatalogGroupByAppSubSlug(
  appSubSlug: string
): CatalogGroup | undefined {
  const catalogSub = APP_SUB_TO_CATALOG_SUB[appSubSlug];
  if (catalogSub) {
    const k = normalizeSubcategoryKey(catalogSub);
    return catalogGroups.find(
      (g) => normalizeSubcategoryKey(g.subcategory) === k
    );
  }
  const k = normalizeSubcategoryKey(appSubSlug);
  return catalogGroups.find((g) => normalizeSubcategoryKey(g.subcategory) === k);
}

export function getCatalogProductsForSeriesPage(appSubSlug: string): CatalogProduct[] {
  const group = getCatalogGroupByAppSubSlug(appSubSlug);
  return group?.relatedproducts ?? [];
}

export function getHeroImageUrl(product: CatalogProduct): string | undefined {
  const hero = product.images.find((i) => i.role === "hero");
  const file = hero?.file ?? product.images[0]?.file;
  return file ? resolveCatalogImageUrl(file) : undefined;
}

export function getCatalogGalleryImages(
  product: CatalogProduct
): { url: string; alt: string }[] {
  return product.images
    .filter((i) => i.role !== "hero")
    .map((i) => ({
      url: resolveCatalogImageUrl(i.file) ?? "",
      alt: i.alt || product.title,
    }))
    .filter((x) => x.url);
}

/** Strip trailing CTA-style sections duplicated by ContactSection */
const SKIP_SECTION_TEXT = new Set([
  "we believe that success project comes with success team",
  "start your project todaythe sales team is here to help",
]);

export function filterCatalogSections(sections: CatalogSection[]): CatalogSection[] {
  return sections.filter((s) => {
    if (s.type === "h2" || s.type === "p") {
      const t = s.text.trim().toLowerCase().replace(/\s+/g, " ");
      if (SKIP_SECTION_TEXT.has(t)) return false;
    }
    return true;
  });
}
