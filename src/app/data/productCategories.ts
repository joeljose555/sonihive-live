/**
 * Hierarchical product category structure
 * Main categories can contain multiple sub-products
 */

import {
  DoorOpen, Speaker, Briefcase, Shield, Car, Cable, Box
} from "lucide-react";
import SoundproofDoorMain from '../assets/showcase-reel/soundproof-door.png';
import ConsumerMain from '../assets/archive/consumer-series/household-soundproof-door-banner_1761643547672.webp';
import CommercialMain from '../assets/archive/commercial-series/commercial-soundproof-door-banner_1761643488780.webp';
import EngSeriesMain from '../assets/archive/engineering-series/_116_1750331640370_1761813521786.jpg';
import EngAcousticsMain from '../assets/archive/engineering-acoustics/_116_1750332674056_1761813747555.jpg';
import PortableMain from '../assets/archive/portable-acoustics/acoustic-soft-pack-banner_1761703650988.webp';
import AcousticCubeMain from '../assets/archive/acoustic-cube/_118_1750397777278_1761814418210.jpg';
import ImagineMain from '../assets/archive/imagine-acoustic-art/Õú░Õ¡ªþö╗_05_1761823009408.jpg';
import EqMain from '../assets/archive/eq-series-panels/_116_1750398937313_1761814538765.jpg';
import AqSmartMain from '../assets/archive/aq-smart-module/AQ1000SW_1761874771887.jpg';
import QrdMain from '../assets/archive/qrd-2d-diffuser/_118-1_1750403536445_1761815278323.jpg';
import MlsMain from '../assets/archive/mls-3d-diffuser/_118-1_1750403107185_1761815596304.jpg';
import SoundInsulMain from '../assets/archive/sound-insulation/_118_1750410057000_1761818168143.jpg';
import AutoSeriesMain from '../assets/archive/automotive-series/universal-car-sound-deadening-banner_1761704419332.webp';
import AutoUniMain from '../assets/archive/automotive-universal-kit/universal-car-sound-deadening-banner_1761704419332.webp';
import TeslaMain from '../assets/archive/automotive-tesla-model-y/tesla-y-soundproof-system-banner_1761705516307.webp';
import NoiseAccMain from '../assets/archive/noise-accessories/soundbox-noise-reduction-accessories_1761644121708.webp';
import ChairLegMain from '../assets/archive/silent-chair-leg-covers/soundbox-noise-reduction-accessories_1761644121708.webp';
import SoundLevelMain from '../assets/archive/sound-level-meter/sound-pressure-level-meter_1761795576773.webp';
import SilentEarMain from '../assets/archive/silent-ear-plugs/mceclip54_1761643971882.jpg';
import SilentFanMain from '../assets/archive/silent-exhaust-fans/mceclip62_1761644106373.webp';

export interface SubProduct {
  name: string;
  slug: string;
  description: string;
  image: string;
  tag: string;
  year: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
  icon: any;
  description: string;
  tag: string;
  year: string;
  image: string;
  subProducts?: SubProduct[];
}

