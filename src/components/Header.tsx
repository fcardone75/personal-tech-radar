import { REPO_URL } from '../data';
import { ArrowUpRight } from './icons';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            FC<span>·</span>
          </span>
          <span className="brand-text">
            <strong>Flaviano Cardone</strong>
            <small>Engineering journal</small>
          </span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#radar">Radar</a>
          <a className="nav-secondary" href="#moves">
            Moves
          </a>
          <a href="#projects">Projects</a>
          <a className="nav-secondary" href="#principles">
            Principles
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight width={14} height={14} />
          </a>
        </nav>
      </div>
    </header>
  );
}
