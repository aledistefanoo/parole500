import { useCallback, useEffect, useMemo, useState } from "react";

const WORDS = [
  "abete", "acero", "acqua", "aglio", "aiuto", "alibi", "amico", "amore", "ancia", "anima",
  "aroma", "asino", "astro", "avena", "avvio", "bagno", "baita", "banco", "barca", "bello",
  "bosco", "bravo", "breve", "buono", "calma", "canto", "carta", "cassa", "causa", "cervo",
  "cielo", "cifra", "clima", "colle", "corpo", "corso", "crema", "cuore", "dente", "dolce",
  "donna", "edera", "elica", "esame", "fango", "festa", "fiato", "fiore", "foglia", "forma",
  "forno", "forza", "frase", "frigo", "fumo", "gamba", "gatto", "gelato", "gioia", "gioco",
  "giuro", "gomma", "grano", "hotel", "isola", "ladro", "lampo", "latte", "legno", "lento",
  "libro", "lotta", "luce", "luna", "madre", "mango", "mare", "matto", "miele", "mondo",
  "monte", "morte", "museo", "nave", "notte", "nuovo", "opera", "ovale", "padre", "palla",
  "pane", "parco", "paura", "pesce", "piano", "piede", "porta", "posto", "prato", "primo",
  "radio", "regno", "ricco", "ruota", "sacco", "saldo", "salto", "scala", "scena", "serra",
  "sogno", "sole", "sonno", "sorte", "spesa", "stato", "stile", "suono", "tempo", "terra",
  "torre", "treno", "uomo", "vento", "verde", "vetro", "viola", "vita", "volpe", "zaino"
].filter((word) => word.length === 5);

const ANSWERS = [
  "abete", "acqua", "amico", "aroma", "astro", "barca", "bosco", "carta", "cervo", "cielo",
  "clima", "cuore", "dolce", "festa", "fiore", "foglia", "forno", "frase", "gatto", "gioia",
  "gioco", "grano", "isola", "lampo", "latte", "libro", "luna", "madre", "mango", "miele",
  "mondo", "monte", "nave", "notte", "opera", "ovale", "pane", "parco", "pesce", "piano",
  "pianta", "porta", "prato", "radio", "regno", "ruota", "salto", "scena", "sogno", "sole",
  "suono", "tempo", "terra", "torre", "treno", "vento", "verde", "vetro", "viola", "volpe"
].filter((word) => word.length === 5 && new Set(word).size === 5);

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const MAX_GUESSES = 8;
const DAY_ZERO = Date.UTC(2026, 0, 1);

function dayNumber() {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - DAY_ZERO) / 86400000);
}

function evaluate(guess, answer) {
  const result = Array(5).fill("absent");
  const remaining = {};
  for (let i = 0; i < 5; i += 1) {
    if (guess[i] === answer[i]) result[i] = "correct";
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < 5; i += 1) {
    if (result[i] === "correct") continue;
    if (remaining[guess[i]] > 0) {
      result[i] = "present";
      remaining[guess[i]] -= 1;
    }
  }
  return result;
}

function score(result) {
  const green = result.filter((x) => x === "correct").length;
  const yellow = result.filter((x) => x === "present").length;
  return `${green}${yellow}${5 - green - yellow}`;
}

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem("parola500-stats")) || null;
  } catch {
    return null;
  }
}

const EMPTY_STATS = { played: 0, wins: 0, currentStreak: 0, maxStreak: 0, distribution: Array(8).fill(0) };

function Logo() {
  return <div className="logo" aria-label="Parola500"><span>PAROLA</span><span className="logo-number">500</span></div>;
}

function Overlay({ children, onClose, labelledBy }) {
  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button className="close" onClick={onClose} aria-label="Chiudi">×</button>
        {children}
      </section>
    </div>
  );
}

