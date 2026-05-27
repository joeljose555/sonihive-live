const catalogWebpGlob = import.meta.glob<string>("../assets/catalog/**/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

/** JSON `images[].file` uses prefix `images/<slug>/file.webp` — assets live at `assets/catalog/<slug>/`. */
export function resolveCatalogImageUrl(catalogFile: string): string | undefined {
  const rel = catalogFile.replace(/^images\//, "").replace(/\\/g, "/");
  const key = `../assets/catalog/${rel}`;
  return catalogWebpGlob[key];
}
