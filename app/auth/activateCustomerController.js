angular.module("groupeat.auth")
    .controller("ActivateCustomerController", ActivateCustomerController);

function ActivateCustomerController($http, $routeParams, $mdDialog, $filter) {
    activate();

    function activate() {
        var request = {
            method: "POST",
            url: "/api/auth/activationTokens",
            headers: {
                "Accept": "application/vnd.groupeat.v1+json"
            },
            data: {
                "token": $routeParams["token"]
            }
        };

        $http(request)
            .success(function() {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title($filter("translate")("activationSuccessTitle"))
                        .content($filter("translate")("activationSuccess"))
                        .ok("x")
                );
            })
            .error(function() {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title($filter("translate")("activationErrorTitle"))
                        .content($filter("translate")("activationError"))
                        .ok("x")
                );
            });
    };
}