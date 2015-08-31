/* global afterEach beforeEach browser by describe element expect it */
import HttpBackend from 'httpbackend';

import * as helpers from './helpers/helpers';

describe('log in', () => {
  const URL = 'logIn';

  let form;
  let button;
  let backend;

  beforeEach(() => {
    form = element(by.name('logInForm'));
    button = form.element(by.tagName('button'));
    backend = new HttpBackend(browser);
  });

  afterEach(() => {
    helpers.logOut();
    backend.clear();
  });

  it('should be accessible', () => {
    browser.get(URL);

    browser.getLocationAbsUrl().then(url =>
      expect(url).toBe(`/${URL}`)
    );
  });

  it('should have a disabled submit button when the form is invalid', () => {
    browser.get(URL);

    expect(button.getAttribute('disabled')).toBe('true');
  });

  it('should reject invalid email format', () => {
    browser.get(URL);
    form.element(by.name('email')).sendKeys('admin@groupeat@fr');
    form.element(by.name('password')).sendKeys('groupeat');

    expect(button.getAttribute('disabled')).toBe('true');
  });

  it('should accept valid credentials', () => {
    backend.whenPUT(helpers.apiUrl('auth/token')).respond(JSON.stringify({data: {token: 'uselessToken'}}));

    browser.get(URL);

    form.element(by.name('email')).clear().sendKeys('admin@groupeat.fr');
    form.element(by.name('password')).clear().sendKeys('groupeat');
    expect(button.getAttribute('disabled')).toBeNull();

    button.click();
  });

  it('should reject invalid credentials', () => {
    backend.whenPUT(helpers.apiUrl('auth/token')).respond(() => [401, '', {}]);

    browser.get(URL);

    form.element(by.name('email')).clear().sendKeys('bademail@groupeat.fr');
    form.element(by.name('password')).clear().sendKeys('badpassword');
    expect(button.getAttribute('disabled')).toBeNull();

    button.click();

    expect(element(by.tagName('body')).getText()).toContain(helpers.translate('authenticationError'));
  });
});
