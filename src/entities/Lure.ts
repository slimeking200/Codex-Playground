export interface Lure {
  id: string;
  name: string;
  description: string;
  idealHabitats: string[];
  rarity: 'starter' | 'advanced' | 'exotic';
  action: 'topwater' | 'midwater' | 'deep' | 'drift';
}

export const LURES: Lure[] = [
  {
    id: 'river_shad',
    name: 'River Shad Spoon',
    description: 'Reliable metal spoon that flutters enticingly in freshwater currents.',
    idealHabitats: ['river'],
    rarity: 'starter',
    action: 'midwater'
  },
  {
    id: 'coral_shrimp',
    name: 'Coral Shrimp Rig',
    description: 'Soft plastic shrimp with articulated legs designed for reef predators.',
    idealHabitats: ['reef'],
    rarity: 'starter',
    action: 'drift'
  },
  {
    id: 'storm_minnow',
    name: 'Storm Minnow Plug',
    description: 'Weighted plug with internal rattles that call to pelagic hunters during storms.',
    idealHabitats: ['open_ocean', 'volcanic'],
    rarity: 'advanced',
    action: 'midwater'
  },
  {
    id: 'frostworm',
    name: 'Frostworm Jig',
    description: 'A bioluminescent jig that maintains flexibility in sub-zero waters.',
    idealHabitats: ['ice'],
    rarity: 'advanced',
    action: 'deep'
  },
  {
    id: 'timeworn_lure',
    name: 'Timeworn Relic Lure',
    description: 'A mysterious relic etched with runes, pulsating with eldritch light.',
    idealHabitats: ['ancient', 'deep'],
    rarity: 'exotic',
    action: 'deep'
  },
  {
    id: 'kelp_dancer',
    name: 'Kelp Dancer Spinner',
    description: 'Spinnerbait with fronds mimicking swaying kelp, irresistible to seadragons.',
    idealHabitats: ['reef'],
    rarity: 'advanced',
    action: 'topwater'
  },
  {
    id: 'cyclone_spinner',
    name: 'Cyclone Spinner',
    description: 'High-velocity spinner tuned for tuna speeds, leaves a shimmering vortex trail.',
    idealHabitats: ['open_ocean'],
    rarity: 'advanced',
    action: 'midwater'
  },
  {
    id: 'void_moth',
    name: 'Void Moth Glider',
    description: 'Glides gracefully, leaving a dark luminescent wake that entices abyssal predators.',
    idealHabitats: ['deep'],
    rarity: 'exotic',
    action: 'deep'
  }
];
