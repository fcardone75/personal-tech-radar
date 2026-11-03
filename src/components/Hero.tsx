import { REPO_URL } from '../data';
import { useLocale } from '../i18n/LocaleContext';
import { ArrowDown, ArrowUpRight } from './icons';

export default function Hero({ edition }: { edition: string }) {
  const { t } = useLocale();
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <p className="eyebrow">
          <span className="edition-tag">{t.hero.edition(edition)}</span>
          {t.hero.eyebrow}
        </p>
        <h1 id="hero-title" className="hero-title">
          <span>{t.hero.title}</span>
          <em>{t.hero.titleEm}</em>
        </h1>
        <p className="hero-intro">{t.hero.intro}</p>
        <p className="hero-byline">
          <strong>Flaviano Cardone</strong>
          <span>{t.hero.role}</span>
          <span>{t.hero.place}</span>
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#radar">
            {t.hero.explore}
            <ArrowDown />
          </a>
          <a className="btn btn-ghost" href={REPO_URL} target="_blank" rel="noreferrer">
            {t.hero.source}
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
