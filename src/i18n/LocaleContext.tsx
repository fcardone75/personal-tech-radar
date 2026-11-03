import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { initialLang, localize, saveLang, type Lang, type Locale } from './locale';

interface LocaleValue extends Locale {
  setLang: (lang: Lang) => void;
}

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const value = useMemo<LocaleValue>(
    () => ({
      ...localize(lang),
      setLang: (next) => {
        saveLang(next);
        setLangState(next);
      },
    }),
    [lang],
  );

  // Keep the document in step: screen readers, hyphenation, tab title, search snippet.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = value.t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', value.t.meta.description);
  }, [lang, value]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used inside <LocaleProvider>');
  return value;
}
