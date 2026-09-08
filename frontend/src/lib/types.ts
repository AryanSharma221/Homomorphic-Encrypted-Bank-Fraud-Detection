export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type Decision =
  | "APPROVED"
  | "REVIEW"
  | "FLAGGED"
  | "BLOCKED";

export interface Transaction {
  id: string;
  amount: number;
  merchantCategory: string;
  location: string;
  type: string;
  time: string;
  timestamp: string;
  previousTransactions: number;
}

export interface FraudAnalysisResult {
  transactionId: string;
  fraudScore: number;
  riskLevel: RiskLevel;
  decision: Decision;
  riskIndicators: string[];
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  amount: number;
  fraudScore: number;
  riskLevel: RiskLevel;
  status: Decision;
  timestamp: string;
}

export interface DashboardMetrics {
  totalTransactions: number;
  transactionsAnalyzed: number;
  fraudDetected: number;
  highRiskTransactions: number;
}