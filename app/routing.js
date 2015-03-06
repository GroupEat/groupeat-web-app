var angular = require("angular");

require("angular-route");

module.exports = angular.module("groupeat.routing", [
    "ngRoute"
])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    })

    .config(function($routeProvider) {
        $routeProvider
            .when("/", { templateUrl: "/showcase/showcase.html" })
            .when("/docs", { templateUrl: "/admin/login.html" })
            .when("/auth/activate", {
                templateUrl: "/showcase/showcase.html",
                controller: "ActivateCustomerController"
            })
            .when("/auth/password/reset", { templateUrl: "/auth/passwordReset.html" })
            .when("/groupOrders/:groupOrderId/confirm", { templateUrl: "/groupOrders/confirm.html" })
            .otherwise({redirectTo: "/"});
    });
