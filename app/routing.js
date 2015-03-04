require("angular-route");

module.exports = require("angular").module("groupeat.routing", [
    "ngRoute"
])
    .config(/*@ngInject*/ function($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    })

    .config(/*@ngInject*/ function($routeProvider) {
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
