/* global afterEach beforeEach browser by describe element expect it */
import HttpBackend from 'httpbackend';

import { apiUrl, translate } from './helpers/helpers';

describe('docs', () => {
  const URL = 'docs';
  const DOCS_CONTENT = 'docs content';

  let form;
  let button;
  let backend;

  beforeEach(() => {
    form = element(by.name('adminLoginForm'));
    button = form.element(by.tagName('button'));
    backend = new HttpBackend(browser);
  });

  afterEach(() => {
    backend.clear();
  });

  it('should be on docs page', () => {
    browser.get(URL);

    browser.getLocationAbsUrl().then(url =>
      expect(url).toBe('/docs')
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
    backend.whenPOST(apiUrl('auth/token')).respond(JSON.stringify({data: {token: 'uselessToken'}}));
    backend.whenGET(apiUrl('admin/docs')).respond(DOCS_CONTENT);

    browser.get(URL);

    form.element(by.name('email')).clear().sendKeys('admin@groupeat.fr');
    form.element(by.name('password')).clear().sendKeys('groupeat');
    expect(button.getAttribute('disabled')).toBeNull();

    button.click();

    expect(element(by.tagName('body')).getText()).toBe(DOCS_CONTENT);
  });

  it('should reject invalid credentials', () => {
    backend.whenPOST(apiUrl('auth/token')).respond(() => [401, '', {}]);
    backend.whenGET(apiUrl('admin/docs')).respond(DOCS_CONTENT);

    browser.get(URL);

    form.element(by.name('email')).clear().sendKeys('bademail@groupeat.fr');
    form.element(by.name('password')).clear().sendKeys('badpassword');
    expect(button.getAttribute('disabled')).toBeNull();

    button.click();

    expect(element(by.tagName('body')).getText()).toContain(translate('authenticationError'));
  });
});
