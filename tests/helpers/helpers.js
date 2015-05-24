export function apiUrl(path) {
    return `/api/${path}`;
}

export function translate(key) {
    const translations = require('../../assets/translations/fr.json');

    return translations[key];
}
