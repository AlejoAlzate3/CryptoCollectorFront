// Interfaces para las criptomonedas

export interface CryptoResponse {
  coinId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  lastUpdated: string;
}

export interface CryptoPage {
  content: CryptoResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

export interface CryptoStats {
  total: number;
  hasSyncedData: boolean;
  lastUpdated: string | null;
}

export interface SchedulerStatus {
  enabled: boolean;
  frequency: string;
  schedule: string;
  cronExpression: string;
  lastSync: string | null;
  totalCryptos: number;
  nextSync: string;
  nextSyncDescription: string;
  minutesUntilNext: number;
}
