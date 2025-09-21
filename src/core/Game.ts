import * as THREE from 'three';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { ResourceLoader, LoadingCallbacks } from './ResourceLoader';
import { WorldManager } from '../environment/WorldManager';
import { Player } from '../entities/Player';
import { FISH_SPECIES, FishSpecies } from '../entities/SpeciesData';
import { Fish } from '../entities/Fish';
import { QuestSystem } from '../entities/QuestSystem';
import { HUD } from '../ui/HUD';
import { MenuSystem } from '../ui/MenuSystem';
import { Journal } from '../ui/Journal';
import { TutorialOverlay } from '../ui/TutorialOverlay';
import { TaskScheduler } from './TaskScheduler';
import { Random } from '../utils/Random';
import { FishingEncounter, EncounterHudInfo } from './FishingEncounter';

interface SonarPing {
  mesh: THREE.Mesh;
  time: number;
}

export class Game {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly clock = new THREE.Clock();
  private readonly input: InputManager;
  private readonly audio = new AudioManager();
  private readonly loader: ResourceLoader;
  private readonly player = new Player();
  private readonly questSystem = new QuestSystem();
  private readonly hud: HUD;
  private readonly menu: MenuSystem;
  private readonly journal: Journal;
  private readonly tutorial: TutorialOverlay;
  private readonly scheduler = new TaskScheduler();
  private world?: WorldManager;
  private fishes: Fish[] = [];
  private sonarPings: SonarPing[] = [];
  private readonly fishSonarTasks = new Map<Fish, number>();
  private readonly catchFeed: HTMLElement;
  private hookingCooldown = 0;
  private cameraPivot = new THREE.Object3D();
  private cameraOffset = new THREE.Vector3(0, 35, 65);
  private readonly random = new Random(1337);
  private activeEncounter?: FishingEncounter;

