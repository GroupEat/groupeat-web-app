/* global afterEach beforeEach browser by describe element expect it */
import HttpBackend from 'httpbackend';

import * as helpers from './helpers/helpers';

describe('docs', () => {
  const URL = 'docs';
  const DOCS_CONTENT = 'docs content';

  let backend;

  beforeEach(() => {
    backend = new HttpBackend(browser);
  });

  afterEach(() => {
    helpers.logOut();
    backend.clear();
  });

  helpers.shouldRequireAuthentication(URL);

  const browseAs = (userType, callback) => {
    backend.whenGET(helpers.apiUrl('docs')).respond(DOCS_CONTENT);

    helpers.browseAuthenticated(URL, backend, userType, () => {
      callback();
    });
  };

  ['customer', 'restaurant'].forEach(userType => {
    it(`should not be accessible to a ${userType}`, () => {
      browseAs(userType, () => {
        expect(element(by.tagName('body')).getText()).not.toBe(DOCS_CONTENT);
      });
    });
  });

  it('should be accessible to an admin', () => {
    browseAs('admin', () => {
      expect(element(by.tagName('body')).getText()).toBe(DOCS_CONTENT);
    });
  });
});
