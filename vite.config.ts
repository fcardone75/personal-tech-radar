/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import projects from './src/data/projects.json';
import radar from './src/data/radar.json';
import { validateRadarData } from './src/data/validate';

// Fails `vite build` (and warns loudly in `vite dev`) when the radar data breaks the schema.
function radarDataGuard(): Plugin {
  return {
    name: 'radar-data-guard',
    buildStart() {
      const errors = validateRadarData(radar, projects);
      if (errors.length > 0) {
        this.error(`Invalid radar data (src/data):\n  - ${errors.join('\n  - ')}`);
      }
    },
  };
}

export default defineConfig({
  base: '/personal-tech-radar/',
  plugins: [radarDataGuard()],
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
