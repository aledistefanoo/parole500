# PAROLA500

Un gioco di parole quotidiano in italiano, ispirato alla meccanica di Word500 ma con nome, codice e contenuti originali.

## Come si gioca

Indovina una parola italiana di cinque lettere in otto tentativi. Le cinque tessere mostrano la posizione delle lettere; le tre tessere finali riassumono quante sono verdi, gialle e rosse. `500` è la soluzione perfetta.

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
