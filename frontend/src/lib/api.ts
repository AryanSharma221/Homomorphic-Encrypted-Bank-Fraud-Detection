import {
  DashboardMetrics,
  FraudAlert,
  FraudAnalysisResult,
  Transaction,
} from "./types";

const API_BASE_URL = "http://localhost:8000";

export const api = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/metrics`);

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard metrics");
    }

    return response.json();
  },

  getFraudAlerts: async (): Promise<FraudAlert[]> => {
    const response = await fetch(`${API_BASE_URL}/api/fraud/alerts`);

    if (!response.ok) {
      throw new Error("Failed to fetch fraud alerts");
    }

    const data = await response.json();

    return data.map((alert: any) => ({
      id: String(alert.id),
      transactionId: alert.transaction_id,
      amount: alert.amount ?? 0,
      fraudScore: alert.fraud_score,
      riskLevel: alert.risk_level,
      status: alert.decision,
      timestamp: alert.created_at,
    }));
  },

  analyzeTransaction: async (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const payload = {
      amount: transaction.amount,
      transaction_type: transaction.type.toLowerCase(),
      merchant_category: transaction.merchantCategory.toLowerCase(),
      location: transaction.location.toLowerCase(),
      time: transaction.time,
    };

    const response = await fetch(
      `${API_BASE_URL}/api/transactions/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Transaction analysis failed");
    }

    const data = await response.json();

    return {
      transactionId: data.transaction_id,
      fraudScore: data.fraud_score,
      riskLevel: data.risk_level,
      decision: data.decision,
      riskIndicators:
        data.risk_indicators ?? ["Analysis completed by ML model"],
    };
  },
};