import * as THREE from 'three';
import { Boat } from './Boat';
import { InputManager } from '../core/InputManager';
import { Lure, LURES } from './Lure';
import { Inventory } from './Inventory';

export interface PlayerStats {
  masteryLevel: number;
  experience: number;
  stamina: number;
  funds: number;
  equippedLure: Lure;
}

export class Player {
  public readonly boat: Boat;
  public readonly lureInventory: Inventory<Lure>;
  public stats: PlayerStats;
  private staminaRegenTimer = 0;

  constructor() {
    this.boat = new Boat();
    this.lureInventory = new LureInventory();
    this.stats = {
      masteryLevel: 1,
      experience: 0,
      stamina: 100,
      funds: 250,
      equippedLure: LURES[0]
    };
    this.lureInventory.add(LURES[0], 1);
    this.lureInventory.add(LURES[1], 1);
    this.lureInventory.add(LURES[2], 1);
  }

  public update(deltaTime: number, input: InputManager): void {
    const forward = (input.isPressed('KeyW') ? 1 : 0) - (input.isPressed('KeyS') ? 1 : 0);
    const turn = (input.isPressed('KeyD') ? 1 : 0) - (input.isPressed('KeyA') ? 1 : 0);
    this.boat.update(deltaTime, { forward, turn });

    this.staminaRegenTimer += deltaTime;
    if (this.staminaRegenTimer > 2) {
      this.stats.stamina = Math.min(100, this.stats.stamina + 1);
      this.staminaRegenTimer = 0;
    }
  }

  public awardExperience(amount: number): void {
    this.stats.experience += amount;
    const required = this.stats.masteryLevel * 100;
    if (this.stats.experience >= required) {
      this.stats.experience -= required;
      this.stats.masteryLevel++;
      this.stats.stamina = 100;
    }
  }

  public spendFunds(amount: number): boolean {
    if (this.stats.funds < amount) {
      return false;
    }
    this.stats.funds -= amount;
    return true;
  }

  public equipLure(lureId: string): boolean {
    const item = this.lureInventory.list().find((entry) => entry.item.id === lureId);
    if (!item) {
      return false;
    }
    this.stats.equippedLure = item.item;
    return true;
  }

  public getPosition(): THREE.Vector3 {
    return this.boat.getPosition();
  }
}
