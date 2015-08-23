/* global browser by describe element expect it */
describe('homepage', () => {
  const URL = '';

  it('should be accessible', () => {
    browser.get(URL);
    browser.getLocationAbsUrl().then(url =>
      expect(url).toBe('/')
    );
  });

  it('should display a logo', () => {
    browser.get(URL);
    const showcaseLogo = element(by.id('showcase-logo'));
    expect(showcaseLogo.isPresent()).toBe(true);
    expect(showcaseLogo.getAttribute('src')).toContain('/img/logo.svg');
  });
});