export function App() {
  const [mode, setMode] = useState("daily");
  const [practiceIndex, setPracticeIndex] = useState(() => Math.floor(Math.random() * ANSWERS.length));
  const [difficulty, setDifficulty] = useState("classica");
  const [panel, setPanel] = useState(null);
  const [modal, setModal] = useState("help");
  const [current, setCurrent] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [notice, setNotice] = useState("");
  const [stats, setStats] = useState(() => loadStats() || EMPTY_STATS);
  const [completed, setCompleted] = useState(false);

  const puzzleNo = dayNumber();
  const answer = mode === "daily" ? ANSWERS[((puzzleNo % ANSWERS.length) + ANSWERS.length) % ANSWERS.length] : ANSWERS[practiceIndex];
  const won = guesses.at(-1) === answer;
  const gameOver = won || guesses.length >= MAX_GUESSES;

  useEffect(() => {
    if (mode !== "daily") {
      setGuesses([]);
      setCurrent("");
      setCompleted(false);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(`parola500-${puzzleNo}`));
      setGuesses(saved?.guesses || []);
      setCompleted(Boolean(saved?.completed));
    } catch {
      setGuesses([]);
      setCompleted(false);
    }
    setCurrent("");
  }, [mode, puzzleNo]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const finishGame = useCallback((isWin, count, nextGuesses) => {
    if (completed) return;
    setCompleted(true);
    if (mode === "daily") localStorage.setItem(`parola500-${puzzleNo}`, JSON.stringify({ guesses: nextGuesses, completed: true }));
    const updated = {
      ...stats,
      played: stats.played + 1,
      wins: stats.wins + (isWin ? 1 : 0),
      currentStreak: isWin ? stats.currentStreak + 1 : 0,
      maxStreak: isWin ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
      distribution: stats.distribution.map((value, index) => value + (isWin && index === count - 1 ? 1 : 0)),
    };
    setStats(updated);
    localStorage.setItem("parola500-stats", JSON.stringify(updated));
  }, [completed, mode, puzzleNo, stats]);

  const submit = useCallback(() => {
    if (gameOver) return setNotice(won ? "Hai già risolto il gioco di oggi" : "Partita terminata");
    if (current.length !== 5) return setNotice("Inserisci una parola di 5 lettere");
    if (!WORDS.includes(current)) return setNotice("Parola non presente nel dizionario");
    if (difficulty !== "avanzata" && new Set(current).size !== 5) return setNotice("In questo livello le lettere non possono ripetersi");
    if (difficulty === "facile" && /[jkwxy]/.test(current)) return setNotice("Il livello Facile non usa J, K, W, X o Y");
    const next = [...guesses, current];
    setGuesses(next);
    setCurrent("");
    if (mode === "daily") localStorage.setItem(`parola500-${puzzleNo}`, JSON.stringify({ guesses: next, completed: false }));
    if (current === answer || next.length === MAX_GUESSES) {
      finishGame(current === answer, next.length, next);
      window.setTimeout(() => setModal("result"), 650);
    }
  }, [answer, current, difficulty, finishGame, gameOver, guesses, mode, puzzleNo, won]);

  const input = useCallback((key) => {
    if (modal || panel || gameOver) return;
    if (key === "BACKSPACE") return setCurrent((value) => value.slice(0, -1));
    if (key === "ENTER") return submit();
    if (/^[A-Z]$/.test(key) && current.length < 5) setCurrent((value) => `${value}${key.toLowerCase()}`);
  }, [current.length, gameOver, modal, panel, submit]);

  useEffect(() => {
    const onKeyDown = (event) => input(event.key.toUpperCase());
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [input]);

  const keyStates = useMemo(() => {
    const rank = { absent: 1, present: 2, correct: 3 };
    const states = {};
    guesses.forEach((guess) => evaluate(guess, answer).forEach((state, i) => {
      const letter = guess[i].toUpperCase();
      if (!states[letter] || rank[state] > rank[states[letter]]) states[letter] = state;
    }));
    return states;
  }, [answer, guesses]);

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setPanel(null);
    if (nextMode === "practice") setPracticeIndex(Math.floor(Math.random() * ANSWERS.length));
  };

  const newPractice = () => {
    setPracticeIndex((value) => (value + 17) % ANSWERS.length);
    setGuesses([]);
    setCurrent("");
    setCompleted(false);
    setModal(null);
  };

  const revealHint = () => {
    const hidden = answer.split("").find((letter, index) => !guesses.some((guess) => guess[index] === letter));
    setNotice(hidden ? `Suggerimento: la parola contiene la lettera ${hidden.toUpperCase()}` : "Hai già tutti gli indizi necessari");
  };

  const share = async () => {
    const squares = guesses.map((guess) => evaluate(guess, answer).map((state) => ({ correct: "🟩", present: "🟨", absent: "🟥" }[state])).join("")).join("\n");
    const text = `PAROLA500 #${puzzleNo} ${won ? guesses.length : "X"}/8\n${squares}\n${window.location.href}`;
    try {
      if (navigator.share) await navigator.share({ title: "PAROLA500", text });
      else await navigator.clipboard.writeText(text);
      setNotice("Risultato copiato e pronto da condividere");
    } catch {
      setNotice("Condivisione annullata");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
        <nav className="nav-actions" aria-label="Impostazioni di gioco">
          <div className="menu-wrap">
            <button className={panel === "difficulty" ? "nav-button active" : "nav-button"} onClick={() => setPanel(panel === "difficulty" ? null : "difficulty")}>Livello</button>
            {panel === "difficulty" && (
              <div className="popover difficulty-menu">
                {[["facile", "Facile", "Niente doppie, J K W X Y"], ["classica", "Classica", "Niente lettere doppie"], ["avanzata", "Avanzata", "Tutto è permesso"]].map(([value, label, detail]) => (
                  <button key={value} className={difficulty === value ? "menu-item selected" : "menu-item"} onClick={() => { setDifficulty(value); setPanel(null); }}><span>{label}</span><small>{detail}</small></button>
                ))}
              </div>
            )}
          </div>
          <div className="menu-wrap">
            <button className={panel === "mode" ? "nav-button active" : "nav-button"} onClick={() => setPanel(panel === "mode" ? null : "mode")}>Modalità</button>
            {panel === "mode" && (
              <div className="popover mode-menu">
                <button className="menu-item" onClick={() => changeMode("daily")}><span>Gioco del giorno</span><small>Uno al giorno</small></button>
                <button className="menu-item" onClick={() => changeMode("practice")}><span>Allenamento</span><small>Senza limiti</small></button>
              </div>
            )}
          </div>
          <button className="nav-button" onClick={() => { setPanel(null); setModal("stats"); }}>Statistiche</button>
        </nav>
      </header>

      <main className="game" onClick={() => panel && setPanel(null)}>
        <div className="game-meta"><span>{mode === "daily" ? `Gioco del giorno #${puzzleNo}` : "Allenamento"}</span><span>{difficulty[0].toUpperCase() + difficulty.slice(1)}</span></div>
        <section className="board" aria-label="Griglia di gioco">
          {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
            const guess = guesses[rowIndex];
            const typed = rowIndex === guesses.length ? current : "";
            const states = guess ? evaluate(guess, answer) : [];
            const digits = guess ? score(states) : "";
            return (
              <div className="board-row" key={rowIndex}>
                {Array.from({ length: 5 }).map((__, index) => <div className={`tile ${states[index] || ""} ${guess ? "revealed" : ""}`} key={index} style={{ "--delay": `${index * 80}ms` }}>{(guess || typed)[index]?.toUpperCase() || ""}</div>)}
                {["correct", "present", "absent"].map((state, index) => <div className={`tile score ${state} ${guess ? "revealed" : "preview"}`} key={state} style={{ "--delay": `${(index + 5) * 80}ms` }}>{digits[index] || ""}</div>)}
              </div>
            );
          })}
        </section>
        <section className="keyboard" aria-label="Tastiera virtuale">
          {ROWS.map((row) => <div className="key-row" key={row}>{row.split("").map((letter) => <button className={`key ${keyStates[letter] || ""}`} key={letter} onClick={() => input(letter)}>{letter}</button>)}</div>)}
          <div className="action-row"><button className="action-key" onClick={() => input("BACKSPACE")}>Cancella</button><button className="action-key hint" onClick={revealHint}>Aiuto</button><button className="action-key enter" onClick={() => input("ENTER")}>Invia</button></div>
        </section>
      </main>

      <footer><button onClick={() => setModal("help")}>Come si gioca</button><span aria-hidden="true">·</span><button onClick={() => setModal("stats")}>Statistiche</button></footer>
      {notice && <div className="toast" role="status">{notice}</div>}

      {modal === "help" && (
        <Overlay onClose={() => setModal(null)} labelledBy="help-title">
          <p className="eyebrow">Benvenuto</p><h1 id="help-title">Come si gioca</h1>
          <p>Trova la parola italiana di cinque lettere in otto tentativi.</p>
          <div className="example-row" aria-label="Esempio di risultato">{["P", "A", "N", "E", "L"].map((letter, index) => <span key={letter + index} className={`mini-tile ${["correct", "absent", "present", "absent", "absent"][index]}`}>{letter}</span>)}<span className="mini-tile correct">1</span><span className="mini-tile present">1</span><span className="mini-tile absent">3</span></div>
          <p><strong>113</strong> significa: una lettera al posto giusto, una al posto sbagliato e tre assenti.</p>
          <button className="primary" onClick={() => setModal(null)}>Inizia a giocare</button>
        </Overlay>
      )}

      {modal === "stats" && (
        <Overlay onClose={() => setModal(null)} labelledBy="stats-title">
          <p className="eyebrow">I tuoi progressi</p><h1 id="stats-title">Statistiche</h1>
          <div className="stats-grid"><div><strong>{stats.played}</strong><span>Giocate</span></div><div><strong>{stats.played ? Math.round((stats.wins / stats.played) * 100) : 0}%</strong><span>Vinte</span></div><div><strong>{stats.currentStreak}</strong><span>Serie</span></div><div><strong>{stats.maxStreak}</strong><span>Record</span></div></div>
          <h2>Distribuzione tentativi</h2><div className="distribution">{stats.distribution.map((value, index) => <div className="bar-row" key={index}><span>{index + 1}</span><div style={{ width: `${Math.max(9, value ? (value / Math.max(...stats.distribution)) * 100 : 9)}%` }}>{value}</div></div>)}</div>
        </Overlay>
      )}

      {modal === "result" && (
        <Overlay onClose={() => setModal(null)} labelledBy="result-title">
          <p className="eyebrow">{won ? "Risultato perfetto" : "La parola era"}</p><h1 id="result-title">{won ? "Complimenti!" : answer.toUpperCase()}</h1>
          <p>{won ? `Hai trovato ${answer.toUpperCase()} in ${guesses.length} ${guesses.length === 1 ? "tentativo" : "tentativi"}.` : "Domani ti aspetta una nuova parola."}</p>
          <div className="result-actions"><button className="primary" onClick={share}>Condividi</button>{mode === "practice" && <button className="secondary" onClick={newPractice}>Nuova parola</button>}</div>
        </Overlay>
      )}
    </div>
  );
}
