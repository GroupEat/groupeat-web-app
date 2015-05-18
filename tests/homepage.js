describe('homepage', function() {
    beforeEach(function () {
        browser.get('');
    });

    it('should be on homepage', function() {
        browser.getLocationAbsUrl().then(function(url) {
            expect(url).toBe('/');
        });
    });

    it('should have a showcase logo', function() {
        var showcaseLogo = element(by.id('showcase-logo'));
        expect(showcaseLogo.isPresent()).toBe(true);
        expect(showcaseLogo.getAttribute('src')).toContain('/img/logo.svg');
    });
});
