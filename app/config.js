angular.module("groupeat.config", [
    "ngMaterial",
    "ngCookies",
    "LocalStorageModule",
    "pascalprecht.translate",
    "jcs-autoValidate"
])
    .config(function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix("groupeat-web-frontend");
    })

    .config(function($translateProvider) {
        $translateProvider
            .useStaticFilesLoader({
                prefix: "/assets/translations/",
                suffix: ".json"
            })
            .preferredLanguage("fr")
            .fallbackLanguage(["fr"])
            .useLocalStorage();
    })

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme("default")
            .primaryPalette("orange")
            .accentPalette("red")
    })

    .run(function (validator, elementModifier, defaultErrorMessageResolver) {
        validator.registerDomModifier(elementModifier.key, elementModifier);
        validator.setDefaultElementModifier(elementModifier.key);
        defaultErrorMessageResolver.setI18nFileRootPath("/assets/translations");
        defaultErrorMessageResolver.setCulture("fr-FR");
    });
