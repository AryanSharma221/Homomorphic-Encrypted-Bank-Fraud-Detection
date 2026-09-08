# 🔐 Privacy-Preserving Bank Fraud Detection

A state-of-the-art backend architecture demonstrating how **Homomorphic Encryption (HE)** and **Knowledge Distillation (KD)** can be combined to securely analyze bank transactions without exposing plaintext data.

## 🌟 Architecture Overview

This project implements a three-pillar research approach:
1. **🔐 Homomorphic Encryption (HE):** Using a CKKS simulation, inference is performed entirely on ciphertext using only addition and multiplication operations. The ML server never sees the plaintext data.
2. **🧠 Knowledge Distillation:** A massive Teacher model (ReLU, BatchNorm, Dropout) is trained offline. Its knowledge is distilled into a tiny Student model (10x smaller) to make HE inference computationally viable.
3. **〰️ Polynomial Activations:** Traditional activations like ReLU cannot be executed in HE. The student model uses learnable polynomial activations (e.g., $P(x) = a_0 + a_1x + a_2x^2$) optimized during distillation.

## 📁 Project Structure

```
.
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Endpoints (/analyze, /alerts)
│   │   ├── database/         # SQLite DB Models & Session
│   │   ├── he/               # CKKS Encryption Simulation & Encrypted Inference
│   │   └── preprocessing/    # Dynamic Feature Scaling & Risk Engineering
│   ├── main.py               # Server Entrypoint
│   └── requirements.txt      # Backend Dependencies
├── ml/                       # Offline Machine Learning Pipeline
│   ├── distillation.py       # Distills Teacher into 5 Polynomial Student Variants
│   ├── evaluate.py           # Unified Model Comparison
│   ├── export_model.py       # Exports Student Weights for Backend HE Layer
│   ├── polynomial_activation.py # Custom PyTorch Learnable Polynomials
│   └── train_teacher.py      # Trains Large Teacher Model on Imbalanced Data
└── saved_models/             # Generated Weights and Metrics
```

## 🚀 Getting Started

### 1. The ML Pipeline
1. Download the [Credit Card Fraud Detection Dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) from Kaggle and place `creditcard.csv` in the `data/` folder.
2. Train the models:
   ```bash
   cd ml
   python train_teacher.py
   python distillation.py
   python evaluate.py
   python export_model.py
   ```

### 2. The Backend Server
1. Install dependencies and start the API:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```
2. Navigate to `http://127.0.0.1:8000/docs` to test the API interactively via Swagger UI.

## 📊 Results

The `poly4` student model achieves incredible metrics despite being 10x smaller than the teacher and completely HE-compatible:
* **Accuracy:** 99.90%
* **Precision:** 67.39%
* **Recall:** 83.78%
* **F1-Score:** 0.7470

## 🛡️ API Endpoints
* `POST /api/transactions/analyze`: Submits a transaction, encrypts it, evaluates risk on ciphertext, decrypts the decision, and saves it to the DB.
* `GET /api/transactions/`: Lists all historical transactions.
* `GET /api/fraud/alerts`: Lists all flagged high-risk transactions.
