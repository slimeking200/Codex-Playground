# Azure Depths – 3D Fishing Adventure

Azure Depths is an expansive Three.js-powered fishing simulation packed with reactive weather systems, procedurally generated islands, and a rich codex of legendary species. Sail a stylized catamaran, hunt for sonar pings, and complete quest contracts to master every biome.

## Features

- **Cinematic world building** – dynamic day/night lighting, shader-driven water, volumetric skydome, and weather transitions from calm mornings to electric storms.
- **Deep progression systems** – level up mastery, manage lure inventory, unlock new biomes, and chase multi-stage questlines.
- **Living ecosystem** – dozens of fish archetypes with bespoke behaviors, schooling instincts, and respawn timers that keep the world active.
- **Diegetic UI** – holographic HUD, codex menus, expedition journal, tutorial briefings, and animated catch feed.
- **Immersive ambience** – adaptive audio beds and tactile feedback such as sonar rings, water ripples, and reactive sails.

## Fishing systems

- **Interactive encounters** – casting near sonar pings can trigger a full tension-management minigame. Hold **LMB** or **Space** to reel, ease off before the line flashes red, and balance slack to land ferocious epic and mythic species.
- **Habitat-aware spawns** – every biome (reef, river, volcanic, ancient ruins, and more) maintains handcrafted anchor points and depth bands so schools swim in believable strata instead of random scatter.
- **Temporal behavior** – the day/night cycle drives capture odds; stalking a nocturnal Voltaic Eel at dusk yields better hook-ups than chasing it at noon.
- **Rapid lure swaps** – tap number keys to quick-equip lures tailored for specific habitats without leaving the helm.

## Getting Started

```bash
npm install
npm run dev
```

Open the printed development URL in your browser to explore the world. Use **WASD** to steer, scroll to zoom, click to cast, and **Esc** to open the codex for lure swaps.

### Windows setup

The project runs natively on Windows. If you would prefer a double-click workflow instead of running commands manually:

1. Install the latest [Node.js LTS release](https://nodejs.org/) which bundles `npm`.
2. Open the repository in File Explorer.
3. Double-click `scripts\windows-dev.cmd` to install dependencies (if needed) and launch the Vite development server in a console window.
4. When you are ready for a production-ready bundle, double-click `scripts\windows-build.cmd`. The optimized assets will be generated in `dist\`.

Both scripts check for Node.js, bootstrap dependencies on first run, and surface any build errors directly in the console.

To produce an optimized build from any terminal:

```bash
npm run build
```

The compiled assets will land in the `dist/` directory ready for static hosting or inclusion in a Windows installer.
