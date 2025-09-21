import * as THREE from 'three';
import { clamp } from '../utils/MathUtils';

export class Boat {
  public readonly object: THREE.Group;
  private readonly hull: THREE.Mesh;
  private readonly sail: THREE.Mesh;
  private readonly rod: THREE.Mesh;
  private heading = 0;
  private speed = 0;

  constructor() {
    this.object = new THREE.Group();
    this.object.position.set(0, 0.5, 0);

    const hullGeometry = new THREE.CapsuleGeometry(3, 14, 8, 16);
    const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x7c4f2a, roughness: 0.8 });
    this.hull = new THREE.Mesh(hullGeometry, hullMaterial);
    this.hull.castShadow = true;
    this.hull.rotation.z = Math.PI / 2;
    this.object.add(this.hull);

    const sailGeometry = new THREE.PlaneGeometry(8, 10, 1, 1);
    const sailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.sail = new THREE.Mesh(sailGeometry, sailMaterial);
    this.sail.position.set(0, 5, 0);
    this.sail.rotation.y = Math.PI / 2;
    this.object.add(this.sail);

    const rodGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6);
    const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    this.rod = new THREE.Mesh(rodGeometry, rodMaterial);
    this.rod.position.set(2, 2, -2);
    this.rod.rotation.z = Math.PI / 4;
    this.object.add(this.rod);
  }

  public update(deltaTime: number, input: { forward: number; turn: number }): void {
    const acceleration = input.forward * 12;
    this.speed = clamp(this.speed + acceleration * deltaTime, -8, 18);
    this.heading += input.turn * deltaTime * 1.2;

    const velocity = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading)).multiplyScalar(this.speed * deltaTime);
    this.object.position.add(velocity);
    this.object.rotation.y = this.heading;

    this.sail.rotation.z = Math.sin(performance.now() * 0.001 + this.heading) * 0.2;
    this.rod.rotation.x = Math.sin(performance.now() * 0.002) * 0.3;
  }

  public getPosition(): THREE.Vector3 {
    return this.object.position.clone();
  }
}
