describe('homepage', function() {
    const URL = '';

    beforeEach(function () {
        //
    });

    it('should be on homepage', function() {
        browser.get(URL);
        browser.getLocationAbsUrl().then(function(url) {
            expect(url).toBe('/');
        });
    });

    it('should have a showcase logo', function() {
        browser.get(URL);
        const showcaseLogo = element(by.id('showcase-logo'));
        expect(showcaseLogo.isPresent()).toBe(true);
        expect(showcaseLogo.getAttribute('src')).toContain('/img/logo.svg');
    });
});
