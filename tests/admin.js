describe('admin', function() {
    it('should have a docs page', function() {
        browser.get('docs');
        browser.getLocationAbsUrl().then(function(url) {
            expect(url).toBe('/docs');
        });
    });
});
