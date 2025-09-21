import { Habitat } from './SpeciesData';

export interface FishingLocation {
  id: string;
  name: string;
  biome: Habitat;
  description: string;
  recommendedLevel: number;
  unlockedBy?: string;
  pointsOfInterest: string[];
}

export const LOCATIONS: FishingLocation[] = [
  {
    id: 'aurora_river',
    name: 'Aurora River',
    biome: 'river',
    description: 'A crystalline river winding through snowy peaks, famous for aurora reflections on its surface.',
    recommendedLevel: 1,
    pointsOfInterest: ['Glacial Bridge', 'Echoing Falls', 'Moonlit Shrine']
  },
  {
    id: 'coral_citadel',
    name: 'Coral Citadel',
    biome: 'reef',
    description: 'A sprawling coral reef shaped like an ancient fortress. Home to dazzling biodiversity and hidden caverns.',
    recommendedLevel: 5,
    unlockedBy: 'Complete Aurora River story arc',
    pointsOfInterest: ['Rainbow Bastion', 'Whispering Grotto', 'Pearl Throne']
  },
  {
    id: 'volcanic_forge',
    name: 'Volcanic Forge',
    biome: 'volcanic',
    description: 'Molten vents heat the surrounding ocean, creating pillars of steam and obsidian arches.',
    recommendedLevel: 10,
    unlockedBy: 'Craft Voltaic Insulator Rod',
    pointsOfInterest: ['Obsidian Gate', 'Lavafall Trench', 'Smoldering Sanctum']
  },
  {
    id: 'astral_abyss',
    name: 'Astral Abyss',
    biome: 'deep',
    description: 'An abyssal trench illuminated by drifting bioluminescent pillars. Gravity feels lighter down here.',
    recommendedLevel: 15,
    unlockedBy: 'Complete Volcanic Forge expedition',
    pointsOfInterest: ['Starfall Cavern', 'Warden Monolith', 'Echoing Dome']
  },
  {
    id: 'icebound_colossus',
    name: 'Icebound Colossus',
    biome: 'ice',
    description: 'A frozen leviathan the size of a mountain. Its hollowed ribs form frozen caverns teeming with life.',
    recommendedLevel: 20,
    unlockedBy: 'Forge Frostplate Armor',
    pointsOfInterest: ['Heart of Ice', 'Aurora Chasm', 'Frozen Observatory']
  },
  {
    id: 'sunken_empire',
    name: 'Sunken Empire',
    biome: 'ancient',
    description: 'Ruins of a lost civilization suspended in time. Strange mechanisms still hum with otherworldly power.',
    recommendedLevel: 25,
    unlockedBy: 'Awaken the Oracle Compass',
    pointsOfInterest: ['Chronicle Library', 'Throne of Tides', 'Astral Observatory']
  }
];
