import * as THREE from 'three';
import { WaterSurface } from './WaterSurface';
import { SkyDome } from './SkyDome';
import { DayNightCycle } from '../simulation/DayNightCycle';
import { WeatherSystem } from '../simulation/WeatherSystem';

export class WorldManager {
  private water: WaterSurface;
  private sky: SkyDome;
  private dayNight: DayNightCycle;
  private weather: WeatherSystem;
  private islands: THREE.Group;

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
  }

  public update(deltaTime: number): void {
    this.dayNight.update(deltaTime);
    this.weather.update(deltaTime);
    this.sky.update(deltaTime);
    this.water.update(deltaTime, this.sun.position.clone().normalize());
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
}
