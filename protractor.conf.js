exports.config = {
    baseUrl: 'http://localhost:3474/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['dist-tests/*.js'],
    maxSessions: 1,
    framework: 'jasmine2'
}
