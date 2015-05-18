describe('docs', function() {
    beforeEach(function () {
        browser.get('docs');
        this.form = element(by.name('adminLoginForm'));
        this.button = this.form.element(by.tagName('button'));
    });

    it('should be ond docs page', function() {
        browser.getLocationAbsUrl().then(function(url) {
            expect(url).toBe('/docs');
        });
    });

    it('should have a disabled submit button when the form is invalid', function() {
        expect(this.button.getAttribute('disabled')).toBe('true');
    });

    it('should reject invalid email format', function() {
        this.form.element(by.name('email')).sendKeys('admin@groupeat@fr');
        this.form.element(by.name('password')).sendKeys('groupeat');
        expect(this.button.getAttribute('disabled')).toBe('true');
    });

    it('should accept valid credentials', function() {
        this.form.element(by.name('email')).sendKeys('admin@groupeat.fr');
        this.form.element(by.name('password')).sendKeys('groupeat');
        expect(this.button.getAttribute('disabled')).toBeNull();
    });
});
