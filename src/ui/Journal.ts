import { LOCATIONS } from '../entities/LocationData';

export class Journal {
  private readonly root: HTMLElement;
  private readonly list: HTMLElement;
  private readonly detail: HTMLElement;

  constructor(container: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'journal';
    container.appendChild(this.root);

    this.list = document.createElement('aside');
    this.list.className = 'journal-list';
    this.root.appendChild(this.list);

    this.detail = document.createElement('section');
    this.detail.className = 'journal-detail';
    this.root.appendChild(this.detail);

    this.renderList();
  }

  private renderList(): void {
    this.list.innerHTML = '<h3>Exploration Log</h3>';
    LOCATIONS.forEach((location) => {
      const button = document.createElement('button');
      button.textContent = location.name;
      button.addEventListener('click', () => this.renderDetail(location.id));
      this.list.appendChild(button);
    });
    if (LOCATIONS.length > 0) {
      this.renderDetail(LOCATIONS[0].id);
    }
  }

  private renderDetail(locationId: string): void {
    const location = LOCATIONS.find((loc) => loc.id === locationId);
    if (!location) {
      this.detail.innerHTML = '<p>Unknown location.</p>';
      return;
    }
    this.detail.innerHTML = `
      <header>
        <h2>${location.name}</h2>
        <span class="biome">Biome: ${location.biome.replace('_', ' ')}</span>
      </header>
      <p>${location.description}</p>
      <p class="level">Recommended Level ${location.recommendedLevel}</p>
      ${location.unlockedBy ? `<p class="unlock">Unlock Requirement: ${location.unlockedBy}</p>` : ''}
      <h4>Points of Interest</h4>
      <ul>${location.pointsOfInterest.map((poi) => `<li>${poi}</li>`).join('')}</ul>
    `;
  }
}
