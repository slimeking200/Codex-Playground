import { Lure } from './Lure';

export interface InventoryItem<T> {
  item: T;
  quantity: number;
}

export class Inventory<T extends { id: string }> {
  private items = new Map<string, InventoryItem<T>>();

  public add(item: T, amount = 1): void {
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += amount;
    } else {
      this.items.set(item.id, { item, quantity: amount });
    }
  }

  public remove(itemId: string, amount = 1): boolean {
    const existing = this.items.get(itemId);
    if (!existing || existing.quantity < amount) {
      return false;
    }
    existing.quantity -= amount;
    if (existing.quantity === 0) {
      this.items.delete(itemId);
    }
    return true;
  }

  public list(): InventoryItem<T>[] {
    return Array.from(this.items.values());
  }

  public has(itemId: string): boolean {
    return this.items.has(itemId);
  }

  public serialize(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, value] of this.items.entries()) {
      result[key] = value.quantity;
    }
    return result;
  }

  public static deserialize<U extends { id: string }>(items: U[], data: Record<string, number>): Inventory<U> {
    const inventory = new Inventory<U>();
    for (const item of items) {
      const quantity = data[item.id];
      if (quantity) {
        inventory.add(item, quantity);
      }
    }
    return inventory;
  }
}

export type LureInventory = Inventory<Lure>;
