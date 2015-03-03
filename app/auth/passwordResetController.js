angular.module("groupeat.auth")
    .controller("PasswordResetController", PasswordResetController);

function PasswordResetController($http, $routeParams, $mdDialog, $filter) {
    var vm = this;

    vm.resetPassword = resetPassword;

    function resetPassword() {
        var request = {
            method: "POST",
            url: "/api/auth/password",
            headers: {
                "Accept": "application/vnd.groupeat.v1+json"
            },
            data: {
                "email": this.email,
                "password": this.password,
                "token": $routeParams["token"]
            }
        };

        $http(request)
            .success(function() {
                $mdDialog.show(
                    $mdDialog.alert()
                        .content($filter("translate")("resetPasswordSuccess"))
                        .ok("x")
                );
            })
            .error(function(response) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title($filter("translate")("errorDialogTitle"))
                        .content($filter("translate")(response["error_key"]))
                        .ok("x")
                );
            });
    };
}