export class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
  }

  public next(): number {
    // Mulberry32 PRNG
    this.seed += 0x6d2b79f5;
    let t = this.seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  public rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  public pick<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from empty array.');
    }
    const index = Math.floor(this.next() * items.length);
    return items[index];
  }
}
