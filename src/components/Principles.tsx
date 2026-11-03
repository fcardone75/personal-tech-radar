import { useLocale } from '../i18n/LocaleContext';

export default function Principles() {
  const { t } = useLocale();
  return (
    <section id="principles" className="section principles" aria-labelledby="principles-title">
      <div className="container">
        <header className="section-head">
          <p className="section-index">{t.principles.index}</p>
          <h2 id="principles-title">
            {t.principles.title}<span className="accent">.</span>
          </h2>
        </header>
        <ol className="principles-grid">
          {t.principles.items.map((principle, index) => (
            <li key={index} className="principle">
              <span className="principle-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
