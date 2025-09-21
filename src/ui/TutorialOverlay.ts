export class TutorialOverlay {
  private readonly root: HTMLElement;
  private readonly steps: string[] = [
    'Welcome Captain! Use W/A/S/D to sail the catamaran across Azure Depths.',
    'Scroll the mouse wheel to zoom the tactical camera in and out.',
    'Left click to cast your line when the reticle highlights a sonar pulse.',
    'Press ESC at any time to access the Codex and swap specialized lures.'
  ];
  private index = 0;

  constructor(container: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'tutorial-overlay';
    container.appendChild(this.root);

    this.render();
    this.root.addEventListener('click', () => this.advance());
  }

  private render(): void {
    this.root.innerHTML = `
      <div class="tutorial-card">
        <header>Flight Deck Briefing</header>
        <p>${this.steps[this.index]}</p>
        <footer>${this.index + 1} / ${this.steps.length} — Click to continue</footer>
      </div>
    `;
    if (this.index >= this.steps.length - 1) {
      setTimeout(() => this.root.classList.add('hidden'), 4000);
    }
  }

  private advance(): void {
    if (this.index < this.steps.length - 1) {
      this.index++;
      this.render();
    } else {
      this.root.classList.add('hidden');
    }
  }
}
