import * as THREE from 'three';
import { Random } from '../utils/Random';

export type WeatherState = 'clear' | 'overcast' | 'rain' | 'storm' | 'fog';

export class WeatherSystem {
  private readonly random = new Random(Date.now());
  private transitionTimer = 0;
  private readonly transitionInterval = 180;
  private currentState: WeatherState = 'clear';
  private nextState: WeatherState = 'clear';
  private transitionProgress = 0;
  private particles: THREE.Points | null = null;

  constructor(private readonly scene: THREE.Scene, private readonly skyMaterial: THREE.ShaderMaterial) {
    this.pickNextState();
  }

  public update(deltaTime: number): void {
    this.transitionTimer += deltaTime;
    if (this.transitionTimer > this.transitionInterval) {
      this.transitionTimer = 0;
      this.currentState = this.nextState;
      this.pickNextState();
    }

    const targetProgress = this.currentState === this.nextState ? 1 : this.transitionTimer / this.transitionInterval;
    this.transitionProgress = THREE.MathUtils.lerp(this.transitionProgress, targetProgress, deltaTime * 0.5);

    this.applySkyChanges();
    this.updatePrecipitation(deltaTime);
  }

  private pickNextState(): void {
    const states: WeatherState[] = ['clear', 'overcast', 'rain', 'storm', 'fog'];
    this.nextState = this.random.pick(states);
  }

  private applySkyChanges(): void {
    const uniforms = this.skyMaterial.uniforms;
    const baseColor = new THREE.Color(0x7ec8ff);
    const stormColor = new THREE.Color(0x233345);
    const fogColor = new THREE.Color(0x9fb1c7);

    let targetColor = baseColor;
    let cloudDensity = 0.2;

    switch (this.currentState) {
      case 'clear':
        targetColor = baseColor;
        cloudDensity = 0.15;
        break;
      case 'overcast':
        targetColor = new THREE.Color(0x607692);
        cloudDensity = 0.6;
        break;
      case 'rain':
        targetColor = new THREE.Color(0x415265);
        cloudDensity = 0.75;
        break;
      case 'storm':
        targetColor = stormColor;
        cloudDensity = 0.9;
        break;
      case 'fog':
        targetColor = fogColor;
        cloudDensity = 0.4;
        break;
    }

    uniforms.cloudDensity.value = THREE.MathUtils.lerp(uniforms.cloudDensity.value, cloudDensity, 0.05);
    (uniforms.skyColor.value as THREE.Color).lerp(targetColor, 0.05);
    uniforms.fogStrength.value = THREE.MathUtils.lerp(uniforms.fogStrength.value, this.getFogStrength(), 0.05);
  }

  private updatePrecipitation(deltaTime: number): void {
    if (this.currentState === 'rain' || this.currentState === 'storm') {
      if (!this.particles) {
        this.particles = this.createRainParticles();
        this.scene.add(this.particles);
      }
      this.particles.rotation.x += deltaTime * 0.1;
    } else if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
      this.particles = null;
    }
  }

  private getFogStrength(): number {
    switch (this.currentState) {
      case 'fog':
        return 0.5;
      case 'storm':
        return 0.35;
      case 'rain':
        return 0.25;
      case 'overcast':
        return 0.15;
      default:
        return 0.05;
    }
  }

  private createRainParticles(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 100 + 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xaad4ff,
      transparent: true,
      opacity: 0.6,
      size: 0.5
    });
    return new THREE.Points(geometry, material);
  }
}
