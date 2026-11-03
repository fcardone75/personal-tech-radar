import type { MovementId, QuadrantId, RingId } from '../data/model';

// Every piece of interface copy, in English and Italian. `it` is typed against
// `en`, so a missing translation fails the type check.

interface RingText {
  name: string;
  help: string;
  description: string;
}

export interface Strings {
  meta: { title: string; description: string };
  skipLink: string;
  header: {
    tagline: string;
    nav: string;
    radar: string;
    moves: string;
    projects: string;
    principles: string;
    language: string;
  };
  hero: {
    edition: (edition: string) => string;
    eyebrow: string;
    title: string;
    titleEm: string;
    intro: string;
    role: string;
    place: string;
    explore: string;
    source: string;
  };
  quadrants: Record<QuadrantId, string>;
  rings: Record<RingId, RingText>;
  movements: Record<MovementId, string>;
  stats: {
    label: string;
    technologies: string;
    quadrants: string;
    rings: string;
    perRing: string;
  };
  explorer: {
    index: string;
    title: string;
    lead: string;
    entries: (count: number) => string;
    showing: (shown: number, total: number) => string;
    dimmed: string;
    clear: string;
    noMatch: (query: string, scope: string) => string;
    noEntries: (scope: string) => string;
    scope: (parts: string) => string;
    ringKeyLabel: string;
    ringKeyNote: string;
  };
  controls: {
    view: string;
    radar: string;
    list: string;
    search: string;
    searchPlaceholder: string;
    quadrant: string;
    allQuadrants: string;
    ringFilter: string;
    all: string;
  };
  chart: {
    label: (count: number) => string;
  };
  detail: {
    keyLabel: string;
    keyKicker: string;
    keyTitle: string;
    keyLead: string;
    keyCount: (count: number) => string;
    shapes: string;
    hint: string;
    previous: string;
    next: string;
    close: string;
    why: string;
    since: string;
    lastReviewed: string;
    edition: string;
    usedIn: string;
    noProject: string;
    note: string;
  };
  list: {
    label: string;
    caption: string;
    technology: string;
    ring: string;
    since: string;
    usedIn: string;
    why: string;
  };
  moveKey: string;
  moves: {
    index: string;
    title: string;
    baseline: (edition: string) => string;
  };
  projects: {
    index: string;
    title: string;
    lead: string;
    count: (count: number) => string;
    fewer: string;
    all: (count: number) => string;
  };
  principles: {
    index: string;
    title: string;
    items: Array<{ title: string; text: string }>;
  };
  footer: {
    motto: string;
    source: string;
    meta: (edition: string) => string;
  };
}

