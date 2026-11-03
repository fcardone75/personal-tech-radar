import { REPO_URL } from '../data';
import { useLocale } from '../i18n/LocaleContext';
import { ArrowUpRight } from './icons';

export default function Footer({ edition }: { edition: string }) {
  const { t } = useLocale();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            FC<span>·</span>
          </span>
          <p>{t.footer.motto}</p>
        </div>
        <a className="footer-link" href={REPO_URL} target="_blank" rel="noreferrer">
          {t.footer.source}
          <ArrowUpRight width={14} height={14} />
        </a>
        <p className="footer-meta">{t.footer.meta(edition)}</p>
      </div>
    </footer>
  );
}
