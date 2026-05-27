/**
 * Solution areas (architectural, industrial, environmental) — mirrors product category shape
 * for shared UI patterns. Item heroes and galleries come from scraped `public/solutions2` data
 * (see solutionsScraped.generated.ts); group category heroes stay under assets/solutions/.
 */

import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Building2,
  Briefcase,
  Cable,
  Car,
  Factory,
  Fan,
  Film,
  GraduationCap,
  Home,
  Hotel,
  Landmark,
  Layers,
  Leaf,
  Music,
  Route,
  Ship,
  Shield,
  Stethoscope,
  TrainFront,
  TrainFrontTunnel,
  TrainTrack,
  UtensilsCrossed,
  Warehouse,
  Zap,
} from "lucide-react";

import ArchCat from "../assets/solutions/architectural-acoustics/architectural-acoustics-category-hero.jpg";
import IndCat from "../assets/solutions/industrial-facilities/industrial-facilities-category-hero.jpg";
import EnvCat from "../assets/solutions/environmental-noise-control/environmental-noise-control-category-hero.jpg";
import FallbackSolutionHero from "../assets/solutions/architectural-acoustics/residential-homes-acoustic-hero.jpg";

import { solutionsScrapedBySlug } from "./solutionsScraped.generated";

const galleryModules = import.meta.glob<string>("../assets/solutions/**/*-gallery-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function buildGalleryBySlug(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const path of Object.keys(galleryModules)) {
    const m = path.match(/([^/\\]+)-gallery-(\d+)\.jpg$/);
    if (!m) continue;
    const slug = m[1];
    const idx = parseInt(m[2], 10) - 1;
    if (!map[slug]) map[slug] = [];
    map[slug][idx] = galleryModules[path];
  }
  for (const slug of Object.keys(map)) {
    map[slug] = map[slug].filter((u): u is string => u != null);
  }
  return map;
}

const solutionGalleryBySlug = buildGalleryBySlug();

export interface SolutionItem {
  name: string;
  slug: string;
  description: string;
  tag: string;
  year: string;
  image: string;
  icon: LucideIcon;
  paragraphs: string[];
  relatedProductSlugs?: string[];
  sectionTitles?: string[];
}

export interface SolutionGroup {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  tag: string;
  year: string;
  image: string;
  items: SolutionItem[];
}

const GENERIC_SCRAPED_DESC = /^soundbox solution details page\s*$/i;

function mergeSolutionDescription(slug: string, curated: string): string {
  const d = solutionsScrapedBySlug[slug]?.scrapedDescription?.trim() ?? "";
  if (d.length >= 40 && !GENERIC_SCRAPED_DESC.test(d)) return d;
  return curated;
}

function enrichSolutionItem(item: SolutionItem): SolutionItem {
  const s = solutionsScrapedBySlug[item.slug];
  const image =
    s?.heroImage && String(s.heroImage).length > 0 ? s.heroImage : FallbackSolutionHero;
  const description = mergeSolutionDescription(item.slug, item.description);
  const relatedProductSlugs =
    s?.relatedLocalSlugs && s.relatedLocalSlugs.length > 0
      ? [...s.relatedLocalSlugs]
      : undefined;
  const sectionTitles =
    s?.sectionTitles && s.sectionTitles.length > 0 ? [...s.sectionTitles] : undefined;
  return {
    ...item,
    image,
    description,
    relatedProductSlugs,
    sectionTitles,
  };
}

function enrichSolutionGroups(groups: SolutionGroup[]): SolutionGroup[] {
  return groups.map((g) => ({
    ...g,
    items: g.items.map(enrichSolutionItem),
  }));
}

/** Gallery URLs: scraped content images first, else legacy *-gallery-*.jpg under assets. */
export function getSolutionGalleryImages(itemSlug: string): string[] {
  const scraped = solutionsScrapedBySlug[itemSlug]?.galleryImages;
  if (scraped?.length) return scraped;
  return solutionGalleryBySlug[itemSlug] ?? [];
}

