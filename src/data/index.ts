import projectsJson from './projects.json';
import radarJson from './radar.json';
import type { Project, RadarData } from './model';

// The JSON files are validated at build time (vite.config.ts) and in the unit
// tests, so the casts below are safe.
export const radar = radarJson as RadarData;
export const projects = projectsJson as Project[];
export const projectsById = new Map(projects.map((p) => [p.id, p]));

export const REPO_URL = 'https://github.com/fcardone75/personal-tech-radar';
