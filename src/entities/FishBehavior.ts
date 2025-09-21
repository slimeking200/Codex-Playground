import * as THREE from 'three';
import { Random } from '../utils/Random';
import { Habitat } from './SpeciesData';

export interface BehaviorParameters {
  swimSpeed: number;
  turnRate: number;
  wanderRadius: number;
  depthRange: [number, number];
  schooling: boolean;
}

const HABITAT_BEHAVIOR: Record<Habitat, BehaviorParameters> = {
  reef: { swimSpeed: 6, turnRate: 0.9, wanderRadius: 50, depthRange: [-12, -3], schooling: true },
  open_ocean: { swimSpeed: 12, turnRate: 0.4, wanderRadius: 300, depthRange: [-80, -5], schooling: false },
  deep: { swimSpeed: 5, turnRate: 0.3, wanderRadius: 120, depthRange: [-300, -60], schooling: false },
  river: { swimSpeed: 4, turnRate: 1.2, wanderRadius: 40, depthRange: [-8, -1], schooling: true },
  ice: { swimSpeed: 3, turnRate: 0.8, wanderRadius: 35, depthRange: [-16, -4], schooling: false },
  volcanic: { swimSpeed: 8, turnRate: 0.7, wanderRadius: 180, depthRange: [-140, -40], schooling: false },
  ancient: { swimSpeed: 7, turnRate: 0.5, wanderRadius: 200, depthRange: [-220, -30], schooling: false }
};

export class FishBehavior {
  private readonly random: Random;
  private readonly homePosition: THREE.Vector3;
  private target: THREE.Vector3;
  private velocity = new THREE.Vector3();

  constructor(private readonly habitat: Habitat, startPosition: THREE.Vector3) {
    this.random = new Random(Math.random() * 10000);
    this.homePosition = startPosition.clone();
    this.target = this.pickNewTarget();
  }

  public update(deltaTime: number, position: THREE.Vector3, forward: THREE.Vector3): THREE.Vector3 {
    const config = HABITAT_BEHAVIOR[this.habitat];

    const toTarget = new THREE.Vector3().subVectors(this.target, position);
    const distance = toTarget.length();
    if (distance < 5) {
      this.target = this.pickNewTarget();
    }
    toTarget.normalize();

    forward.lerp(toTarget, THREE.MathUtils.clamp(config.turnRate * deltaTime, 0, 1));
    forward.normalize();

    const speed = config.swimSpeed * (0.6 + Math.sin(performance.now() * 0.001) * 0.4);
    this.velocity.copy(forward).multiplyScalar(speed * deltaTime);

    position.add(this.velocity);

    return forward;
  }

  private pickNewTarget(): THREE.Vector3 {
    const config = HABITAT_BEHAVIOR[this.habitat];
    const angle = this.random.next() * Math.PI * 2;
    const radius = this.random.range(0, config.wanderRadius);
    const y = this.random.range(config.depthRange[0], config.depthRange[1]);
    const offset = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    return this.homePosition.clone().add(offset);
  }
}
