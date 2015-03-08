/*@ngInject*/
module.exports = function DocsController(api, $window, authentication) {
    var vm = this;

    vm.showDocs = showDocs;

    function showDocs() {
        authentication.logIn(vm.email, vm.password).then(function() {
            api('GET', 'admin/docs').success(function(response) {
                var  document = $window.document;
                document.open('text/html');
                document.write(response); // jshint ignore:line
                document.close();
            });
        });
    }
};