export const en: Strings = {
  meta: {
    title: 'Flaviano Cardone — Technology Radar',
    description:
      'How I choose technology: a personal technology radar by Flaviano Cardone, Senior Cloud & AI Solution Architect. Technology is a choice, not a checklist.',
  },
  skipLink: 'Skip to the radar',
  header: {
    tagline: 'Engineering journal',
    nav: 'Primary',
    radar: 'Radar',
    moves: 'Moves',
    projects: 'Projects',
    principles: 'Principles',
    language: 'Language',
  },
  hero: {
    edition: (edition) => `Edition ${edition}`,
    eyebrow: 'Personal technology radar',
    title: 'Technology is a choice.',
    titleEm: 'Not a checklist.',
    intro:
      'My evolving perspective on the tools, platforms and ideas shaping how I build software. Built on experience, curiosity and engineering trade-offs.',
    role: 'Senior Cloud & AI Solution Architect and Technical Lead',
    place: 'Chartered engineer, Order of Engineers of Naples, no. 17141',
    explore: 'Explore the radar',
    source: 'View the source',
  },
  quadrants: {
    techniques: 'Techniques & Architecture',
    platforms: 'Platforms & Infrastructure',
    languages: 'Languages & Frameworks',
    'data-ai': 'Data & AI',
  },
  rings: {
    adopt: { name: 'Adopt', help: 'Confident choice', description: 'My default. I use it in production and recommend it.' },
    trial: { name: 'Trial', help: 'Experiment in practice', description: 'Used on real work. Still proving its fit.' },
    assess: { name: 'Assess', help: 'Worth investigating', description: 'Promising. I study it before I bet on it.' },
    hold: { name: 'Hold', help: 'Use with caution', description: 'I would not start something new with it.' },
  },
  movements: { none: 'No change', new: 'New', 'moved-in': 'Moved in', 'moved-out': 'Moved out' },
  stats: {
    label: 'Radar summary',
    technologies: 'Technologies',
    quadrants: 'Quadrants',
    rings: 'Rings',
    perRing: 'Entries per ring',
  },
  explorer: {
    index: '01 / Explore',
    title: 'The radar',
    lead: 'Four quadrants, four rings. Distance from the centre is my recommendation. Select a blip or a name to see why it sits where it does.',
    entries: (count) => `${count} ${count === 1 ? 'entry' : 'entries'}`,
    showing: (shown, total) => `Showing ${shown} of ${total}`,
    dimmed: ' · filtered entries are dimmed',
    clear: 'Clear filters',
    noMatch: (query, scope) => `No technologies match “${query}”${scope}.`,
    noEntries: (scope) => `No technologies${scope}.`,
    scope: (parts) => ` in ${parts}`,
    ringKeyLabel: 'Rings, from the centre outwards',
    ringKeyNote: 'Rings from the centre outwards. Numbers are in the lists below.',
  },
  controls: {
    view: 'View',
    radar: 'Radar',
    list: 'List',
    search: 'Search technologies',
    searchPlaceholder: 'Search names, reasons, projects…',
    quadrant: 'Quadrant',
    allQuadrants: 'All quadrants',
    ringFilter: 'Filter by ring',
    all: 'All',
  },
  chart: {
    label: (count) =>
      `Technology radar with ${count} entries. Use the arrow keys to move between entries and Enter to open one.`,
  },
  detail: {
    keyLabel: 'How to read the radar',
    keyKicker: 'Radar key',
    keyTitle: 'How to read the rings',
    keyLead: 'The ring is my recommendation, not my proficiency. Closer to the centre means I trust it more.',
    keyCount: (count) => `${count} ${count === 1 ? 'entry' : 'entries'}`,
    shapes: 'Shape shows movement since the last edition',
    hint: 'Select a blip, or a name in the lists, to see why it sits where it does.',
    previous: 'Previous entry',
    next: 'Next entry',
    close: 'Close and show the radar key',
    why: 'Why',
    since: 'Since',
    lastReviewed: 'Last reviewed',
    edition: 'Edition',
    usedIn: 'Used in',
    noProject: 'Not tied to one of the listed projects.',
    note: 'The ring is my recommendation, not my proficiency.',
  },
  list: {
    label: 'All entries as a table',
    caption: 'All radar entries, grouped by quadrant. Sort by number, name or ring.',
    technology: 'Technology',
    ring: 'Ring',
    since: 'Since',
    usedIn: 'Used in',
    why: 'Why',
  },
  moveKey: 'Blip shapes',
  moves: {
    index: '02 / Moves',
    title: 'Moves this edition',
    baseline: (edition) =>
      `Edition ${edition} is the baseline: every entry starts here, so nothing has moved yet. From the next edition, this section lists what is new and what moved, and why.`,
  },
  projects: {
    index: '03 / Evidence',
    title: 'Projects behind the radar',
    lead: 'Every ring comes from real work. These are the projects, and what each one put on the radar.',
    count: (count) => `${count} radar ${count === 1 ? 'entry' : 'entries'}`,
    fewer: 'Show fewer',
    all: (count) => `Show all ${count}`,
  },
  principles: {
    index: '04 / How I think',
    title: 'Principles over hype',
    items: [
      {
        title: 'Context first.',
        text: 'No technology is universally right. Requirements, team maturity and operational cost matter.',
      },
      {
        title: 'Build to learn.',
        text: 'I keep coding and experimenting because hands-on feedback sharpens architectural decisions.',
      },
      {
        title: 'Revisit decisions.',
        text: 'Good choices evolve. This radar records a point of view, not an immutable verdict.',
      },
    ],
  },
  footer: {
    motto: 'Built with curiosity. Refined through practice.',
    source: 'Source on GitHub',
    meta: (edition) => `Edition ${edition} · © 2026 Flaviano Cardone`,
  },
};

