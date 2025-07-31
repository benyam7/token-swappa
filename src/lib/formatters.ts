export function formatCurrency(
    value: number | string | undefined | null,
    options?: { decimals?: number; abbreviate?: boolean }
): string {
    if (value === undefined || value === null || isNaN(Number(value))) {
        return '$0.00';
    }

    const num = Number(value);
    const decimals = options?.decimals ?? 2;
    const abbreviate = options?.abbreviate ?? true;

    if (abbreviate) {
        let formattedNum: string;
        let suffix = '';

        if (Math.abs(num) >= 1.0e12) {
            formattedNum = (num / 1.0e12).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
            suffix = 'T';
        } else if (Math.abs(num) >= 1.0e9) {
            formattedNum = (num / 1.0e9).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
            suffix = 'B';
        } else if (Math.abs(num) >= 1.0e6) {
            formattedNum = (num / 1.0e6).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
            suffix = 'M';
        } else {
            // For numbers less than a million, use standard formatting
            return `$${num.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}`;
        }

        return `$${formattedNum}${suffix}`;
    }

    return `$${num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
}

export function formatTokenAmount(
    value: number | string | undefined | null,
    decimals = 6
): string {
    if (value === undefined || value === null || isNaN(Number(value))) {
        return '0';
    }
    return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    });
}
