import angular from 'angular'
import 'angular-aria'
import 'angular-animate'
import 'angular-cookies'
import 'angular-material'
import 'angular-local-storage'
import 'angular-translate'
import '../node_modules/angular-translate/dist/angular-translate-storage-local/angular-translate-storage-local'
import '../node_modules/angular-translate/dist/angular-translate-storage-cookie/angular-translate-storage-cookie'
import '../node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files'
import 'angular-auto-validate'
import 'angular-loading-bar'

angular.module('groupeat.config', [
  'ngMaterial',
  'ngCookies',
  'LocalStorageModule',
  'pascalprecht.translate',
  'jcs-autoValidate',
  'angular-loading-bar'
])
  .config(localStorageServiceProvider => {
    'ngInject'

    localStorageServiceProvider.setPrefix('groupeat-web-frontend')
  })
  .config($translateProvider => {
    'ngInject'

    $translateProvider
      .useStaticFilesLoader({
        prefix: '/translations/',
        suffix: '.json'
      })
      .preferredLanguage('fr')
      .fallbackLanguage(['fr'])
      .useLocalStorage()
      .useSanitizeValueStrategy('escaped')
  })
  .config($mdThemingProvider => {
    'ngInject'

    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('red')
  })
  .config(cfpLoadingBarProvider => {
    'ngInject'

    cfpLoadingBarProvider.includeSpinner = false
    // cfpLoadingBarProvider.barColor = '#ff5252'
  })
  .run((validator, elementModifier, defaultErrorMessageResolver) => {
    'ngInject'

    validator.registerDomModifier(elementModifier.key, elementModifier)
    validator.setDefaultElementModifier(elementModifier.key)
    defaultErrorMessageResolver.setI18nFileRootPath('/translations')
    defaultErrorMessageResolver.setCulture('fr-FR')
  })
