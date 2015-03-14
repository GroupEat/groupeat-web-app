/*@ngInject*/
module.exports = function DocsController(api, $window, authentication, $location) {
    var vm = this;

    vm.logIn = logIn;

    activate();

    function activate() {
        if ($location.host() === 'groupeat.dev') {
            vm.email = 'admin@groupeat.fr';
            vm.password = 'groupeat';
            vm.logIn();
        }
    }

    function logIn() {
        var hash = $location.hash();

        authentication.logIn(vm.email, vm.password).then(function() {
            api('GET', 'admin/docs').success(function(response) {
                var document = $window.document;
                document.open('text/html');
                document.write(response); // jshint ignore:line
                document.close();

                if (hash !== '') {
                    document.getElementById(hash).scrollIntoView();
                }
            });
        });
    }
};
