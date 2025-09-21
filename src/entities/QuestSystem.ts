import { FISH_SPECIES } from './SpeciesData';
import { Player } from './Player';

export interface QuestObjective {
  description: string;
  targetSpeciesId?: string;
  quantity?: number;
  rewardExperience: number;
  rewardFunds: number;
}

export interface Quest {
  id: string;
  title: string;
  narrative: string;
  objectives: QuestObjective[];
  completed: boolean;
}

export class QuestSystem {
  private quests: Quest[] = [];

  constructor() {
    this.initializeQuests();
  }

  private initializeQuests(): void {
    this.quests = [
      {
        id: 'aurora_initiation',
        title: 'Aurora Initiation',
        narrative: 'Prove yourself to the Riverwardens by capturing the luminous species that inhabit the Aurora River.',
        objectives: [
          {
            description: 'Catch 3 Azure Trout',
            targetSpeciesId: 'azure_trout',
            quantity: 3,
            rewardExperience: 80,
            rewardFunds: 120
          },
          {
            description: 'Catch 2 Sylvan Koi',
            targetSpeciesId: 'sylvan_koi',
            quantity: 2,
            rewardExperience: 100,
            rewardFunds: 150
          }
        ],
        completed: false
      },
      {
        id: 'coral_resonance',
        title: 'Coral Resonance',
        narrative: 'Tune into the bioacoustic songs of the Coral Citadel to lure out its most elusive residents.',
        objectives: [
          {
            description: 'Catch a Reef Seadragon',
            targetSpeciesId: 'reef_seadragon',
            quantity: 1,
            rewardExperience: 250,
            rewardFunds: 400
          },
          {
            description: 'Catch an Amberjaw Barracuda',
            targetSpeciesId: 'amberjaw_barracuda',
            quantity: 1,
            rewardExperience: 220,
            rewardFunds: 380
          }
        ],
        completed: false
      },
      {
        id: 'voltaic_arcanum',
        title: 'Voltaic Arcanum',
        narrative: 'Harness the volcanic currents to uncover the secret of the Voltaic Eel.',
        objectives: [
          {
            description: 'Catch a Voltaic Eel',
            targetSpeciesId: 'voltaic_eel',
            quantity: 1,
            rewardExperience: 600,
            rewardFunds: 750
          }
        ],
        completed: false
      }
    ];
  }

  public getQuests(): Quest[] {
    return this.quests;
  }

  public registerCatch(player: Player, speciesId: string): void {
    for (const quest of this.quests) {
      if (quest.completed) {
        continue;
      }
      let questCompleted = true;
      for (const objective of quest.objectives) {
        if (!objective.quantity || !objective.targetSpeciesId) {
          continue;
        }
        if (objective.targetSpeciesId === speciesId && objective.quantity > 0) {
          objective.quantity--;
          player.awardExperience(objective.rewardExperience);
          player.stats.funds += objective.rewardFunds;
        }
        if ((objective.quantity ?? 0) > 0) {
          questCompleted = false;
        }
      }
      if (questCompleted) {
        quest.completed = true;
      }
    }
  }

  public describeSpecies(speciesId: string): string {
    const species = FISH_SPECIES.find((s) => s.id === speciesId);
    return species ? species.description : 'Unknown species.';
  }
}
