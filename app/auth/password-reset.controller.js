/*@ngInject*/
module.exports = function(api, $routeParams, popup) {
    var vm = this;

    vm.resetPassword = resetPassword;

    function resetPassword() {
        api('POST', 'api/auth/password', {
            'email': this.email,
            'password': this.password,
            'token': $routeParams['token']
        })
            .success(function() {
                popup.defaultContentOnly('resetPasswordSuccess');
            })
            .error(function(response) {
                popup.default('errorDialogTitle', response['error_key']);
            });
    }
}