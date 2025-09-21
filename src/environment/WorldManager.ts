import * as THREE from 'three';
import { WaterSurface } from './WaterSurface';
import { SkyDome } from './SkyDome';
import { DayNightCycle } from '../simulation/DayNightCycle';
import { WeatherSystem } from '../simulation/WeatherSystem';
import { Habitat } from '../entities/SpeciesData';

export class WorldManager {
  private water: WaterSurface;
  private sky: SkyDome;
  private dayNight: DayNightCycle;
  private weather: WeatherSystem;
  private islands: THREE.Group;
  private habitatAnchors: Record<Habitat, THREE.Vector3[]>;
  private habitatDepths: Record<Habitat, { min: number; max: number }> = {
    reef: { min: -16, max: -32 },
    open_ocean: { min: -40, max: -90 },
    deep: { min: -120, max: -260 },
    river: { min: -6, max: -18 },
    ice: { min: -14, max: -36 },
    volcanic: { min: -60, max: -140 },
    ancient: { min: -90, max: -190 }
  };

  constructor(
    private readonly scene: THREE.Scene,
    private readonly sun: THREE.DirectionalLight,
    waterNormalMap: THREE.Texture
  ) {
    this.water = new WaterSurface(2000, waterNormalMap);
    this.sky = new SkyDome(1200);
    this.dayNight = new DayNightCycle(scene, sun);
    this.sky.addToScene(scene);
    this.water.addToScene(scene);
    this.islands = this.createArchipelago();
    scene.add(this.islands);
    this.weather = new WeatherSystem(scene, this.sky.getMaterial());
    this.habitatAnchors = this.createHabitatAnchors();
  }

  public update(deltaTime: number): void {
    this.dayNight.update(deltaTime);
    this.weather.update(deltaTime);
    this.sky.update(deltaTime);
    this.water.update(deltaTime, this.sun.position.clone().normalize());
  }

  public getCurrentHour(): number {
    return this.dayNight.getCurrentHour();
  }

  public getSpawnPoint(habitats: Habitat[]): THREE.Vector3 {
    const targetHabitat = habitats[Math.floor(Math.random() * habitats.length)];
    const anchors = this.habitatAnchors[targetHabitat] ?? [new THREE.Vector3()];
    const anchor = anchors[Math.floor(Math.random() * anchors.length)] ?? new THREE.Vector3();
    const jitter = new THREE.Vector3((Math.random() - 0.5) * 120, 0, (Math.random() - 0.5) * 120);
    const depth = this.habitatDepths[targetHabitat] ?? { min: -20, max: -60 };
    const position = anchor.clone().add(jitter);
    position.y = THREE.MathUtils.randFloat(depth.min, depth.max);
    return position;
  }

  private createArchipelago(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'island-archipelago';
    const islandMaterial = new THREE.MeshStandardMaterial({ color: 0x51452a, roughness: 0.8 });
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x3a6f3a });

    const islandGeometry = new THREE.CylinderGeometry(1, 5, 1, 6, 1, true);
    const foliageGeometry = new THREE.ConeGeometry(2, 6, 6);

    for (let i = 0; i < 40; i++) {
      const island = new THREE.Mesh(islandGeometry, islandMaterial);
      const scale = Math.random() * 12 + 4;
      island.scale.set(scale, scale * 0.7, scale);
      island.position.set((Math.random() - 0.5) * 600, -scale * 0.3, (Math.random() - 0.5) * 600);
      island.rotateX(-Math.PI / 2);
      island.receiveShadow = true;
      island.castShadow = true;
      group.add(island);

      const treeCount = THREE.MathUtils.randInt(5, 20);
      for (let t = 0; t < treeCount; t++) {
        const tree = new THREE.Mesh(foliageGeometry, foliageMaterial);
        const treeScale = Math.random() * 2 + 1;
        tree.scale.setScalar(treeScale);
        tree.position.set(
          island.position.x + (Math.random() - 0.5) * scale * 1.2,
          island.position.y + scale * 0.4,
          island.position.z + (Math.random() - 0.5) * scale * 1.2
        );
        tree.castShadow = true;
        group.add(tree);
      }
    }

    return group;
  }

  private createHabitatAnchors(): Record<Habitat, THREE.Vector3[]> {
    return {
      reef: [
        new THREE.Vector3(-160, -20, 120),
        new THREE.Vector3(140, -24, 90),
        new THREE.Vector3(-40, -18, -140)
      ],
      open_ocean: [
        new THREE.Vector3(-320, -60, 0),
        new THREE.Vector3(280, -70, -180),
        new THREE.Vector3(60, -65, 260)
      ],
      deep: [
        new THREE.Vector3(-420, -160, -260),
        new THREE.Vector3(340, -180, 220)
      ],
      river: [
        new THREE.Vector3(-60, -10, 40),
        new THREE.Vector3(40, -12, -60)
      ],
      ice: [
        new THREE.Vector3(-220, -22, 260),
        new THREE.Vector3(220, -30, 280)
      ],
      volcanic: [
        new THREE.Vector3(-260, -80, -220),
        new THREE.Vector3(200, -90, -260)
      ],
      ancient: [
        new THREE.Vector3(0, -120, 0),
        new THREE.Vector3(-80, -130, -320),
        new THREE.Vector3(160, -150, 320)
      ]
    };
  }
}