export const it: Strings = {
  meta: {
    title: 'Flaviano Cardone — Technology Radar',
    description:
      'Come scelgo la tecnologia: il technology radar personale di Flaviano Cardone, Senior Cloud & AI Solution Architect. La tecnologia è una scelta, non una checklist.',
  },
  skipLink: 'Vai al radar',
  header: {
    tagline: 'Diario di ingegneria',
    nav: 'Principale',
    radar: 'Radar',
    moves: 'Novità',
    projects: 'Progetti',
    principles: 'Principi',
    language: 'Lingua',
  },
  hero: {
    edition: (edition) => `Edizione ${edition}`,
    eyebrow: 'Technology radar personale',
    title: 'La tecnologia è una scelta.',
    titleEm: 'Non una checklist.',
    intro:
      'Il mio punto di vista, in continua evoluzione, su strumenti, piattaforme e idee che guidano il modo in cui costruisco software. Nato da esperienza, curiosità e compromessi ingegneristici.',
    role: 'Senior Cloud & AI Solution Architect e Technical Lead',
    place: 'Ingegnere iscritto all’Ordine di Napoli, n. 17141',
    explore: 'Esplora il radar',
    source: 'Vedi il sorgente',
  },
  quadrants: {
    techniques: 'Tecniche e architettura',
    platforms: 'Piattaforme e infrastruttura',
    languages: 'Linguaggi e framework',
    'data-ai': 'Dati e AI',
  },
  rings: {
    adopt: { name: 'Adotta', help: 'Scelta sicura', description: 'La mia scelta di default. La uso in produzione e la consiglio.' },
    trial: { name: 'Sperimenta', help: 'Da provare sul campo', description: 'Usata su progetti reali. Deve ancora confermarsi.' },
    assess: { name: 'Valuta', help: 'Da approfondire', description: 'Promettente. La studio prima di puntarci.' },
    hold: { name: 'Sospendi', help: 'Da usare con cautela', description: 'Non ci inizierei un nuovo progetto.' },
  },
  movements: { none: 'Invariata', new: 'Nuova', 'moved-in': 'Avanzata', 'moved-out': 'Arretrata' },
  stats: {
    label: 'Riepilogo del radar',
    technologies: 'Tecnologie',
    quadrants: 'Quadranti',
    rings: 'Anelli',
    perRing: 'Voci per anello',
  },
  explorer: {
    index: '01 / Esplora',
    title: 'Il radar',
    lead: 'Quattro quadranti, quattro anelli. La distanza dal centro è il mio consiglio. Seleziona un punto o un nome per vedere perché si trova lì.',
    entries: (count) => `${count} ${count === 1 ? 'voce' : 'voci'}`,
    showing: (shown, total) => `${shown} di ${total} visibili`,
    dimmed: ' · le voci escluse dai filtri sono attenuate',
    clear: 'Azzera i filtri',
    noMatch: (query, scope) => `Nessuna tecnologia corrisponde a “${query}”${scope}.`,
    noEntries: (scope) => `Nessuna tecnologia${scope}.`,
    scope: (parts) => ` in ${parts}`,
    ringKeyLabel: 'Anelli, dal centro verso l’esterno',
    ringKeyNote: 'Anelli dal centro verso l’esterno. I numeri sono negli elenchi qui sotto.',
  },
  controls: {
    view: 'Vista',
    radar: 'Radar',
    list: 'Elenco',
    search: 'Cerca tecnologie',
    searchPlaceholder: 'Cerca nomi, motivazioni, progetti…',
    quadrant: 'Quadrante',
    allQuadrants: 'Tutti i quadranti',
    ringFilter: 'Filtra per anello',
    all: 'Tutti',
  },
  chart: {
    label: (count) =>
      `Technology radar con ${count} voci. Usa le frecce per spostarti tra le voci e Invio per aprirne una.`,
  },
  detail: {
    keyLabel: 'Come leggere il radar',
    keyKicker: 'Legenda',
    keyTitle: 'Come leggere gli anelli',
    keyLead: 'L’anello è il mio consiglio, non il mio livello di competenza. Più è vicino al centro, più me ne fido.',
    keyCount: (count) => `${count} ${count === 1 ? 'voce' : 'voci'}`,
    shapes: 'La forma indica lo spostamento rispetto all’edizione precedente',
    hint: 'Seleziona un punto, o un nome negli elenchi, per vedere perché si trova lì.',
    previous: 'Voce precedente',
    next: 'Voce successiva',
    close: 'Chiudi e mostra la legenda',
    why: 'Perché',
    since: 'Dal',
    lastReviewed: 'Ultima revisione',
    edition: 'Edizione',
    usedIn: 'Usata in',
    noProject: 'Non legata a uno dei progetti elencati.',
    note: 'L’anello è il mio consiglio, non il mio livello di competenza.',
  },
  list: {
    label: 'Tutte le voci in tabella',
    caption: 'Tutte le voci del radar, raggruppate per quadrante. Ordina per numero, nome o anello.',
    technology: 'Tecnologia',
    ring: 'Anello',
    since: 'Dal',
    usedIn: 'Usata in',
    why: 'Perché',
  },
  moveKey: 'Forme dei punti',
  moves: {
    index: '02 / Novità',
    title: 'Novità di questa edizione',
    baseline: (edition) =>
      `L’edizione ${edition} è il punto di partenza: tutte le voci iniziano da qui, quindi nulla si è ancora spostato. Dalla prossima edizione questa sezione elencherà cosa è nuovo, cosa si è spostato e perché.`,
  },
  projects: {
    index: '03 / Esperienza',
    title: 'I progetti dietro il radar',
    lead: 'Ogni anello nasce da lavoro reale. Questi sono i progetti, e cosa ciascuno ha portato sul radar.',
    count: (count) => `${count} ${count === 1 ? 'voce' : 'voci'} del radar`,
    fewer: 'Mostra meno',
    all: (count) => `Mostra tutte (${count})`,
  },
  principles: {
    index: '04 / Come ragiono',
    title: 'Principi prima delle mode',
    items: [
      {
        title: 'Prima il contesto.',
        text: 'Nessuna tecnologia è giusta in assoluto. Contano i requisiti, la maturità del team e i costi operativi.',
      },
      {
        title: 'Costruire per imparare.',
        text: 'Continuo a programmare e a sperimentare, perché il riscontro sul campo affina le decisioni architetturali.',
      },
      {
        title: 'Rivedere le decisioni.',
        text: 'Le buone scelte evolvono. Questo radar fissa un punto di vista, non un verdetto immutabile.',
      },
    ],
  },
  footer: {
    motto: 'Nato dalla curiosità. Affinato con la pratica.',
    source: 'Sorgente su GitHub',
    meta: (edition) => `Edizione ${edition} · © 2026 Flaviano Cardone`,
  },
};
