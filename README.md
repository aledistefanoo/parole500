# PAROLA500

Un gioco di parole quotidiano in italiano, ispirato alla meccanica di Word500 ma con nome, codice e contenuti originali.

## Come si gioca

Indovina una parola italiana di cinque lettere in otto tentativi. Dopo ogni parola il gioco mostra soltanto tre conteggi: lettere al posto giusto, presenti al posto sbagliato e assenti. Non rivela quali lettere hanno prodotto i conteggi: puoi dedurlo e colorare manualmente le tessere cliccandole. `500` è la soluzione perfetta.

Il pulsante **Spazio** permette di costruire uno schema con posizioni ancora ignote.

## Sviluppo locale

```bash
npm install
npm run dev
```

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub e carica questa cartella.
2. In **Settings → Pages**, seleziona **GitHub Actions** come sorgente.
3. Il workflow incluso pubblicherà automaticamente ogni push sul branch `main`.

## Note

- Il gioco del giorno è deterministico e uguale per tutti.
- Progressi e statistiche restano nel browser tramite `localStorage`.
- Non usa servizi esterni, account o pubblicità.
- Il dizionario di gioco comprende 9.246 parole italiane di cinque lettere, derivate dalle liste open source MIT di [napolux/paroleitaliane](https://github.com/napolux/paroleitaliane).
