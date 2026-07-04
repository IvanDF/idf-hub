# iDF Hub — Terminal Commands

> Apri il terminale con `Cmd+K` (Mac) o `Ctrl+K` (PC).  
> Usa `Tab` per autocompletare comandi, ID progetto e categorie.  
> Clicca i pulsanti `[→]` nell'output per eseguire comandi senza digitarli.

---

## Sito (`/`, `/lab`, e tutte le pagine pubbliche)

### Navigazione

| Comando | Alias | Descrizione |
|---|---|---|
| `home` | `back` | Torna alla homepage |
| `lab` | `work`, `projects`, `progetti` | Vai al Lab (lista progetti) |
| `time` | `flux` | Vai al Time Machine |
| `admin` | — | Vai all'admin panel (mostra credenziali demo se non loggato) |

### Progetti

| Comando | Alias | Descrizione |
|---|---|---|
| `search [termine]` | `find`, `cerca`, `ricerca` | Cerca progetti per nome, tag o categoria |
| `open [id]` | `apri [id]` | Apri la pagina dettaglio di un progetto |

> **Tip autocomplete:** digita `open ` + inizio dell'ID (es. `open gr`) → premi `Tab`  
> **Tip autocomplete:** digita `search dev` → premi `Tab` per completare la categoria

### Tema & Sistema

| Comando | Alias | Descrizione |
|---|---|---|
| `theme` | `yoda`, `dark side`, `light side` | Toggle dark / light mode |
| `shortcuts` | `keys` | Mostra le scorciatoie da tastiera |
| `whoami` | — | Mostra lo stato di autenticazione |
| `logout` | — | Sign out da Supabase |
| `echo [testo]` | — | Stampa il testo nel terminale |
| `clear` | — | Svuota la cronologia del terminale |
| `exit` | `close` | Chiudi il terminale |

### Tour & Easter Eggs

| Comando | Alias | Descrizione |
|---|---|---|
| `guide` | `tour`, `start` | Tour interattivo della piattaforma |
| `snake` | `play` | Avvia Snake ASCII nel terminale |
| `eggs` | `achievements`, `badges`, `easter` | Lista easter egg trovati |
| `help` | `-h`, `?` | Help con sezioni e CTA cliccabili |

### Chip rapidi (site)

```
lab  ·  search  ·  guide  ·  theme  ·  whoami  ·  help
```

---

## Admin Terminal (`/admin`)

Accessibile solo dopo login. Stesso shortcut `Cmd+K`.

### Gestione Progetti

| Comando | Descrizione |
|---|---|
| `list` | Carica e mostra tutti i progetti dal DB |
| `add` | Apre il form per creare un nuovo progetto |
| `status` | Mostra statistiche DB (totale / live / in-progress / archived) |

### Navigazione & Auth

| Comando | Descrizione |
|---|---|
| `site` | Torna alla homepage (`/`) |
| `logout` | Sign out Supabase |
| `whoami` | Mostra l'email dell'utente loggato |

### Sistema

| Comando | Descrizione |
|---|---|
| `theme` | Toggle dark / light mode |
| `ping` | Verifica connessione DB (`pong. DB is alive.`) |
| `clear` | Svuota la cronologia del terminale |
| `help` | Help contestuale admin |

### Chip rapidi (admin)

```
list  ·  add  ·  status  ·  theme  ·  logout  ·  site
```

---

## Deep Links

You can share a direct link to any terminal command using the `?cmd=` URL parameter.
When someone opens the link, the terminal auto-opens and executes the command.

### Syntax

```
https://idf-hub.vercel.app/?cmd=[command]
```

### Examples

| Link | Action |
|---|---|
| `?cmd=snake` | Launch the snake game directly |
| `?cmd=theme` | Toggle dark / light mode |
| `?cmd=search%20shader` | Search for "shader" projects |
| `?cmd=open%20gabberg-icard` | Open a specific project |
| `?cmd=guide` | Start the interactive tour |
| `?cmd=help` | Open help in the terminal |

### Share Buttons

Each quick-command chip in the terminal toolbar has a **share icon** (↗).
Click it to copy the deep link for that command to your clipboard.

---

## Scorciatoie globali

| Tasto | Azione |
|---|---|
| `Cmd+K` / `Ctrl+K` | Apri / chiudi terminale |
| `D` | Toggle dark/light mode |
| `1` | Vai alla Home |
| `2` | Vai al Lab |
| `ESC` | Chiudi terminale / overlay |
| `Tab` | Autocompleta il comando corrente |
| `↑` / `↓` | Naviga nella cronologia comandi |
| `?` | Apri help nel terminale |

---

## Autocomplete

Il terminale carica automaticamente i dati dal DB per suggerire:

| Input digitato | Suggerisce |
|---|---|
| `op` | `open` (comando) |
| `open gr` | ID progetto che inizia con `gr` (es. `open gravity-well`) |
| `search dev` | Categoria `dev` o ID che inizia con `dev` |
| `se` | `search` (comando) |
| `th` | `theme` (comando) |

---

---

## Snake — ASCII Game

Digita `snake` (o `play`) nel terminale per avviare il gioco.

- **WASD** o **↑↓←→** — muovi il serpente
- **Qualsiasi tasto** — avvia il gioco
- **ESC** — esci e torna al terminale
- Velocità aumenta col punteggio (+2ms ogni 10 punti)
- Il punteggio finale viene mostrato nella storia del terminale

Per esplorare l'area admin senza account reale:

- **Email:** `morty@c-137.com`
- **Password:** `wubbalubbadubdub`

> In modalità C-137 tutte le modifiche sono temporanee (solo sessione browser) e non vengono salvate nel DB.  
> Un banner "Morty-level access" avvisa dello stato. Wubba lubba dub dub!
