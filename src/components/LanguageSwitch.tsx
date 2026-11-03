import { LANGS, type Lang } from '../i18n/locale';
import { useLocale } from '../i18n/LocaleContext';

// Inline SVG flags: emoji flags do not render on Windows.
function FlagIt() {
  return (
    <svg className="flag" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ce2b37" />
    </svg>
  );
}

function FlagGb() {
  return (
    <svg className="flag" viewBox="0 0 60 30" aria-hidden="true" focusable="false">
      <clipPath id="flag-gb-clip">
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#flag-gb-clip)" stroke="#c8102e" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}

const OPTIONS: Record<Lang, { flag: typeof FlagIt; code: string; name: string }> = {
  it: { flag: FlagIt, code: 'IT', name: 'Italiano' },
  en: { flag: FlagGb, code: 'EN', name: 'English' },
};

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLocale();

  return (
    <div className="lang-switch" role="group" aria-label={t.header.language}>
      {LANGS.map((code) => {
        const { flag: Flag, code: label, name } = OPTIONS[code];
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={lang === code}
            aria-label={name}
            title={name}
            onClick={() => setLang(code)}
          >
            <Flag />
            <span aria-hidden="true">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
