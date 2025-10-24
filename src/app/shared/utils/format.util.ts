export function formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined) return 'N/A';

    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }).format(price);
}

export function formatLargeNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'N/A';

    const formatWithSuffix = (num: number, suffix: string): string =>
        `$${num.toFixed(2)}${suffix}`;

    if (value >= 1e12) return formatWithSuffix(value / 1e12, 'T');
    if (value >= 1e9) return formatWithSuffix(value / 1e9, 'B');
    if (value >= 1e6) return formatWithSuffix(value / 1e6, 'M');
    if (value >= 1e3) return formatWithSuffix(value / 1e3, 'K');

    return `$${value.toFixed(2)}`;
}

export function formatDate(
    date: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return 'N/A';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return new Date(date).toLocaleString('es-ES', options || defaultOptions);
}

export function formatDateLong(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    return new Date(date).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

export function truncateString(str: string, maxLength: number): string {
    if (!str || str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
}

export function formatPercentage(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'N/A';

    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}
