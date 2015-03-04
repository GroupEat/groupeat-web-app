var DocsController = function($http, $window) {
    var vm = this;

    vm.logIn = logIn;

    function logIn() {
        var request = {
            method: "POST",
            url: "/api/auth/token",
            headers: {
                "Accept": "application/vnd.groupeat.v1+json"
            },
            data: {
                "email": vm.email,
                "password": vm.password
            }
        };

        $http(request)
            .success(function(response) {
                var token = response['data']['token'];

                var request = {
                    method: "GET",
                    url: "/api/admin/docs",
                    headers: {
                        "Accept": "application/vnd.groupeat.v1+json",
                        "Authorization": "bearer " + token
                    },
                    data: {
                        "email": "admin@groupeat.fr",
                        "password": "groupeat"
                    }
                };

                $http(request)
                    .success(function(response) {
                        document.open('text/html');
                        document.write(response);
                        document.close();
                    })
                    .error(function(response) {
                        console.log(response);
                    });
            })
            .error(function(response) {
                console.log(response);
            });
    };
};

module.exports = DocsController;