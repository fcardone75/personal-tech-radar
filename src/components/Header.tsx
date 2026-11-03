import { REPO_URL } from '../data';
import { useLocale } from '../i18n/LocaleContext';
import { ArrowUpRight } from './icons';
import LanguageSwitch from './LanguageSwitch';

export default function Header() {
  const { t } = useLocale();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            FC<span>·</span>
          </span>
          <span className="brand-text">
            <strong>Flaviano Cardone</strong>
            <small>{t.header.tagline}</small>
          </span>
        </a>
        <nav className="nav" aria-label={t.header.nav}>
          <a href="#radar">{t.header.radar}</a>
          <a className="nav-secondary" href="#moves">
            {t.header.moves}
          </a>
          <a href="#projects">{t.header.projects}</a>
          <a className="nav-secondary" href="#principles">
            {t.header.principles}
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight width={14} height={14} />
          </a>
        </nav>
        <LanguageSwitch />
      </div>
    </header>
  );
}
