const apiUrl = path => `/api/${path}`;

const translate = key => {
  const translations = require('../../assets/translations/fr.json');

  return translations[key];
};

export { apiUrl, translate };
