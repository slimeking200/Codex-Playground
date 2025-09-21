import { Player } from '../entities/Player';
import { LURES } from '../entities/Lure';

export class MenuSystem {
  private readonly root: HTMLElement;
  private readonly lureList: HTMLElement;
  private readonly pauseOverlay: HTMLElement;
  private isVisible = false;
  private lastEquippedId: string;

  constructor(container: HTMLElement, private readonly player: Player) {
    this.root = document.createElement('div');
    this.root.className = 'menu-system hidden';
    container.appendChild(this.root);

    const panel = document.createElement('div');
    panel.className = 'menu-panel';
    this.root.appendChild(panel);

    const title = document.createElement('h1');
    title.textContent = 'Azure Depths Codex';
    panel.appendChild(title);

    this.lureList = document.createElement('ul');
    this.lureList.className = 'lure-list';
    panel.appendChild(this.lureList);

    this.pauseOverlay = document.createElement('div');
    this.pauseOverlay.className = 'pause-overlay hidden';
    this.pauseOverlay.innerHTML = `<p>Paused</p><span>Press ESC to resume</span>`;
    container.appendChild(this.pauseOverlay);

    this.lastEquippedId = this.player.stats.equippedLure.id;
    this.renderLures();

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.toggle();
      }
      const numeric = parseInt(event.key, 10);
      if (!Number.isNaN(numeric)) {
        const lure = LURES[numeric - 1];
        if (lure) {
          player.equipLure(lure.id);
        }
      }
    });
  }

  public toggle(): void {
    this.isVisible = !this.isVisible;
    this.root.classList.toggle('hidden', !this.isVisible);
    this.pauseOverlay.classList.toggle('hidden', !this.isVisible);
  }

  public update(): void {
    if (!this.isVisible && this.player.stats.equippedLure.id !== this.lastEquippedId) {
      this.renderLures();
    }
  }

  private renderLures(): void {
    this.lureList.innerHTML = '';
    this.lastEquippedId = this.player.stats.equippedLure.id;
    for (const lure of LURES) {
      const li = document.createElement('li');
      li.className = this.player.stats.equippedLure.id === lure.id ? 'active' : '';
      li.innerHTML = `
        <header>${lure.name}</header>
        <p>${lure.description}</p>
        <footer>Action: ${lure.action} • Tier: ${lure.rarity}</footer>
      `;
      li.addEventListener('click', () => {
        this.player.equipLure(lure.id);
        this.renderLures();
      });
      this.lureList.appendChild(li);
    }
  }
}
