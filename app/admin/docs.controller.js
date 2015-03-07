/*@ngInject*/
module.exports = function(api, $window, authentication) {
    var vm = this;

    vm.showDocs = showDocs;

    function showDocs() {
        authentication.logIn(vm.email, vm.password).then(function() {
            api('GET', 'admin/docs').success(function(response) {
                document.open('text/html');
                document.write(response);
                document.close();
            });
        });
    }
}
