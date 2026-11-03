import { REPO_URL } from '../data';
import { ArrowUpRight } from './icons';

export default function Footer({ edition }: { edition: string }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            FC<span>·</span>
          </span>
          <p>Built with curiosity. Refined through practice.</p>
        </div>
        <a className="footer-link" href={REPO_URL} target="_blank" rel="noreferrer">
          Source on GitHub
          <ArrowUpRight width={14} height={14} />
        </a>
        <p className="footer-meta">Edition {edition} · © 2026 Flaviano Cardone</p>
      </div>
    </footer>
  );
}
