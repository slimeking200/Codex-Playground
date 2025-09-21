import * as THREE from 'three';
import { lerp } from '../utils/MathUtils';

export class DayNightCycle {
  private elapsed = 0;
  private readonly fullDayDuration = 600; // 10 minutes per in-game day

  constructor(private readonly scene: THREE.Scene, private readonly sun: THREE.DirectionalLight) {}

  public update(deltaTime: number): void {
    this.elapsed = (this.elapsed + deltaTime) % this.fullDayDuration;
    const dayProgress = this.elapsed / this.fullDayDuration;
    const angle = dayProgress * Math.PI * 2;
    const radius = 200;

    this.sun.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 0.5) * radius);
    this.sun.intensity = lerp(0.15, 1.2, Math.max(0, Math.sin(angle)));
    this.sun.color.setHSL(0.1 + 0.1 * Math.sin(angle), 0.7, 0.5);

    const ambient = this.scene.getObjectByName('ambient-light') as THREE.AmbientLight | undefined;
    if (ambient) {
      ambient.intensity = lerp(0.15, 0.7, Math.max(0.1, Math.sin(angle * 0.9)));
    }
  }
}
