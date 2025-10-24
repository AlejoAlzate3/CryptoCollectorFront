export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data'
} as const;

export const APP_ROUTES = {
    LOGIN: '/dashboard/login',
    SIGNUP: '/dashboard/signup',
    CRYPTO_LIST: '/crypto',
    CRYPTO_DETAIL: (id: string) => `/crypto/${id}`
} as const;

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    DEFAULT_PAGE_INDEX: 0
} as const;

export const SORT_CONFIG = {
    DEFAULT_SORT_BY: 'marketCapRank',
    DEFAULT_SORT_DIRECTION: 'asc' as const,
    COLUMN_MAPPING: {
        'marketCapRank': 'marketCapRank',
        'name': 'name',
        'symbol': 'symbol',
        'currentPrice': 'currentPrice',
        'marketCap': 'marketCap',
        'totalVolume': 'totalVolume',
        'lastUpdated': 'lastUpdated'
    }
} as const;

export const MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: 'Login exitoso',
        LOGOUT_SUCCESS: 'Logout exitoso',
        REGISTER_SUCCESS: 'Usuario registrado exitosamente',
        INVALID_CREDENTIALS: 'Credenciales inválidas',
        EMAIL_REQUIRED: 'Ingresar email es obligatorio',
        EMAIL_INVALID: 'Email no válido',
        PASSWORD_REQUIRED: 'La contraseña es obligatoria',
        UNAUTHORIZED: 'Token inválido o expirado. Redirigiendo al login...'
    },
    CRYPTO: {
        LOAD_ERROR: 'Error al cargar criptomonedas',
        DETAIL_LOAD_ERROR: 'Error al cargar la criptomoneda',
        STATS_LOAD_ERROR: 'Error al cargar estadísticas',
        SYNC_CONFIRM: '¿Estás seguro de sincronizar las criptomonedas? Esto puede tomar varios minutos.',
        SYNC_SUCCESS: (count: number) => `Sincronización completada. ${count} criptomonedas actualizadas.`,
        SYNC_ERROR: 'Error al sincronizar'
    },
    ERRORS: {
        UNKNOWN: 'Ocurrió un error desconocido',
        SERVER_DOWN: 'No se pudo conectar con el servidor. Verifica que el backend esté activo.',
        BAD_REQUEST: 'Datos de entrada inválidos',
        EMAIL_EXISTS: 'El email ya está registrado'
    }
} as const;

export const HTTP_CONFIG = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
} as const;

export const CRYPTO_TABLE_COLUMNS = [
    'marketCapRank',
    'name',
    'symbol',
    'currentPrice',
    'marketCap',
    'totalVolume',
    'lastUpdated',
    'actions'
] as const;

export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
} as const;
