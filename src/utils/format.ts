const urlPattern = /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/gi;
export function processLinks(text: string) {
    if (!text || !text.length) return;
    return text.replaceAll(urlPattern, (r) => {
        const link = r.startsWith('http') ? r : 'http://' + r;
        return `<a href="${link}" target="_blank">${r}</a>`
    })
}

export function formatCurrency(value: number) {
    if (value == null || value == undefined || typeof value !== 'number' || !value.toLocaleString) return;
    return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 });
}

export function formatDecimal(value: number) {
    if (value == null || value == undefined || typeof value !== 'number' || !value.toLocaleString) return;
    return value.toLocaleString('ru-RU', { style: 'decimal', maximumFractionDigits: 2 });
}

export function formatDateTime(value: number) {
    if (!value || typeof value !== 'number') return;

    return new Date(value).toLocaleString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function formatDate(value: number) {
    if (!value || typeof value !== 'number') return;

    return new Date(value).toLocaleString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit' });
}