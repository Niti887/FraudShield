import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import logging
from typing import Dict, List, Tuple, Optional
import shap

logger = logging.getLogger(__name__)

class FraudDetector:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = None
        self.explainer = None

    def preprocess_transaction(self, transaction: Dict) -> np.ndarray:
        """
        Preprocess a single transaction into model features
        """
        # TODO: Implement proper feature engineering
        # This is a placeholder implementation
        features = np.array([
            float(transaction['amount']),
            # Add more feature engineering here
        ]).reshape(1, -1)
        
        return self.scaler.transform(features)

    def predict(self, transaction: Dict) -> Tuple[float, bool, float, List[str]]:
        """
        Predict fraud probability and generate explanation
        """
        try:
            # Preprocess transaction
            features = self.preprocess_transaction(transaction)
            
            # Get prediction probability
            fraud_prob = self.model.predict_proba(features)[0][1]
            
            # Determine if fraud
            is_fraud = fraud_prob > 0.5
            
            # Calculate risk score (0-100)
            risk_score = fraud_prob * 100
            
            # Generate explanation using SHAP
            if self.explainer is not None:
                shap_values = self.explainer.shap_values(features)
                explanation = self._generate_explanation(shap_values[0], features[0])
            else:
                explanation = ["Model explanation not available"]
            
            return fraud_prob, is_fraud, risk_score, explanation
            
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            raise

    def _generate_explanation(self, shap_values: np.ndarray, features: np.ndarray) -> List[str]:
        """
        Generate human-readable explanations using SHAP values
        """
        explanations = []
        for i, (shap_value, feature_value) in enumerate(zip(shap_values, features)):
            if abs(shap_value) > 0.1:  # Only include significant features
                feature_name = self.feature_names[i] if self.feature_names else f"Feature {i}"
                impact = "increases" if shap_value > 0 else "decreases"
                explanations.append(
                    f"{feature_name} ({feature_value:.2f}) {impact} fraud probability"
                )
        return explanations

    def load_model(self, model_path: str):
        """
        Load a trained model from disk
        """
        try:
            self.model = joblib.load(model_path)
            logger.info(f"Model loaded successfully from {model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise

    def save_model(self, model_path: str):
        """
        Save the trained model to disk
        """
        try:
            joblib.dump(self.model, model_path)
            logger.info(f"Model saved successfully to {model_path}")
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            raise 