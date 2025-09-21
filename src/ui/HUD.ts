import { Player } from '../entities/Player';
import { QuestSystem } from '../entities/QuestSystem';
import { EncounterHudInfo } from '../core/FishingEncounter';

export class HUD {
  private readonly root: HTMLElement;
  private readonly statsPanel: HTMLElement;
  private readonly questPanel: HTMLElement;
  private readonly tipPanel: HTMLElement;
  private readonly encounterPanel: HTMLElement;
  private readonly tipMessages: string[] = [
    'Use W/A/S/D to steer the catamaran and hunt for sonar pings.',
    'Press number keys to cycle lures tailored to specific habitats.',
    'Watch the day-night cycle — some species only surface at dusk!',
    'Storms stir up rare fish. Seek thunder for legendary catches.'
  ];
  private tipIndex = 0;
  private tipTimer = 0;

  constructor(container: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    container.appendChild(this.root);

    this.statsPanel = document.createElement('section');
    this.statsPanel.className = 'hud-stats';
    this.root.appendChild(this.statsPanel);

    this.questPanel = document.createElement('section');
    this.questPanel.className = 'hud-quests';
    this.root.appendChild(this.questPanel);

    this.tipPanel = document.createElement('section');
    this.tipPanel.className = 'hud-tip';
    this.root.appendChild(this.tipPanel);
    this.renderTips();

    this.encounterPanel = document.createElement('section');
    this.encounterPanel.className = 'hud-encounter hidden';
    this.root.appendChild(this.encounterPanel);
  }

  public update(
    deltaTime: number,
    player: Player,
    questSystem: QuestSystem,
    encounter?: EncounterHudInfo
  ): void {
    this.renderStats(player);
    this.renderQuests(questSystem);
    this.renderEncounter(encounter);

    this.tipTimer += deltaTime;
    if (this.tipTimer > 12) {
      this.tipTimer = 0;
      this.tipIndex = (this.tipIndex + 1) % this.tipMessages.length;
      this.renderTips();
    }
  }

  private renderStats(player: Player): void {
    const stats = player.stats;
    this.statsPanel.innerHTML = `
      <h2>Captain Status</h2>
      <div class="row"><span>Level</span><span>${stats.masteryLevel}</span></div>
      <div class="row"><span>Experience</span><span>${stats.experience.toFixed(0)}</span></div>
      <div class="row"><span>Stamina</span><span>${stats.stamina.toFixed(0)}</span></div>
      <div class="row"><span>Funds</span><span>₳ ${stats.funds.toFixed(0)}</span></div>
      <div class="row"><span>Lure</span><span>${stats.equippedLure.name}</span></div>
    `;
  }

  private renderQuests(questSystem: QuestSystem): void {
    const quests = questSystem.getQuests();
    this.questPanel.innerHTML = `<h2>Contracts</h2>`;
    for (const quest of quests) {
      const article = document.createElement('article');
      article.className = quest.completed ? 'quest completed' : 'quest';
      article.innerHTML = `
        <header>${quest.title}</header>
        <p>${quest.narrative}</p>
        <ul>
          ${quest.objectives
            .map((objective) => `
              <li>${objective.description} ${objective.quantity && objective.quantity > 0 ? `(${objective.quantity} left)` : '✓'}
              </li>
            `)
            .join('')}
        </ul>
      `;
      this.questPanel.appendChild(article);
    }
  }

  private renderTips(): void {
    this.tipPanel.innerHTML = `<h2>Sonar Tip</h2><p>${this.tipMessages[this.tipIndex]}</p>`;
  }

  private renderEncounter(info?: EncounterHudInfo): void {
    if (!info || info.state !== 'reeling') {
      this.encounterPanel.classList.add('hidden');
      this.encounterPanel.innerHTML = '';
      return;
    }

    this.encounterPanel.classList.remove('hidden');
    const progressPercent = Math.round(info.progress * 100);
    const tensionPercent = Math.round(info.tension);
    this.encounterPanel.innerHTML = `
      <header>
        <h2>Hooked ${info.fishName}</h2>
        <span class="rarity ${info.rarity}">${info.rarity.toUpperCase()}</span>
      </header>
      <p class="difficulty">Difficulty: ${info.difficultyLabel}</p>
      <div class="bars">
        <label>Tension</label>
        <div class="bar tension"><span style="width: ${tensionPercent}%"></span></div>
        <label>Reel Progress</label>
        <div class="bar progress"><span style="width: ${progressPercent}%"></span></div>
      </div>
      <footer>Hold LMB or Space to reel. Ease up if the tension peaks in the red.</footer>
    `;
  }
}
