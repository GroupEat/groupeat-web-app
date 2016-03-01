import angular from 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-auto-validate';
import 'angular-cookies';
import 'angular-loading-bar';
import 'angular-local-storage';
import 'angular-material';
import 'angular-moment';
import 'angular-translate';
import 'angular-ui-router';
import 'moment/locale/fr';

angular.module('groupeat.config', [
  'angular-loading-bar',
  'angularMoment',
  'jcs-autoValidate',
  'LocalStorageModule',
  'ngCookies',
  'ngMaterial',
  'pascalprecht.translate',
  'ui.router',
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
      .translations('fr', require('../translations/fr.json'))
      .preferredLanguage('fr')
      .fallbackLanguage(['fr'])
      .useSanitizeValueStrategy('escaped');
  })
  .config($urlRouterProvider => {
    'ngInject';

    $urlRouterProvider.otherwise('/');
  })
  .constant('apiBaseUrl', process.env.API_BASE_URL)
  .constant('broadcastUrl', process.env.BROADCAST_URL)
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
    defaultErrorMessageResolver.setCulture('fr-FR', () => Promise.resolve({
      data: require('../translations/jcs-auto-validate_fr-fr.json'),
    }));
  });
