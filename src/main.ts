import './styles.css';
import { Game } from './core/Game';

const app = document.getElementById('app');
const overlay = document.getElementById('loading-overlay');
const progressBar = document.getElementById('loading-progress');
const tip = overlay?.querySelector('.tip');

if (!app) {
  throw new Error('App container missing');
}

const loadingTips = [
  'Charting reefs and scanning migratory patterns...',
  'Attuning sonar arrays to volcanic frequencies...',
  'Compiling codex entries for 60+ aquatic species...',
  'Filling bait lockers with handcrafted lures...'
];

let tipIndex = 0;
const updateTip = () => {
  if (tip) {
    tip.textContent = loadingTips[tipIndex % loadingTips.length];
  }
  tipIndex++;
};

updateTip();
const tipInterval = window.setInterval(updateTip, 2200);

const game = new Game(app, {
  onProgress: (progress) => {
    if (progressBar) {
      progressBar.style.width = `${Math.floor(progress * 100)}%`;
    }
  },
  onComplete: () => {
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 800);
    }
    window.clearInterval(tipInterval);
  }
});

void game.initialize();
if (app instanceof HTMLElement) {
  app.focus();
}

window.addEventListener('resize', () => {
  progressBar?.style.setProperty('width', '100%');
});