/** Gallery src + alt for detail page (scraped alts when present). */
export function getSolutionGalleryEntries(
  itemSlug: string,
  itemName: string
): { src: string; alt: string }[] {
  const s = solutionsScrapedBySlug[itemSlug];
  if (s?.galleryImages?.length) {
    return s.galleryImages.map((src, i) => {
      const alt = (s.galleryAlts[i] || "").trim();
      return {
        src,
        alt: alt || `${itemName} — image ${i + 1}`,
      };
    });
  }
  const legacy = solutionGalleryBySlug[itemSlug] ?? [];
  return legacy.map((src, i) => ({
    src,
    alt: `${itemName} — image ${i + 1}`,
  }));
}

const rawSolutionGroups: SolutionGroup[] = [
  {
    name: "Architectural acoustics",
    slug: "architectural-acoustics",
    icon: Building2,
    description:
      "",
    tag: "Built environment",
    year: "2025",
    image: ArchCat,
    items: [
      {
        name: "Residential homes",
        slug: "residential-homes-acoustic",
        description:
          "Quiet living spaces with controlled reverberation and isolation from traffic and neighbors.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Home,
        paragraphs: [
          "Residential acoustic design balances privacy, comfort, and natural sound quality. Treatments can address exterior noise ingress, room-to-room transmission, and excessive reverberation in open plans.",
          "Sonic Hive Acoustics works with architects and builders to specify absorption, isolation, and HVAC noise control that fits your layout and finishes—without compromising aesthetics.",
        ],
      },
      {
        name: "Commercial office",
        slug: "commercial-office-acoustic",
        description:
          "Open-plan speech privacy, meeting-room intelligibility, and focused work zones.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Briefcase,
        paragraphs: [
          "Modern offices mix collaboration and concentration. Effective acoustics reduce distraction from speech and equipment while keeping collaborative areas lively and intelligible.",
          "We combine ceiling treatments, screens, pods, and background sound strategies so teams can collaborate without losing deep-work capacity.",
        ],
      },
      {
        name: "Educational spaces",
        slug: "educational-spaces-acoustic",
        description:
          "Clear teaching voice, lower noise buildup, and calmer corridors for learning.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: GraduationCap,
        paragraphs: [
          "Students learn best when they can hear the instructor and each other. Classrooms, labs, and libraries each need tailored reverberation and isolation targets.",
          "Our solutions align with educational standards for speech transmission while controlling impact from corridors, gyms, and HVAC systems.",
        ],
      },
      {
        name: "Hotels and hospitality",
        slug: "hotels-and-hospitality-acoustic",
        description:
          "Guest comfort, ballroom clarity, and back-of-house noise management.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Hotel,
        paragraphs: [
          "Hospitality projects demand quiet guest rooms adjacent to ballrooms, bars, and mechanical spaces. Acoustic separation and interior finishes must work together.",
          "From lobbies to suites, we design treatments that preserve luxury aesthetics while meeting stringent background noise criteria.",
        ],
      },
      {
        name: "Venue spaces",
        slug: "venue-spaces-acoustic",
        description:
          "Balanced sound for audiences and performers in multipurpose halls and arenas.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Landmark,
        paragraphs: [
          "Venues must support speech, live music, and reinforced sound without harsh echoes or dead spots.",
          "We tune surfaces, diffusion, and low-frequency control so every seat receives a coherent listening experience.",
        ],
      },
      {
        name: "Multi-functional halls",
        slug: "multi-functional-halls-acoustic",
        description:
          "Flexible halls that switch between conferences, banquets, and performances.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Layers,
        paragraphs: [
          "Multi-use halls require acoustic flexibility: shorter reverberation for speech, longer support for music—sometimes in the same week.",
          "Variable absorption, curtains, and calibrated sound systems help operators adapt the room to each event format.",
        ],
      },
      {
        name: "Concert halls",
        slug: "concert-halls-acoustic",
        description:
          "Orchestral warmth, ensemble clarity, and controlled decay for critical listening.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Music,
        paragraphs: [
          "Concert halls are shaped by geometry, materials, and seating volume. Early reflections and reverberation time define the hall’s character.",
          "We collaborate on shaping, diffusion, and orchestra shell design so ensembles and audiences experience balanced, enveloping sound.",
        ],
      },
      {
        name: "Entertainment spaces",
        slug: "entertainment-spaces-acoustic",
        description:
          "Cinemas, clubs, and attractions with controlled bass and neighbor-friendly isolation.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Film,
        paragraphs: [
          "Entertainment venues operate at high SPL. Interior acoustics must manage bass buildup while isolating adjacent spaces and residences.",
          "Treatment plans combine heavy barriers, resilient isolation, and tuned absorption for subwoofers and live acts.",
        ],
      },
      {
        name: "Dining areas",
        slug: "dining-areas-acoustic",
        description:
          "Comfortable restaurants where guests can converse without shouting.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: UtensilsCrossed,
        paragraphs: [
          "Hard surfaces and open kitchens raise noise levels in dining rooms. Strategic absorption and diffusion lower the Lombard effect so speech stays intelligible.",
          "We preserve the design intent—open, vibrant spaces—while keeping peak levels within comfortable ranges.",
        ],
      },
      {
        name: "Healthcare facilities",
        slug: "healthcare-facilities-acoustic",
        description:
          "Healing environments with speech privacy, sleep-friendly wards, and low mechanical noise.",
        tag: "Architectural",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Stethoscope,
        paragraphs: [
          "Hospitals and clinics require HIPAA-conscious speech privacy, restful patient rooms, and clear paging intelligibility.",
          "Acoustic ceilings, door seals, and equipment isolation combine to meet healthcare noise and privacy guidelines.",
        ],
      },
    ],
  },
  {
    name: "Industrial facilities",
    slug: "industrial-facilities",
    icon: Factory,
    description:
      "",
    tag: "Industrial",
    year: "2025",
    image: IndCat,
    items: [
      {
        name: "Automotive product solutions",
        slug: "product-car",
        description:
          "Vehicle NVH materials and kits for quieter cabins and reduced road noise.",
        tag: "Industrial",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Car,
        paragraphs: [
          "Automotive NVH packages target panels, floors, and cavities where structure-borne and airborne noise enter the cabin.",
          "We specify damping sheets, barriers, and seals compatible with production assembly and weight targets.",
        ],
      },
      {
        name: "High-speed rail noise reduction",
        slug: "high-speed-rail-noise-reduction",
        description:
          "Wheel-rail, aerodynamic, and equipment noise mitigation for rolling stock.",
        tag: "Industrial",
        year: "2025",
        image: FallbackSolutionHero,
        icon: TrainFront,
        paragraphs: [
          "High-speed trains generate intense wheel-rail noise and aerodynamic hiss. Treatments must survive vibration, temperature cycles, and fire regulations.",
          "Our approach combines damping, insulation, and sealing strategies tuned to vehicle architecture and operating speeds.",
        ],
      },
      {
        name: "Marine vessels noise reduction",
        slug: "marine-vessels-noise-reduction",
        description:
          "Engine-room isolation and habitability for commercial and passenger ships.",
        tag: "Industrial",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Ship,
        paragraphs: [
          "Marine environments couple machinery vibration into hulls and cabins. Isolation mounts, floating floors, and acoustic enclosures reduce structure-borne paths.",
          "Solutions respect classification society rules, weight limits, and salt-air durability.",
        ],
      },
      {
        name: "Warships noise reduction",
        slug: "warships-noise-reduction",
        description:
          "Signature and crew habitability for naval platforms under demanding operational profiles.",
        tag: "Industrial",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Anchor,
        paragraphs: [
          "Naval platforms balance acoustic signature control with crew endurance. Machinery isolation and hull damping are engineered for shock and mission profiles.",
          "We support layered treatments that integrate with survivability and maintenance requirements.",
        ],
      },
      {
        name: "Armored vehicles noise reduction",
        slug: "armored-vehicles-noise-reduction",
        description:
          "Crew communication and thermal-acoustic comfort inside armored hulls.",
        tag: "Industrial",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Shield,
        paragraphs: [
          "Armored vehicles concentrate engine and track noise in confined volumes. Interior damping and sealing improve situational awareness and reduce fatigue.",
          "Materials are chosen for ballistic compatibility, space constraints, and field serviceability.",
        ],
      },
    ],
  },
  {
    name: "Environmental noise control",
    slug: "environmental-noise-control",
    icon: Leaf,
    description:
      "",
    tag: "Environmental",
    year: "2025",
    image: EnvCat,
    items: [
      {
        name: "Hydroelectric power stations",
        slug: "hydroelectric-power-stations-acoustic",
        description:
          "Turbine and transformer noise management for stations near communities.",
        tag: "Environmental",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Zap,
        paragraphs: [
          "Hydro plants generate tonal machinery noise and structure-borne vibration that can propagate to nearby residents.",
          "Barriers, silenced ventilation paths, and equipment isolation reduce environmental impact while maintaining safe operations.",
        ],
      },
      {
        name: "Factories and industrial plants",
        slug: "factories-and-industrial-plants-acoustic",
        description:
          "Workplace noise control and community noise limits for process industries.",
        tag: "Environmental",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Warehouse,
        paragraphs: [
          "Industrial sites must protect workers inside the fence line and neighbors outside it. Noise mapping identifies dominant sources and transmission paths.",
          "We design enclosures, silencers, and building shells aligned with occupational and environmental limits.",
        ],
      },
      {
        name: "Cooling towers",
        slug: "cooling-towers-noise-control",
        description:
          "Fan and water-fall noise mitigation for rooftop and ground installations.",
        tag: "Environmental",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Fan,
        paragraphs: [
          "Cooling towers produce broadband fan noise and water splash tones that carry across campuses and neighborhoods.",
          "Solutions include optimized fan selection, discharge attenuators, and barriers sized for line-of-sight geometry.",
        ],
      },
      {
        name: "Piping and duct systems",
        slug: "piping-and-duct-systems-acoustic",
        description:
          "Breakout noise and vibration from HVAC and process piping networks.",
        tag: "Environmental",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Cable,
        paragraphs: [
          "Long duct and pipe runs radiate noise into occupied spaces and structure. Acoustic lagging, flexible connectors, and silencers target dominant paths.",
          "Balancing pressure drop with insertion loss keeps systems efficient and quiet.",
        ],
      },
      {
        name: "Subways",
        slug: "subways-noise-control",
        description:
          "Wheel-rail, traction, and station noise control for urban rail.",
        tag: "Environmental",
        year: "2025",
        image: FallbackSolutionHero,
        icon: TrainTrack,
        paragraphs: [
          "Underground and elevated metro lines excite track and tunnel structures. Noise and vibration propagate to buildings and sensitive receivers.",
          "Floating slab, rail grinding, and wheel damping programs complement architectural isolation at the source.",
        ],
      },
      {
        name: "Tunnels",
        slug: "tunnels-noise-control",
        description:
          "Ventilation fans and traffic noise in road and rail tunnels.",
        tag: "Environmental",
        year: "2025",
        image: FallbackSolutionHero,
        icon: TrainFrontTunnel,
        paragraphs: [
          "Tunnel portals and ventilation plants can dominate local soundscapes. Jet fans and piston effects require silencing and optimized discharge geometry.",
          "We model propagation to portals and adjacent façades for compliance with night-time limits.",
        ],
      },
      {
        name: "Highways",
        slug: "highways-noise-control",
        description:
          "Traffic noise barriers, low-noise pavement strategies, and bridge joint treatments.",
        tag: "Environmental",
        year: "2025",
        image: FallbackSolutionHero,
        icon: Route,
        paragraphs: [
          "Highway noise scales with speed, truck mix, and pavement type. Barriers reduce line-of-sight sound for residential receivers when placed for shadow zones.",
          "Combined with quiet pavement maintenance and speed management, barrier systems deliver predictable community noise relief.",
        ],
      },
    ],
  },
];

export const solutionGroups: SolutionGroup[] = enrichSolutionGroups(rawSolutionGroups);

export function getSolutionGroupBySlug(slug: string): SolutionGroup | undefined {
  return solutionGroups.find((g) => g.slug === slug);
}

export function getSolutionItem(
  groupSlug: string,
  itemSlug: string
): { group: SolutionGroup; item: SolutionItem } | undefined {
  const group = getSolutionGroupBySlug(groupSlug);
  if (!group) return undefined;
  const item = group.items.find((i) => i.slug === itemSlug);
  if (!item) return undefined;
  return { group, item };
}
