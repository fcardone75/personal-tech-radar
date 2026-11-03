# Personal Technology Radar

[English](README.md) · **Italiano**

**Guardalo online: [fcardone75.github.io/personal-tech-radar](https://fcardone75.github.io/personal-tech-radar/)**

Il mio technology radar personale: le tecniche, le piattaforme, i linguaggi e gli strumenti per dati e AI che uso o ho valutato, dove colloco ciascuno e perché. È un registro di scelte ingegneristiche, non un elenco di competenze.

La tecnologia è una scelta. Non una checklist.

Il sito è disponibile in italiano e in inglese: si cambia lingua con le bandiere nell'header.

## Cos'è

Il radar si ispira al [Technology Radar di Thoughtworks](https://www.thoughtworks.com/radar), applicato a un singolo ingegnere invece che a un'azienda. Ogni voce nasce da lavoro reale ed è collegata ai progetti in cui l'ho usata.

La pagina ha quattro parti:

1. **Il radar.** Ogni tecnologia è un punto numerato. Selezionandolo si vede perché si trova lì, da quando la uso e in quali progetti. Si può filtrare per quadrante o anello, cercare, o passare a un elenco ordinabile.
2. **Novità.** Cosa è nuovo e cosa ha cambiato anello rispetto all'edizione precedente.
3. **Progetti.** I progetti dietro il radar, e cosa ciascuno ha portato sul radar.
4. **Principi.** Come faccio queste scelte.

Ogni voce ha un suo link, quindi si può condividere una singola tecnologia: [`…/#gitops`](https://fcardone75.github.io/personal-tech-radar/#gitops).

## Come leggerlo

I **quadranti** raggruppano le voci per tipo:

| Quadrante                    | Contenuto                                         |
| ---------------------------- | ------------------------------------------------- |
| Tecniche e architettura      | Pratiche e pattern architetturali                 |
| Piattaforme e infrastruttura | Runtime, servizi cloud, infrastruttura            |
| Linguaggi e framework        | Linguaggi di programmazione, librerie, framework  |
| Dati e AI                    | Database, strumenti per i dati, modelli e tool AI |

Gli **anelli** sono il mio consiglio, non il mio livello di competenza. Più una voce è vicina al centro, più me ne fido:

| Anello     | Significato                                                     |
| ---------- | --------------------------------------------------------------- |
| Adotta     | La mia scelta di default. La uso in produzione e la consiglio.  |
| Sperimenta | Usata su progetti reali. Deve ancora confermarsi.               |
| Valuta     | Promettente. La studio prima di puntarci.                       |
| Sospendi   | Non ci inizierei un nuovo progetto.                             |

Nei dati e nel codice gli anelli hanno i nomi inglesi: `adopt`, `trial`, `assess`, `hold`.

Le **forme** indicano lo spostamento rispetto all'edizione precedente: un cerchio significa invariata, un cerchio con un alone significa nuova, un triangolo verso l'alto significa avanzata verso il centro, un triangolo verso il basso significa arretrata.

## Come funziona

È una single-page app statica, costruita con React, TypeScript e Vite e pubblicata su GitHub Pages. Non c'è un backend: tutti i contenuti sono file JSON nel repository.

- **Dati.** Voci e progetti sono semplici JSON in `src/data/`. In fase di build gira un controllo dello schema: dati non validi bloccano la build e non arrivano mai sul sito.
- **Layout.** Posizioni dei punti, numeri, conteggi e legende sono calcolati dai dati. Il posizionamento è deterministico: ogni punto parte da una posizione derivata dal suo id, poi i punti vicini vengono distanziati. Gli stessi dati producono sempre lo stesso radar.
- **Lingue.** I testi dell'interfaccia sono in `src/i18n/strings.ts`, tipizzati in modo che una traduzione mancante faccia fallire il type check. I testi dei dati (motivazioni e descrizioni dei progetti) sono in inglese nei JSON principali, con la versione italiana in `src/data/radar.it.json`. Il sito si apre nell'ultima lingua scelta dal visitatore, altrimenti nella lingua del suo browser.
- **Rilascio.** Ogni push su `main` esegue lint, type check, unit test, build di produzione e test end-to-end Playwright su desktop e mobile. Il sito viene pubblicato su GitHub Pages solo se passano tutti.
- **Privacy.** I font sono self-hosted, quindi la pagina non fa richieste a terze parti. Non c'è alcun tracciamento.

## Modificare il radar

Tutti i contenuti sono in questi file. La build fallisce se non rispettano lo schema.

- `src/data/radar.json`: le voci e l'edizione.
- `src/data/projects.json`: i progetti a cui le voci rimandano con `usedIn`.
- `src/data/radar.it.json`: il `why` in italiano di ogni voce e la descrizione in italiano di ogni progetto. Ogni voce e ogni progetto devono averli.

Ogni voce:

| Campo          | Valori                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| `id`           | kebab-case, univoco. Usato nei link condivisibili: `…/#gitops`          |
| `name`         | nome visualizzato (non tradotto)                                        |
| `quadrant`     | `techniques`, `platforms`, `languages`, `data-ai`                       |
| `ring`         | `adopt`, `trial`, `assess`, `hold`: il mio consiglio, non la competenza |
| `movement`     | `none`, `new`, `moved-in`, `moved-out` (rispetto all'ultima edizione)   |
| `why`          | una frase breve, sotto i 140 caratteri                                  |
| `since`        | primo anno di utilizzo, oppure `null`                                   |
| `usedIn`       | id dei progetti in `projects.json` (può essere vuoto)                   |
| `lastReviewed` | `YYYY-MM`                                                               |
| `edition`      | `YYYY.MM`                                                               |

Le voci in `pending` non vengono mai pubblicate (Angular resta lì finché non ha un anello).

### Aggiungere una voce

1. Aggiungila a `entries` in `radar.json`.
2. Aggiungi il suo `why` in italiano, con lo stesso `id`, in `radar.it.json`.
3. Esegui `npm run check`.

### Nuova edizione

1. Cambia `edition` in `radar.json`.
2. Per ogni voce che ha cambiato anello imposta `movement` a `moved-in` o `moved-out`; per le voci nuove usa `new`; riporta le altre a `none`.
3. Aggiorna `lastReviewed` ed `edition` sulle voci che hai rivisto.

## Sviluppo

Richiede Node.js 24.

```bash
npm install
npm run dev          # server locale
npm run check        # lint + typecheck + unit test + build di produzione
npm run test:e2e     # smoke test Playwright (prima esegui `npm run build`)
```

La CI esegue gli stessi controlli su ogni pull request. Un push su `main` pubblica su GitHub Pages solo se passano tutti.

## Design token

Colori, tipografia e spaziature sono custom property CSS all'inizio di `src/style.css`.
Colori degli anelli: Adotta `#45e3b0`, Sperimenta `#79a9ff`, Valuta `#ffc579`, Sospendi `#f38ea2`.
I font (Space Grotesk, DM Sans) sono self-hosted tramite `@fontsource`.

## Autore

Flaviano Cardone, Senior Cloud & AI Solution Architect e Technical Lead.
