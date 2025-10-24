export const baseEnvironment = {
    appName: 'CryptoCollector',
    version: '1.0.0',
    defaultLanguage: 'es',
    apiTimeout: 30000,

    pagination: {
        defaultPageSize: 20,
        pageSizeOptions: [10, 20, 50, 100]
    },

    cache: {
        enabled: true,
        ttl: 300000
    },

    features: {
        enableOfflineMode: false as boolean,
        enableNotifications: false as boolean,
        enableAnalytics: false as boolean
    }
} as const;

export type BaseEnvironment = typeof baseEnvironment;
