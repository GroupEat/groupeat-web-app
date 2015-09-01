import angular from 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-auto-validate';
import 'angular-cookies';
import 'angular-loading-bar';
import 'angular-local-storage';
import 'angular-material';
import 'angular-translate';
import 'angular-ui-router';
import 'angular-moment';
import '../../node_modules/angular-translate/dist/angular-translate-storage-local/angular-translate-storage-local';
import '../../node_modules/angular-translate/dist/angular-translate-storage-cookie/angular-translate-storage-cookie';
import '../../node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files';
import '../../node_modules/moment/locale/fr';

angular.module('groupeat.config', [
  'angular-loading-bar',
  'angularMoment',
  'jcs-autoValidate',
  'LocalStorageModule',
  'ngCookies',
  'ngMaterial',
  'pascalprecht.translate',
  'ui.router'
])
  .config(cfpLoadingBarProvider => {
    'ngInject';

    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 150;
  })
  .config(localStorageServiceProvider => {
    'ngInject';

    localStorageServiceProvider.setPrefix('groupeat-frontend');
  })
  .config($locationProvider => {
    'ngInject';

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  })
  .config($mdThemingProvider => {
    'ngInject';

    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('red');
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
      .useLocalStorage()
      .useSanitizeValueStrategy('escaped');
  })
  .config($urlRouterProvider => {
    'ngInject';

    $urlRouterProvider.otherwise('/');
  })
  .run(amMoment => {
    'ngInject';

    amMoment.changeLocale('fr');
  })
  .run(($rootScope, $state) => {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, to, params) => {
      if (to.redirectTo) {
        event.preventDefault();
        $state.go(to.redirectTo, params);
      }
    });
  })
  .run((validator, elementModifier, defaultErrorMessageResolver) => {
    'ngInject';

    validator.registerDomModifier(elementModifier.key, elementModifier);
    validator.setDefaultElementModifier(elementModifier.key);
    defaultErrorMessageResolver.setI18nFileRootPath('/translations');
    defaultErrorMessageResolver.setCulture('fr-FR');
  });
