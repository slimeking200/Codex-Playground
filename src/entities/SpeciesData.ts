export type Habitat = 'reef' | 'open_ocean' | 'deep' | 'river' | 'ice' | 'volcanic' | 'ancient';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface FishSpecies {
  id: string;
  name: string;
  rarity: Rarity;
  averageWeightKg: number;
  maxWeightKg: number;
  habitat: Habitat[];
  description: string;
  activeHours: [number, number];
  favoriteBaits: string[];
}

export const FISH_SPECIES: FishSpecies[] = [
  {
    id: 'azure_trout',
    name: 'Azure Trout',
    rarity: 'common',
    averageWeightKg: 1.4,
    maxWeightKg: 4.2,
    habitat: ['river'],
    description: 'A vibrant freshwater fish that thrives in cool, fast-moving rivers. Its shimmering scales sparkle under the dawn sun.',
    activeHours: [5, 11],
    favoriteBaits: ['river shad', 'glass mayfly', 'amber grub']
  },
  {
    id: 'sunrise_snapper',
    name: 'Sunrise Snapper',
    rarity: 'uncommon',
    averageWeightKg: 3.8,
    maxWeightKg: 9.2,
    habitat: ['reef', 'open_ocean'],
    description: 'A reef-dwelling predator known for its brilliant red fins. Strikes aggressively during sunrise transitions.',
    activeHours: [6, 12],
    favoriteBaits: ['coral shrimp', 'ember sardine']
  },
  {
    id: 'titan_ray',
    name: 'Titan Ray',
    rarity: 'epic',
    averageWeightKg: 180,
    maxWeightKg: 450,
    habitat: ['deep', 'open_ocean'],
    description: 'Gentle giants that glide in the midnight zone. Rumored to guide lost sailors by illuminating bioluminescent trails.',
    activeHours: [0, 5],
    favoriteBaits: ['luminous squid', 'midnight jelly']
  },
  {
    id: 'glacier_salmon',
    name: 'Glacier Salmon',
    rarity: 'rare',
    averageWeightKg: 6.4,
    maxWeightKg: 18,
    habitat: ['ice', 'river'],
    description: 'Swims beneath frozen lakes, leaving a faint aurora trail. Requires patience and insulated gear to catch.',
    activeHours: [10, 17],
    favoriteBaits: ['frostworm', 'crystal roe']
  },
  {
    id: 'voltaic_eel',
    name: 'Voltaic Eel',
    rarity: 'legendary',
    averageWeightKg: 22,
    maxWeightKg: 75,
    habitat: ['volcanic', 'deep'],
    description: 'Crackling arcs of electricity surround this eel. Native to volcanic trenches and rumored to feed on magma crystals.',
    activeHours: [19, 2],
    favoriteBaits: ['storm minnow', 'charged leech']
  },
  {
    id: 'ancient_coelacanth',
    name: 'Ancient Coelacanth',
    rarity: 'mythic',
    averageWeightKg: 85,
    maxWeightKg: 210,
    habitat: ['ancient', 'deep'],
    description: 'A living fossil that dwells in submerged ruins. The rarest catch, steeped in maritime legend.',
    activeHours: [0, 23],
    favoriteBaits: ['timeworn lure', 'abyssal nautilus']
  },
  {
    id: 'sylvan_koi',
    name: 'Sylvan Koi',
    rarity: 'common',
    averageWeightKg: 1.1,
    maxWeightKg: 3.4,
    habitat: ['river'],
    description: 'Mystic koi often found near forest shrines. Their scales glow softly when lunar light hits the water.',
    activeHours: [18, 5],
    favoriteBaits: ['moon lotus', 'forest cricket']
  },
  {
    id: 'amberjaw_barracuda',
    name: 'Amberjaw Barracuda',
    rarity: 'rare',
    averageWeightKg: 12.2,
    maxWeightKg: 32,
    habitat: ['open_ocean'],
    description: 'Fast and relentless. Known for its amber-colored teeth that can shear steel leaders.',
    activeHours: [9, 16],
    favoriteBaits: ['chrome mullet', 'sapphire anchovy']
  },
  {
    id: 'reef_seadragon',
    name: 'Reef Seadragon',
    rarity: 'epic',
    averageWeightKg: 4.9,
    maxWeightKg: 14,
    habitat: ['reef'],
    description: 'Drifts among coral towers, mimicking seaweed movements. Masters of camouflage and patience.',
    activeHours: [7, 19],
    favoriteBaits: ['kelp dancer', 'opal mysid']
  },
  {
    id: 'crystal_barramundi',
    name: 'Crystal Barramundi',
    rarity: 'uncommon',
    averageWeightKg: 8.3,
    maxWeightKg: 22,
    habitat: ['river', 'ancient'],
    description: 'Prefers submerged temples where water refracts like stained glass. prized by collectors.',
    activeHours: [12, 20],
    favoriteBaits: ['jade grub', 'luminous crayfish']
  },
  {
    id: 'skywhale_fry',
    name: 'Skywhale Fry',
    rarity: 'legendary',
    averageWeightKg: 320,
    maxWeightKg: 900,
    habitat: ['open_ocean', 'ancient'],
    description: 'Juvenile form of mythical skywhales. Sightings occur during intense storms when sea and sky collide.',
    activeHours: [21, 4],
    favoriteBaits: ['storm minnow', 'astral krill']
  },
  {
    id: 'emberfin_tetra',
    name: 'Emberfin Tetra',
    rarity: 'common',
    averageWeightKg: 0.4,
    maxWeightKg: 1.2,
    habitat: ['reef', 'river'],
    description: 'Schools of emberfin illuminate shallow lagoons. Ideal for novice anglers honing reflexes.',
    activeHours: [4, 21],
    favoriteBaits: ['river shad', 'kelp dancer']
  },
  {
    id: 'stormscale_tuna',
    name: 'Stormscale Tuna',
    rarity: 'rare',
    averageWeightKg: 90,
    maxWeightKg: 260,
    habitat: ['open_ocean'],
    description: 'Its scales resonate with thunder. Known to breach spectacularly when hooked in heavy rain.',
    activeHours: [14, 22],
    favoriteBaits: ['cyclone spinner', 'storm minnow']
  },
  {
    id: 'abyssal_lanternfish',
    name: 'Abyssal Lanternfish',
    rarity: 'uncommon',
    averageWeightKg: 1.9,
    maxWeightKg: 5.4,
    habitat: ['deep'],
    description: 'Glowing lures dangle from their heads, attracting prey and curious anglers alike.',
    activeHours: [0, 6],
    favoriteBaits: ['luminous squid', 'void moth']
  },
  {
    id: 'prismatic_lobster',
    name: 'Prismatic Lobster',
    rarity: 'epic',
    averageWeightKg: 6,
    maxWeightKg: 16,
    habitat: ['reef', 'ancient'],
    description: 'A crustacean coveted for its iridescent shell. Dwells in labyrinthine coral caverns.',
    activeHours: [19, 2],
    favoriteBaits: ['coral shrimp', 'crystal roe']
  }
];
