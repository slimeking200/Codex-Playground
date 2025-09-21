import * as THREE from 'three';
import { Fish } from '../entities/Fish';
import { FishSpecies } from '../entities/SpeciesData';
import { Random } from '../utils/Random';

export type EncounterState = 'reeling' | 'caught' | 'escaped' | 'snapped';

export interface EncounterHudInfo {
  fishName: string;
  rarity: FishSpecies['rarity'];
  progress: number;
  tension: number;
  state: EncounterState;
  difficultyLabel: string;
}

export class FishingEncounter {
  private state: EncounterState = 'reeling';
  private progress = 0;
  private tension = 35;
  private slackTimer = 0;
  private jerkTimer = 0;
  private jerkInterval: number;
  private readonly difficulty: number;

  constructor(private readonly fish: Fish, private readonly random: Random) {
    this.difficulty = this.getDifficultyForSpecies(fish.species);
    this.jerkInterval = this.random.range(1.8, 3.6);
    this.fish.setHooked(true);
  }

  public update(deltaTime: number, isReeling: boolean, target: THREE.Vector3): EncounterState {
    if (this.state !== 'reeling') {
      return this.state;
    }

    const progressRate = Math.max(0.05, 0.14 - (this.difficulty - 1) * 0.02);
    const reelGain = 22 + this.difficulty * 8;
    const releaseLoss = Math.max(8, 18 - this.difficulty * 2);

    if (isReeling) {
      this.progress += deltaTime * progressRate;
      this.tension += deltaTime * reelGain;
    } else {
      this.progress = Math.max(0, this.progress - deltaTime * (0.025 + this.difficulty * 0.02));
      this.tension -= deltaTime * releaseLoss;
    }

    this.tension = THREE.MathUtils.clamp(this.tension, 0, 120);

    this.jerkTimer += deltaTime;
    if (this.jerkTimer >= this.jerkInterval) {
      this.jerkTimer = 0;
      this.jerkInterval = this.random.range(1.4, 3.2);
      this.tension += 10 + this.difficulty * 6;
      this.progress = Math.max(0, this.progress - 0.06 * this.difficulty);
    }

    this.pullFishTowards(target, deltaTime);

    if (this.tension >= 100) {
      this.state = 'snapped';
      this.cleanup();
      return this.state;
    }

    if (this.tension < 9) {
      this.slackTimer += deltaTime;
    } else {
      this.slackTimer = Math.max(0, this.slackTimer - deltaTime * 0.5);
    }

    const slackThreshold = 1.6 - Math.min(0.9, (this.difficulty - 1) * 0.22);
    if (this.slackTimer > slackThreshold) {
      this.state = 'escaped';
      this.cleanup();
      return this.state;
    }

    this.progress = THREE.MathUtils.clamp(this.progress, 0, 1.1);
    if (this.progress >= 1) {
      this.state = 'caught';
      this.cleanup();
      return this.state;
    }

    return this.state;
  }

  public getHudInfo(): EncounterHudInfo {
    return {
      fishName: this.fish.species.name,
      rarity: this.fish.species.rarity,
      progress: THREE.MathUtils.clamp(this.progress, 0, 1),
      tension: THREE.MathUtils.clamp(this.tension, 0, 100),
      state: this.state,
      difficultyLabel: this.getDifficultyLabel()
    };
  }

  public getFish(): Fish {
    return this.fish;
  }

  private pullFishTowards(target: THREE.Vector3, deltaTime: number): void {
    const targetPosition = target.clone();
    targetPosition.y = -4;
    const rate = 0.25 + (this.difficulty - 1) * 0.08;
    this.fish.object.position.lerp(targetPosition, THREE.MathUtils.clamp(deltaTime * rate, 0, 0.4));
  }

  private cleanup(): void {
    this.fish.setHooked(false);
  }

  private getDifficultyForSpecies(species: FishSpecies): number {
    switch (species.rarity) {
      case 'common':
        return 1;
      case 'uncommon':
        return 1.5;
      case 'rare':
        return 2.2;
      case 'epic':
        return 2.8;
      case 'legendary':
        return 3.4;
      case 'mythic':
        return 4;
      default:
        return 2;
    }
  }

  private getDifficultyLabel(): string {
    if (this.difficulty < 1.5) {
      return 'Gentle';
    }
    if (this.difficulty < 2.3) {
      return 'Lively';
    }
    if (this.difficulty < 3) {
      return 'Ferocious';
    }
    if (this.difficulty < 3.6) {
      return 'Legendary';
    }
    return 'Mythic';
  }
}
