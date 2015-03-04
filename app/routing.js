require("angular-route");

module.exports = require("angular").module("groupeat.routing", [
    "ngRoute"
])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    })

    .config(function($routeProvider) {
        $routeProvider
            .when("/", { templateUrl: "/app/showcase/showcase.html" })
            .when("/docs", { templateUrl: "/app/admin/login.html" })
            .when("/auth/activate", {
                templateUrl: "/app/showcase/showcase.html",
                controller: "ActivateCustomerController"
            })
            .when("/auth/password/reset", { templateUrl: "/app/auth/passwordReset.html" })
            .when("/groupOrders/:groupOrderId/confirm", { templateUrl: "/app/groupOrders/confirm.html" })
            .otherwise({redirectTo: "/"});
    });
