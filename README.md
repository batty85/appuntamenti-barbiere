# ✂️ Appuntamenti Barbiere - Guida alla Pubblicazione

Questa guida ti aiuterà a pubblicare la tua web app su **GitHub Pages** in pochi minuti.

## 🚀 Istruzioni Passo dopo Passo

1. **Crea un nuovo Repository su GitHub**:
   - Vai su [github.com/new](https://github.com/new).
   - Nome repository: `appuntamenti-barbiere`.
   - Impostalo come **Public**.

2. **Carica i File**:
   - Carica tutti i file di questa cartella nel repository (inclusa la cartella `.github`).

3. **Configura l'API Key (Sicurezza)**:
   - Nel tuo repository su GitHub, vai in **Settings** (Impostazioni) -> **Secrets and variables** -> **Actions**.
   - Clicca su **New repository secret**.
   - Nome: `API_KEY`.
   - Valore: Incolla la tua chiave API di Gemini.

4. **Abilita GitHub Pages**:
   - Vai in **Settings** -> **Pages**.
   - Sotto "Build and deployment" -> "Source", seleziona **GitHub Actions**.

5. **Avvia il Deploy**:
   - Vai nella scheda **Actions** in alto. Vedrai un workflow chiamato "Deploy to GitHub Pages".
   - Una volta completato (diventa verde), il link della tua app sarà: `https://tuo-nome-utente.github.io/appuntamenti-barbiere/`.

## 📱 Utilizzo su Smartphone
Una volta pubblicato il link:
1. Aprilo con Safari (iPhone) o Chrome (Android).
2. Seleziona **Condividi** o il menu dei tre puntini.
3. Clicca su **Aggiungi alla schermata Home**.
4. L'app apparirà sul tuo telefono con l'icona del barbiere!

---
*Nota: Questa app salva i dati localmente sul browser. Se cambi browser o cancelli la cronologia, i dati potrebbero andare persi.*