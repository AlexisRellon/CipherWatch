# CipherWatch

> **Fraud Detection CLI SaaS for Bank Transactions**

![CipherWatch Logo](/resources/icon/Logo-white.png)

---

## Overview

CipherWatch is a real-time fraud detection SaaS application designed for bank transaction analysis. It features a CLI-inspired web interface, robust backend powered by machine learning, and instant feedback for transaction legitimacy. Built for reliability, speed, and security, CipherWatch helps financial professionals quickly identify and review suspicious activity.

---

## Features

- **Terminal-style Web UI**: ASCII art, JetBrains Mono font, and CRT effects for an authentic CLI experience.
- **Dynamic Boot Sequence**: Simulates system initialization and backend health checks.
- **Real-time Fraud Prediction**: ML-powered backend (Flask, scikit-learn) with confidence scores and model metrics.
- **Transaction Analysis**: Input, analyze, and log transactions with instant feedback.
- **Analysis Logs**: View and manage transaction history, stored locally for privacy.
- **Exit Modal**: Secure exit with confirmation and blur effect.
- **Mobile-friendly**: Responsive design for desktop and mobile.

---

## Quick Start

> [!TIP]
> For local development, ensure Python 3.8+ and Node.js are installed.

### Backend Setup

```bash
# Create and activate Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask backend
python Backend/app.py
```

### Frontend Setup

- Open `index.html` in your browser (or use Live Server for auto-reload).

---

## Project Structure

```text
├── index.html                # Main web interface
├── style.css                 # Custom styles (overrides Tailwind)
├── script.js                 # Frontend logic
├── Backend/
│   ├── app.py               # Flask backend server
│   └── model/
│       ├── Fraud_Detection.ipynb  # Model training notebook
│       └── random_forest_model.joblib # ML model
├── resources/
│   ├── img/                  # Logos and images
│   └── docs/                 # Documentation
├── components/               # UI components
├── requirements.txt          # Python dependencies
```

---

## How It Works

1. **Boot Sequence**: On load, the UI simulates a terminal boot and checks backend health.
2. **Model Info**: ML model details and metrics are fetched and displayed.
3. **Transaction Analysis**: Enter transaction details, submit for analysis, and receive instant fraud prediction.
4. **Logs**: All analyses are logged locally for review.
5. **Exit**: Secure exit with confirmation modal.

---

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Tailwind CSS (CDN)
- **Backend**: Python 3.8+, Flask, Flask-CORS, scikit-learn, joblib
- **ML Model**: Random Forest, trained on 6M+ transactions

---

## Security & Privacy

> [!IMPORTANT]
> No sensitive transaction data is stored on the server. All logs are kept in your browser's localStorage.

- Input validation and error handling throughout
- CORS enabled for local development
- No external dependencies in frontend

---

## Customization

- ASCII art and UI can be modified in `index.html` and `style.css`
- Model retraining: Update `Fraud_Detection.ipynb` and export new `.joblib` model
- Extend backend endpoints in `Backend/main.py`

---

## Documentation

- See `resources/docs/` and `Backend/model/Fraud_Detection.ipynb` for model details and evaluation.
- For API details, review `Backend/main.py`.

---

## Support

For issues or questions, please open a GitHub issue or contact the project maintainer.

---

> [!NOTE]
> This project is for educational and demonstration purposes. Not for production use without further security review.