export const productCategories: ProductCategory[] = [
  {
    name: "Soundproof Door",
    slug: "soundproof-door",
    icon: DoorOpen,
    description: "Heavy-duty acoustic doors with multi-layer seal technology.",
    tag: "Structural",
    year: "2025",
    image: SoundproofDoorMain,
    subProducts: [
      {
        name: "Consumer Series",
        slug: "consumer-series",
        description: "Affordable acoustic panels and foam for home use.",
        image: ConsumerMain,
        tag: "Consumer",
        year: "2026"
      },
      {
        name: "Commercial Series",
        slug: "commercial-series",
        description: "Large-scale solutions for offices, restaurants, and retail.",
        image: CommercialMain,
        tag: "Commercial",
        year: "2025"
      },
      {
        name: "Engineering Series",
        slug: "engineering-series",
        description: "Custom-engineered solutions for specialized requirements.",
        image: EngSeriesMain,
        tag: "Engineering",
        year: "2026"
      }
    ]
  },
  {
    name: "Engineering Acoustics",
    slug: "engineering-acoustics",
    icon: Speaker,
    description: "Advanced acoustic analysis and implementation systems.",
    tag: "Advanced",
    year: "2025",
    image: EngAcousticsMain,
    subProducts: [
      {
        name: "WAFER Holographic Acoustic Module",
        slug: "holographic-acoustic-module",
        description:
          "Wafer-format holographic acoustic modules for venue-grade treatment with A-grade flame retardant substrates.",
        image:
          "https://oss-api.soundbox-sys.com/temp/holographic-acoustic-module-banner_1761703099036.WEBP",
        tag: "Advanced",
        year: "2025",
      },
      {
        name: "Acoustic Baffles",
        slug: "acoustic-baffles",
        description:
          "Array and matrix ceiling baffles for stadiums, gyms, public venues, and high-bay spaces.",
        image:
          "https://oss-api.soundbox-sys.com/temp/engineering-acoustic-baffle_1761703741797.webp",
        tag: "Commercial",
        year: "2025",
      },
      {
        name: "Acoustic Fabric Panels",
        slug: "fabric-acoustic-panels",
        description:
          "Fabric-wrapped acoustic panels and magic blocks for classrooms, studios, and interior fit-out.",
        image:
          "https://oss-api.soundbox-sys.com/temp/acoustic-soft-pack-banner_1761703650988.webp",
        tag: "Absorption",
        year: "2025",
      },
      {
        name: "Perforated Acoustic Panels",
        slug: "perforated-acoustic-panels",
        description:
          "Perforated, slotted, and honeycomb absorbers from digital perforation to broadband CK-series panels.",
        image:
          "https://oss-api.soundbox-sys.com/temp/slotted-sound-absorbing-board-banner_1761704204851.webp",
        tag: "Architectural",
        year: "2025",
      },
      {
        name: "Acoustic Diffuser",
        slug: "acoustic-diffuser",
        description:
          "MLS, variable absorption/diffusion units, shells, and sculpted diffusers for performance and critical listening.",
        image:
          "https://oss-api.soundbox-sys.com/temp/acoustic-diffuser-plate-banner_1761644222127.webp",
        tag: "Diffusion",
        year: "2025",
      },
      {
        name: "Acoustic Wool Materials",
        slug: "acoustic-wool-materials",
        description:
          "Environmental white fiber, composite yellow fiber, and Byer acoustic cotton for cavity fill and linings.",
        image:
          "https://oss-api.soundbox-sys.com/temp/acoustic-cotton-material-banner_1761703545072.webp",
        tag: "Materials",
        year: "2025",
      },
    ],
  },
  {
    name: "Portable Acoustics",
    slug: "portable-acoustics",
    icon: Briefcase,
    description: "Mobile sound treatment for on-the-go professionals.",
    tag: "Portable",
    year: "2026",
    image: PortableMain,
    subProducts: [
      {
        name: "Acoustic Cube",
        slug: "acoustic-cube",
        description: "Modular acoustic enclosures for flexible workspace solutions.",
        image: AcousticCubeMain,
        tag: "Modular",
        year: "2025"
      },
      {
        name: "Imagine Acoustic Art",
        slug: "imagine-acoustic-art",
        description: "Designer acoustic panels that double as wall art.",
        image: ImagineMain,
        tag: "Design",
        year: "2026"
      },
      {
        name: "EQ Series Acoustic Panels",
        slug: "eq-series-panels",
        description: "Frequency-targeted absorption panels for tonal balance.",
        image: EqMain,
        tag: "Absorption",
        year: "2025"
      },
      {
        name: "AQ Smart Acoustic Module",
        slug: "aq-smart-module",
        description: "IoT-enabled acoustic modules with real-time monitoring.",
        image: AqSmartMain,
        tag: "Smart",
        year: "2026"
      },
      {
        name: "QRD 2D Diffuser",
        slug: "qrd-2d-diffuser",
        description: "Quadratic residue diffusers for even sound distribution.",
        image: QrdMain,
        tag: "Diffusion",
        year: "2025"
      },
      {
        name: "MLS 3D Diffuser",
        slug: "mls-3d-diffuser",
        description: "Maximum-length sequence diffusers for complex spaces.",
        image: MlsMain,
        tag: "Diffusion",
        year: "2025"
      }
    ]
  },
  {
    name: "Sound Insulation and Vibration Reduction",
    slug: "sound-insulation",
    icon: Shield,
    description: "Vibration reduction and mass-loaded barrier solutions.",
    tag: "Insulation",
    year: "2026",
    image: SoundInsulMain,
    subProducts: [
      {
        name: "WAFER Holographic Sound Insulation Module",
        slug: "holographic-sound-insulation-module",
        description:
          "Wafer-format holographic sound insulation from inorganic silicate damping technology.",
        image:
          "https://oss-api.soundbox-sys.com/temp/全息隔声模组_01_1761804675340.jpg",
        tag: "Insulation",
        year: "2026",
      },
      {
        name: "Damping Coating",
        slug: "damping-coating",
        description:
          "Floor damping sound-insulating coatings and water-based vibration-reduction paint.",
        image:
          "https://oss-api.soundbox-sys.com/temp/地面阻尼隔声涂层_01_1761804000403.jpg",
        tag: "Coating",
        year: "2026",
      },
      {
        name: "Damping Soundproof Flooring",
        slug: "damping-soundproof-flooring",
        description:
          "LVT + IXPE high-performance damping floors with wood and stone aesthetics.",
        image:
          "https://oss-api.soundbox-sys.com/temp/0eb17ad79ec5ec1c81fd52fb0c405952_1761892513537.png",
        tag: "Flooring",
        year: "2026",
      },
      {
        name: "Noise Control Curtains",
        slug: "noise-control-curtains",
        description:
          "NIC masking curtains for construction, machinery, and high-R'w performance options.",
        image:
          "https://oss-api.soundbox-sys.com/temp/noise-control-and-sound-blocking-curtain_1761878056298.webp",
        tag: "Barriers",
        year: "2026",
      },
      {
        name: "Soundproofing Panels",
        slug: "soundproofing-panels",
        description:
          "Environmental damping panels G15E–G22, OEM composites, and metal G20J lines.",
        image:
          "https://oss-api.soundbox-sys.com/temp/隔声板_02_1761804212941.jpg",
        tag: "Panels",
        year: "2026",
      },
      {
        name: "Vibration Damping Components",
        slug: "vibration-damping-components",
        description:
          "OFF isolators, pads, polymer bricks, sealants, and keel anti-vibration adhesive.",
        image:
          "https://oss-api.soundbox-sys.com/temp/减振构件_02_1761804535750.jpg",
        tag: "Isolation",
        year: "2026",
      },
    ],
  },
  {
    name: "Noise Reduction Accessories",
    slug: "noise-accessories",
    icon: Cable,
    description: "Seals, gaskets, mounts, and acoustic accessories.",
    tag: "Accessories",
    year: "2025",
    image: NoiseAccMain,
    subProducts: [
      {
        name: "Silent Chair Leg Covers",
        slug: "silent-chair-leg-covers",
        description: "Premium felt pads to eliminate chair noise on hard floors.",
        image: ChairLegMain,
        tag: "Accessories",
        year: "2025"
      },
      {
        name: "Sound Level Meter",
        slug: "sound-level-meter",
        description: "Professional-grade decibel meter for acoustic measurements.",
        image: SoundLevelMain,
        tag: "Accessories",
        year: "2025"
      },
      {
        name: "Silent Ear Plugs",
        slug: "silent-ear-plugs",
        description: "High-fidelity ear plugs with 25dB noise reduction rating.",
        image: SilentEarMain,
        tag: "Accessories",
        year: "2025"
      },
      {
        name: "Silent Exhaust Fans",
        slug: "silent-exhaust-fans",
        description: "Ultra-quiet ventilation fans with 20dBA operation.",
        image: SilentFanMain,
        tag: "Accessories",
        year: "2025"
      }
    ]
  },
  {
    name: "Automotive Soundproofing Series",
    slug: "automotive-series",
    icon: Car,
    description: "Vehicle-specific soundproofing for luxury automotive.",
    tag: "Automotive",
    year: "2026",
    image: AutoSeriesMain,
    subProducts: [
      {
        name: "Universal Kit",
        slug: "automotive-universal-kit",
        description: "Complete soundproofing kit for all vehicle types.",
        image: AutoUniMain,
        tag: "Automotive",
        year: "2026"
      },
      {
        name: "Tesla Model Y Specific Wheel",
        slug: "automotive-tesla-model-y",
        description: "Custom-fit soundproofing solution designed for Tesla Model Y.",
        image: TeslaMain,
        tag: "Automotive",
        year: "2026"
      }
    ]
  }

];

// Helper function to check if a category has subcategories
export const hasSubProducts = (categorySlug: string): boolean => {
  const category = productCategories.find(c => c.slug === categorySlug);
  return !!category?.subProducts && category.subProducts.length > 0;
};

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
  return productCategories.find(c => c.slug === slug);
};

// Helper function to get product by slug (searches both categories and sub-products)
export const getProductBySlug = (slug: string): (ProductCategory | SubProduct) | undefined => {
  // First check if it's a main category
  const category = productCategories.find(c => c.slug === slug);
  if (category) return category;
  
  // Then search in sub-products
  for (const cat of productCategories) {
    if (cat.subProducts) {
      const subProduct = cat.subProducts.find(sp => sp.slug === slug);
      if (subProduct) return subProduct;
    }
  }
  
  return undefined;
};
