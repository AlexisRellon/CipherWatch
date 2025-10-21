# Copilot instructions for CipherWatch

Purpose: help AI coding agents be productive immediately in this repository by surfacing the project's structure, conventions, developer workflows, and integration points.

- Project shape (big picture)
  - Frontend: static site at repository root. Key files: `index.html`, `style.css`, and the `components/` folder that contains vanilla JS UI pieces and wiring. All frontend code is plain ES6+ JavaScript—do not introduce frameworks (React/Vue/etc.).
  - Backend: `Backend/` contains a minimal Python Flask service. The primary server file is `Backend/main.py` (currently empty/placeholder). Model artifacts and notebooks live in `Backend/model/` (e.g. `Fraud_Detection.ipynb`, `random_forest_model.joblib`). Treat the notebook as source-of-truth for model training and the `.joblib` file as the deployable artifact.
  - Static assets: `resources/` (icons in `resources/icon/`, images in `resources/img/`, docs in `resources/docs/`). Keep asset paths stable so frontend references remain valid.

- Expected data flow
  - UI (browser) → HTTP request → Backend Flask app → loads model from `Backend/model/*.joblib` (or calls code derived from `Fraud_Detection.ipynb`) → returns JSON prediction. No message queue or external services are present in the repo.

- Project-specific conventions (from `AGENTS.md`)
  - Vanilla JavaScript only; no external JS dependencies in the frontend.
  - Code style: semicolons, single quotes, 2-space indentation, camelCase for variables and functions.
  - Backend uses Python + Flask to serve static files and model inference.

- Where to make changes
  - UI changes: edit `index.html`, `style.css`, and files under `components/`.
  - Backend API / inference: edit `Backend/main.py`. Keep model files in `Backend/model/`; if you need to change the trained model, update the notebook `Backend/model/Fraud_Detection.ipynb` and regenerate the `.joblib` artifact.

- Developer workflows (commands)
  - Create a Python venv (PowerShell):

    ```powershell
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    ```

  - Install dependencies: this repo does not include a `requirements.txt` currently. Preferred first step is to check for one; if absent, install minimal server/model runtime packages:

    ```powershell
    pip install flask joblib scikit-learn pandas numpy
    ```

  - Run the Flask app (common pattern to add to `Backend/main.py`):

    ```powershell
    # from the repo root
    python Backend/main.py
    ```

  - Open the static UI directly: open `index.html` in a browser for layout/CSS work. For features depending on server-side model inference, run the Flask backend.

- Patterns and small examples (follow these when implementing or editing code)
  - Keep model-loading centralized in the backend module (e.g. load `random_forest_model.joblib` once on startup and reuse) to avoid reloading per-request.
  - Place routes in `Backend/main.py`; keep request/response payloads JSON and minimal. Prefer POST for prediction endpoints with a small JSON body (feature vector).
  - Frontend JS should call backend endpoints using fetch and expect JSON responses. Example (conceptual):

    ```js
    // components/predict.js (conceptual example)
    async function predict(features) {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });
      return res.json();
    }
    ```

  - Model files: do not modify `random_forest_model.joblib` binary directly in code reviews—replace by creating a new artifact and updating references.

- Tests and CI
  - There are no tests or CI configs in the repo. If adding unit tests, put them in a top-level `tests/` folder and run with `pytest` (not required by current conventions).

- Safety and guardrails for AI edits
  - Do not introduce external frontend frameworks or new heavy JS dependencies without explicit approval.
  - When editing `Backend/model/*`, preserve original artifact files; add new artifact versions with explicit names (e.g. `random_forest_model_v2.joblib`) and update `Backend/main.py` references.
  - Avoid changing image or icon filenames referenced by `index.html` or `style.css`—if you must rename, update all references.

- Useful files to inspect first
  - `index.html`, `style.css`, `components/` (frontend behaviour)
  - `Backend/main.py` (server entry point)
  - `Backend/model/Fraud_Detection.ipynb` (model training reference)
  - `Backend/model/random_forest_model.joblib` (deployed model artifact)
  - `AGENTS.md` (existing agent guidance and style rules)

- If something is ambiguous, ask the maintainer
  - Confirm expected server endpoints and payload shapes before implementing new backend APIs.
  - Ask whether new Python dependencies are permitted and whether a `requirements.txt` should be added.

If any section above is unclear or you need more examples (Flask endpoint, model-load snippet, or a minimal frontend integration), say which part to expand and I will iterate.
