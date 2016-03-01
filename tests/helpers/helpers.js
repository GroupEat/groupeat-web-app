/* global browser by element expect it */
export const apiUrl = path => `${process.env.API_BASE_URL}/${path}`;

export const translate = key => {
  const translations = require('../../src/translations/fr.json');

  return translations[key];
};

export const logOut = () => {
  browser.get('logOut');
};

export const shouldRequireAuthentication = testedUrl => {
  it('should require authentication', () => {
    browser.get(testedUrl);

    browser.getLocationAbsUrl().then(url =>
        expect(url).toBe('/logIn')
    );
  });
};

export const browseAuthenticated = (testedUrl, backend, userType, callback) => {
  backend.whenPUT(apiUrl('auth/token')).respond(JSON.stringify({
    data: {
      id: 1,
      type: userType,
      token: 'uselessToken',
    },
  }));

  browser.get('logIn');

  const form = element(by.name('logInForm'));

  form.element(by.name('email')).clear().sendKeys('useless@email.fr');
  form.element(by.name('password')).clear().sendKeys('password');
  form.element(by.tagName('button')).click();

  browser.get(testedUrl);

  callback();
};