  constructor(private readonly container: HTMLElement, private readonly callbacks: LoadingCallbacks) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 5000);
    this.camera.position.set(0, 60, 120);
    this.camera.lookAt(0, 0, 0);

    this.scene.background = new THREE.Color(0x0a1420);
    this.scene.fog = new THREE.FogExp2(0x0a1420, 0.0006);

    this.cameraPivot.add(this.camera);
    this.scene.add(this.cameraPivot);

    this.input = new InputManager(this.container);
    this.loader = new ResourceLoader(callbacks);

    this.hud = new HUD(this.container);
    this.menu = new MenuSystem(this.container, this.player);
    this.journal = new Journal(this.container);
    this.tutorial = new TutorialOverlay(this.container);

    this.catchFeed = document.createElement('div');
    this.catchFeed.className = 'catch-feed';
    this.container.appendChild(this.catchFeed);

    window.addEventListener('resize', () => this.onResize());
    this.renderer.domElement.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        this.castLine();
      }
    });
    this.onResize();
  }

  public async initialize(): Promise<void> {
    const ambient = new THREE.AmbientLight(0x96b9ff, 0.4);
    ambient.name = 'ambient-light';
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff6d8, 1.2);
    sun.position.set(120, 180, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    sun.shadow.camera.left = -180;
    sun.shadow.camera.right = 180;
    sun.shadow.camera.top = 180;
    sun.shadow.camera.bottom = -180;
    this.scene.add(sun);

    this.scene.add(this.player.boat.object);

    const waterNormal = this.loader.createWaterNormalTexture();
    this.world = new WorldManager(this.scene, sun, waterNormal);

    this.spawnFishSchools();
    this.animate();
    this.callbacks.onProgress?.(1, 'world');
    this.callbacks.onComplete?.();
  }

  private spawnFishSchools(): void {
    if (!this.world) {
      return;
    }
    for (const species of FISH_SPECIES) {
      const population = this.getPopulationForSpecies(species);
      for (let i = 0; i < population; i++) {
        const position = this.world.getSpawnPoint(species.habitat);
        const fish = new Fish(species, position);
        this.registerFish(fish);
      }
    }
  }

  private getPopulationForSpecies(species: FishSpecies): number {
    switch (species.rarity) {
      case 'common':
        return 12;
      case 'uncommon':
        return 8;
      case 'rare':
        return 5;
      case 'epic':
        return 3;
      case 'legendary':
        return 2;
      case 'mythic':
        return 1;
      default:
        return 4;
    }
  }

  private animate = (): void => {
    const deltaTime = this.clock.getDelta();
    this.hookingCooldown = Math.max(0, this.hookingCooldown - deltaTime);

    this.world?.update(deltaTime);
    this.player.update(deltaTime, this.input);
    this.handleQuickLureSwap();
    this.menu.update();

    for (const fish of this.fishes) {
      fish.update(deltaTime);
    }

    const encounterInfo = this.updateEncounter(deltaTime);
    this.updateCamera(deltaTime);
    this.updateSonar(deltaTime);

    this.hud.update(deltaTime, this.player, this.questSystem, encounterInfo);

    this.scheduler.update(deltaTime);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  private updateCamera(deltaTime: number): void {
    const target = this.player.getPosition();
    this.cameraPivot.position.lerp(target, 0.1);

    const zoomChange = this.input.consumeWheelDelta();
    if (zoomChange !== 0) {
      this.cameraOffset.addScaledVector(new THREE.Vector3(0, 1, -1).normalize(), zoomChange * 0.01);
      this.cameraOffset.clampLength(20, 120);
    }

    const heading = this.player.boat.object.rotation.y;
    this.cameraPivot.rotation.y = heading;
    const desiredPosition = this.cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), heading);
    this.camera.position.lerp(desiredPosition, THREE.MathUtils.clamp(deltaTime * 2, 0, 1));
    const lookTarget = this.cameraPivot.position.clone();
    lookTarget.y -= 10;
    this.camera.lookAt(lookTarget);
  }

  private updateSonar(deltaTime: number): void {
    for (let i = this.sonarPings.length - 1; i >= 0; i--) {
      const ping = this.sonarPings[i];
      ping.time += deltaTime;
      ping.mesh.scale.addScalar(deltaTime * 2);
      const material = ping.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(0.7, 0, ping.time / 4);
      if (ping.time > 4) {
        this.scene.remove(ping.mesh);
        ping.mesh.geometry.dispose();
        material.dispose();
        this.sonarPings.splice(i, 1);
      }
    }
  }

  private castLine(): void {
    if (this.hookingCooldown > 0 || this.activeEncounter) {
      return;
    }
    this.audio.resume().catch(() => undefined);
    this.hookingCooldown = 1.5;

    const catchable = this.findCatchCandidate();
    if (catchable) {
      const chance = this.getCatchChance(catchable.species);
      if (Math.random() < chance) {
        this.activeEncounter = new FishingEncounter(catchable, this.random);
        this.spawnCatchNotification(`Hooked ${catchable.species.name}! Steady your reel.`, '#63d9ff');
      } else {
        this.spawnCatchNotification('The line went slack...', '#9fb1c7');
      }
    } else {
      this.spawnCatchNotification('No sonar echo nearby.', '#88aadd');
    }
  }

  private findCatchCandidate(): Fish | undefined {
    const boatPosition = this.player.getPosition();
    let closest: Fish | undefined;
    let distance = Infinity;
    for (const fish of this.fishes) {
      const dist = fish.object.position.distanceTo(boatPosition);
      if (dist < distance && dist < 90) {
        distance = dist;
        closest = fish;
      }
    }
    return closest;
  }

  private getCatchChance(species: FishSpecies): number {
    let baseChance: number;
    switch (species.rarity) {
      case 'common':
        baseChance = 0.85;
        break;
      case 'uncommon':
        baseChance = 0.7;
        break;
      case 'rare':
        baseChance = 0.48;
        break;
      case 'epic':
        baseChance = 0.34;
        break;
      case 'legendary':
        baseChance = 0.22;
        break;
      case 'mythic':
        baseChance = 0.12;
        break;
      default:
        baseChance = 0.25;
    }

    const lure = this.player.stats.equippedLure;
    if (species.habitat.some((habitat) => lure.idealHabitats.includes(habitat))) {
      baseChance += 0.1;
    }

    const hour = this.world?.getCurrentHour() ?? 12;
    const [start, end] = species.activeHours;
    const withinHours = start <= end ? hour >= start && hour <= end : hour >= start || hour <= end;
    if (withinHours) {
      baseChance += 0.08;
    } else {
      baseChance -= 0.08;
    }

    return THREE.MathUtils.clamp(baseChance, 0.05, 0.95);
  }

  private resolveCatch(fish: Fish): void {
    this.spawnCatchNotification(`Caught ${fish.species.name}!`, '#6df6c1');
    this.questSystem.registerCatch(this.player, fish.species.id);
    this.removeFish(fish);

    this.scheduler.schedule(() => this.respawnFish(fish.species), this.random.range(20, 45));
  }

  private respawnFish(species: FishSpecies): void {
    if (!this.world) {
      return;
    }
    const position = this.world.getSpawnPoint(species.habitat);
    const fish = new Fish(species, position);
    this.registerFish(fish);
  }

  private createSonarPing(position: THREE.Vector3): void {
    const geometry = new THREE.RingGeometry(2, 2.5, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0x66d2ff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position.clone().setY(0.5));
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);
    this.sonarPings.push({ mesh, time: 0 });
  }

  private registerFish(fish: Fish): void {
    this.scene.add(fish.object);
    this.fishes.push(fish);
    this.createSonarPing(fish.object.position.clone());
    this.scheduleFishSonar(fish);
  }

  private removeFish(fish: Fish): void {
    this.cancelFishSonar(fish);
    this.scene.remove(fish.object);
    this.fishes = this.fishes.filter((candidate) => candidate !== fish);
  }

  private scheduleFishSonar(fish: Fish): void {
    const delay = this.random.range(4, 12);
    const taskId = this.scheduler.schedule(() => {
      if (!this.fishes.includes(fish)) {
        this.fishSonarTasks.delete(fish);
        return;
      }
      this.createSonarPing(fish.object.position.clone());
      this.scheduleFishSonar(fish);
    }, delay);
    this.fishSonarTasks.set(fish, taskId);
  }

  private cancelFishSonar(fish: Fish): void {
    const taskId = this.fishSonarTasks.get(fish);
    if (taskId !== undefined) {
      this.scheduler.cancel(taskId);
      this.fishSonarTasks.delete(fish);
    }
  }

  private spawnCatchNotification(message: string, color: string): void {
    const entry = document.createElement('div');
    entry.className = 'catch-feed-entry';
    entry.textContent = message;
    entry.style.borderLeftColor = color;
    this.catchFeed.prepend(entry);
    setTimeout(() => entry.classList.add('visible'), 10);
    setTimeout(() => {
      entry.classList.remove('visible');
      setTimeout(() => entry.remove(), 400);
    }, 4000);
  }

  private updateEncounter(deltaTime: number): EncounterHudInfo | undefined {
    if (!this.activeEncounter) {
      return undefined;
    }

    const reeling = this.input.isMouseDown(0) || this.input.isPressed('Space');
    const boatPosition = this.player.getPosition().clone();
    const state = this.activeEncounter.update(deltaTime, reeling, boatPosition);
    const info = this.activeEncounter.getHudInfo();

    if (state === 'reeling') {
      return info;
    }

    const fish = this.activeEncounter.getFish();
    if (state === 'caught') {
      this.resolveCatch(fish);
    } else if (state === 'escaped') {
      this.spawnCatchNotification(`${fish.species.name} slipped the line!`, '#ffbb6b');
    } else if (state === 'snapped') {
      this.spawnCatchNotification(`${fish.species.name} snapped the line!`, '#ff6b6b');
    }

    this.activeEncounter = undefined;
    this.hookingCooldown = 0.5;
    return undefined;
  }

  private handleQuickLureSwap(): void {
    if (this.input.consumeKeyPress('Digit1')) {
      this.tryEquipLure(0);
    }
    if (this.input.consumeKeyPress('Digit2')) {
      this.tryEquipLure(1);
    }
    if (this.input.consumeKeyPress('Digit3')) {
      this.tryEquipLure(2);
    }
    if (this.input.consumeKeyPress('Digit4')) {
      this.tryEquipLure(3);
    }
  }

  private tryEquipLure(index: number): void {
    const changed = this.player.quickEquipByIndex(index);
    if (changed) {
      this.spawnCatchNotification(`Equipped ${this.player.stats.equippedLure.name}`, '#b0e3ff');
    }
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
