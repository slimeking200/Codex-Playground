import * as THREE from 'three';
import { FishSpecies } from './SpeciesData';
import { FishBehavior } from './FishBehavior';

export class Fish {
  public readonly object: THREE.Group;
  private readonly body: THREE.Mesh;
  private readonly fins: THREE.Mesh[] = [];
  private forward = new THREE.Vector3(1, 0, 0);
  private behavior: FishBehavior;
  private wobblePhase = Math.random() * Math.PI * 2;
  private hooked = false;

  constructor(public readonly species: FishSpecies, startPosition: THREE.Vector3) {
    this.object = new THREE.Group();
    this.object.position.copy(startPosition);
    this.behavior = new FishBehavior(species.habitat[0], startPosition);

    const bodyGeometry = new THREE.CapsuleGeometry(2, 6, 6, 12);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.6, 0.5),
      metalness: 0.3,
      roughness: 0.5
    });
    this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.body.castShadow = true;
    this.object.add(this.body);

    this.fins.push(this.createFin(new THREE.Vector3(-2.5, 0, 0), new THREE.Vector3(0, 0, Math.PI / 2)));
    this.fins.push(this.createFin(new THREE.Vector3(2.5, 0, 0), new THREE.Vector3(0, 0, Math.PI / 2)));
    this.fins.push(this.createFin(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.PI / 2, 0, 0)));
  }

  private createFin(position: THREE.Vector3, rotation: THREE.Vector3): THREE.Mesh {
    const geometry = new THREE.ConeGeometry(1.4, 2.6, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const fin = new THREE.Mesh(geometry, material);
    fin.position.copy(position);
    fin.rotation.set(rotation.x, rotation.y, rotation.z);
    this.object.add(fin);
    return fin;
  }

  public update(deltaTime: number): void {
    if (this.hooked) {
      this.animateIdle(deltaTime);
      return;
    }
    this.forward = this.behavior.update(deltaTime, this.object.position, this.forward);
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.forward.clone().normalize());
    this.object.quaternion.slerp(targetQuaternion, 0.1);

    this.animateIdle(deltaTime);
  }

  public setHooked(value: boolean): void {
    this.hooked = value;
  }

  public isHooked(): boolean {
    return this.hooked;
  }

  private animateIdle(deltaTime: number): void {
    this.wobblePhase += deltaTime * 6;
    const wobble = Math.sin(this.wobblePhase) * 0.2;
    this.body.rotation.y = wobble * 0.5;
    this.body.position.y = Math.sin(this.wobblePhase * 0.5) * 0.3;

    for (const fin of this.fins) {
      fin.rotation.y = wobble;
    }
  }
}
