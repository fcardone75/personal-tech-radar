import radarIt from '../data/radar.it.json';
import type { DataTranslation, Project, RadarEntry } from '../data/model';
import { en, it, type Strings } from './strings';

export const LANGS = ['it', 'en'] as const;
export type Lang = (typeof LANGS)[number];

// Validated at build time and in the unit tests (validateTranslation), like radar.json.
const DATA_IT = radarIt as DataTranslation;

export interface Locale {
  lang: Lang;
  t: Strings;
  /** The entry's reason, in this language. */
  why: (entry: RadarEntry) => string;
  /** The project with its description and years in this language. */
  project: (project: Project) => Project;
  /** "2026-11" → "Nov 2026" / "nov 2026". */
  month: (value: string) => string;
}

export function localize(lang: Lang): Locale {
  const monthFormat = new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' });
  const month = (value: string) => {
    const [year, m] = value.split('-').map(Number);
    return m ? monthFormat.format(Date.UTC(year, m - 1, 1)) : value;
  };

  if (lang === 'en') {
    return { lang, t: en, why: (entry) => entry.why, project: (project) => project, month };
  }
  return {
    lang,
    t: it,
    why: (entry) => DATA_IT.entries[entry.id] ?? entry.why,
    project: (project) => {
      const text = DATA_IT.projects[project.id];
      if (!text) return project;
      return { ...project, description: text.description, years: project.years === null ? null : (text.years ?? project.years) };
    },
    month,
  };
}

const STORAGE_KEY = 'radar-lang';

/** The saved choice, else the browser language, else English. */
export function initialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'it' || saved === 'en') return saved;
  } catch {
    // Storage can be blocked: fall back to the browser language.
  }
  return window.navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function saveLang(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not persisted: the choice still applies to this visit.
  }
}
