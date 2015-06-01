/* global browser by describe element expect it */
describe('homepage', function () {
  const URL = ''

  it('should be on homepage', () => {
    browser.get(URL)
    browser.getLocationAbsUrl().then(url =>
      expect(url).toBe('/')
    )
  })

  it('should have a showcase logo', () => {
    browser.get(URL)
    const showcaseLogo = element(by.id('showcase-logo'))
    expect(showcaseLogo.isPresent()).toBe(true)
    expect(showcaseLogo.getAttribute('src')).toContain('/img/logo.svg')
  })
})
