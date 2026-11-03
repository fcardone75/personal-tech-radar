import { useCallback, useEffect, useMemo, useState } from 'react';
import type { View } from './components/Controls';
import Explorer from './components/Explorer';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Moves from './components/Moves';
import Principles from './components/Principles';
import Projects from './components/Projects';
import Stats from './components/Stats';
import { radar } from './data';
import { useLocale } from './i18n/LocaleContext';
import { COMPACT_QUERY, prefersReducedMotion, useMediaQuery } from './hooks/useMediaQuery';
import { NO_FILTERS, matchesFilters, type Filters } from './radar/filters';
import { layoutRadar } from './radar/layout';

// Positions depend only on the data, so they are computed once.
const BLIPS = layoutRadar(radar.entries);
const IDS = new Set(BLIPS.map((b) => b.entry.id));

function idFromHash(): string | null {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return IDS.has(id) ? id : null;
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(idFromHash);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [view, setView] = useState<View>('radar');
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const compact = useMediaQuery(COMPACT_QUERY);
  const locale = useLocale();

  // The selected entry lives in the URL (#gitops), so it can be shared.
  useEffect(() => {
    const onHashChange = () => {
      const id = idFromHash();
      if (id) setSelectedId(id);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // A shared link opens with the radar in view.
  useEffect(() => {
    if (idFromHash()) document.getElementById('radar')?.scrollIntoView();
  }, []);

  const select = useCallback((id: string | null) => {
    setSelectedId(id);
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', id ? `#${id}` : `${pathname}${search}`);
  }, []);

  // From the Moves and Projects sections: select, then bring the radar into view.
  const reveal = useCallback(
    (id: string) => {
      select(id);
      if (!window.matchMedia(COMPACT_QUERY).matches) {
        document.getElementById('radar')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    },
    [select],
  );

  const matches = useMemo(
    () => new Set(BLIPS.filter((b) => matchesFilters(b.entry, filters, locale)).map((b) => b.entry.id)),
    [filters, locale],
  );

  return (
    <>
      <a className="skip-link" href="#radar">
        {locale.t.skipLink}
      </a>
      <Header />
      <main id="main">
        <Hero edition={radar.edition} />
        <Stats blips={BLIPS} />
        <Explorer
          blips={BLIPS}
          matches={matches}
          filters={filters}
          onFilters={setFilters}
          view={view}
          onView={setView}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={select}
          onHover={setHoveredId}
          compact={compact}
        />
        <Moves blips={BLIPS} edition={radar.edition} onSelect={reveal} />
        <Projects blips={BLIPS} onSelect={reveal} />
        <Principles />
      </main>
      <Footer edition={radar.edition} />
    </>
  );
}
