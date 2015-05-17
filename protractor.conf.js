exports.config = {
    baseUrl: 'http://localhost:8010/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['tests/**/*.js'],
    framework: 'jasmine'
};
