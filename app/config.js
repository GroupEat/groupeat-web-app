require("angular-aria");
require("angular-animate");
require("angular-cookies");
require("angular-material");
require("angular-local-storage");
require("angular-translate");
require("../bower_components/angular-translate-storage-local/angular-translate-storage-local");
require("../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie");
require("../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files");
require("angular-auto-validate");

module.exports = require("angular").module("groupeat.config", [
    "ngMaterial",
    "ngCookies",
    "LocalStorageModule",
    "pascalprecht.translate",
    "jcs-autoValidate"
])
    .config(/*@ngInject*/ function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix("groupeat-web-frontend");
    })

    .config(/*@ngInject*/ function($translateProvider) {
        $translateProvider
            .useStaticFilesLoader({
                prefix: "/translations/",
                suffix: ".json"
            })
            .preferredLanguage("fr")
            .fallbackLanguage(["fr"])
            .useLocalStorage();
    })

    .config(/*@ngInject*/ function($mdThemingProvider) {
        $mdThemingProvider.theme("default")
            .primaryPalette("orange")
            .accentPalette("red")
    })

    .run(/*@ngInject*/ function(validator, elementModifier, defaultErrorMessageResolver) {
        validator.registerDomModifier(elementModifier.key, elementModifier);
        validator.setDefaultElementModifier(elementModifier.key);
        defaultErrorMessageResolver.setI18nFileRootPath("/translations");
        defaultErrorMessageResolver.setCulture("fr-FR");
    });
