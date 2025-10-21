from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'random_forest_model_modified.pkl')
model = None

# Load model once at startup
def load_model():
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print(f"✓ Model loaded from {MODEL_PATH}")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        raise

load_model()



# Hardcoded model metrics (provided by user)
model_metrics = {
    'accuracy': 0.9992089212724737,
    'roc-auc': 0.9767033928048733,
    'precision': 0.6272678762006404,
    'recall': 0.9541396103896104,
    'f1-score': 0.7569220862846104
}


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        required_fields = [
            'transactionType', 'amount',
            'originOldBalance', 'originNewBalance',
            'destOldBalance', 'destNewBalance'
        ]
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        # Use notebook feature names
        # Map frontend fields to notebook feature names
        feature_map = {
            'amount': 'amount',
            'originOldBalance': 'oldbalanceOrg',
            'originNewBalance': 'newbalanceOrig',
            'destOldBalance': 'oldbalanceDest',
            'destNewBalance': 'newbalanceDest'
        }
        # All possible transaction type columns (from notebook)
        type_columns = [
            'type_CASH_IN',
            'type_CASH_OUT',
            'type_DEBIT',
            'type_PAYMENT',
            'type_TRANSFER'
        ]
        # Build one-hot encoding for transaction type
        ttype = data['transactionType']
        one_hot = {col: 0 for col in type_columns}
        # Set the correct one-hot column to 1
        col_name = f'type_{ttype.replace(' ', '_').upper()}'
        if col_name in one_hot:
            one_hot[col_name] = 1
        # Build feature dict
        input_features = {feature_map[k]: float(data[k]) for k in feature_map}
        input_features.update(one_hot)
        # Ensure feature order matches model
        model_features = getattr(model, 'feature_names_in_', None)
        if model_features is None:
            # Fallback: use columns from test_df
            model_features = list(test_df.drop('is_fraud', axis=1).columns)
        features = [input_features.get(f, 0) for f in model_features]
        import pandas as pd
        X_pred = pd.DataFrame([features], columns=model_features)
        prediction = model.predict(X_pred)[0]
        confidence = getattr(model, 'predict_proba', lambda x: [[1.0]])(X_pred)[0][int(prediction)]
        return jsonify({
            'success': True,
            'data': {
                'is_fraud': bool(prediction),
                'confidence': float(confidence)
            },
            'message': 'Transaction analyzed successfully'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/model-details', methods=['GET'])
def model_details():
    info = {
        'algorithm': 'Random Forest',
        'version': '1.0',
        'metrics': model_metrics
    }
    return jsonify({'success': True, 'data': info})

if __name__ == '__main__':
    app.run(debug=True)
