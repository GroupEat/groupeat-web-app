var angular = require('angular');

require('angular-aria');
require('angular-animate');
require('angular-cookies');
require('angular-material');
require('angular-local-storage');
require('angular-translate');
require('../node_modules/angular-translate/dist/angular-translate-storage-local/angular-translate-storage-local');
require('../node_modules/angular-translate/dist/angular-translate-storage-cookie/angular-translate-storage-cookie');
require('../node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files');
require('angular-auto-validate');

module.exports = angular.module('groupeat.config', [
    'ngMaterial',
    'ngCookies',
    'LocalStorageModule',
    'pascalprecht.translate',
    'jcs-autoValidate'
])
    .config(function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('groupeat-web-frontend');
    })

    .config(function($translateProvider) {
        $translateProvider
            .useStaticFilesLoader({
                prefix: '/translations/',
                suffix: '.json'
            })
            .preferredLanguage('fr')
            .fallbackLanguage(['fr'])
            .useLocalStorage();
    })

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('red');
    })

    .run(function(validator, elementModifier, defaultErrorMessageResolver) {
        validator.registerDomModifier(elementModifier.key, elementModifier);
        validator.setDefaultElementModifier(elementModifier.key);
        defaultErrorMessageResolver.setI18nFileRootPath('/translations');
        defaultErrorMessageResolver.setCulture('fr-FR');
    });
