describe('homepage', function() {
    it('should be on homepage', function() {
        browser.get('');
        browser.getLocationAbsUrl().then(function(url) {
            expect(url).toBe('/');
        });
    });
});
