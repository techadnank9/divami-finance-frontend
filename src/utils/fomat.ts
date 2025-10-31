// src/utils/format.ts
export const formatCurrency = (value: number | string | undefined | null, locale = 'en-IN', currency = 'INR') => {
    const num = Number(value || 0);
    try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(num);
    } catch {
        // fallback
        return `${currency} ${num.toFixed(2)}`;
    }
};
