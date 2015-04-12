import angular from 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-cookies';
import 'angular-material';
import 'angular-local-storage';
import 'angular-translate';
import '../node_modules/angular-translate/dist/angular-translate-storage-local/angular-translate-storage-local';
import '../node_modules/angular-translate/dist/angular-translate-storage-cookie/angular-translate-storage-cookie';
import '../node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files';
import 'angular-auto-validate';

angular.module('groupeat.config', [
    'ngMaterial',
    'ngCookies',
    'LocalStorageModule',
    'pascalprecht.translate',
    'jcs-autoValidate'
])
    .config(localStorageServiceProvider => {
        'ngInject';

        localStorageServiceProvider.setPrefix('groupeat-web-frontend');
    })
    .config($translateProvider => {
        'ngInject';

        $translateProvider
            .useStaticFilesLoader({
                prefix: '/translations/',
                suffix: '.json'
            })
            .preferredLanguage('fr')
            .fallbackLanguage(['fr'])
            .useLocalStorage();
    })
    .config($mdThemingProvider => {
        'ngInject';

        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('red');
    })
    .run((validator, elementModifier, defaultErrorMessageResolver) => {
        'ngInject';

        validator.registerDomModifier(elementModifier.key, elementModifier);
        validator.setDefaultElementModifier(elementModifier.key);
        defaultErrorMessageResolver.setI18nFileRootPath('/translations');
        defaultErrorMessageResolver.setCulture('fr-FR');
    });
