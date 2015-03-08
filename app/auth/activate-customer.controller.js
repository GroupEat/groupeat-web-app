/*@ngInject*/
module.exports = function(api, $routeParams, popup) {
    activate();

    function activate() {
        api('POST', 'auth/activationTokens', {
            token: $routeParams.token
        })
            .success(function() {
                popup.default('activationSuccessTitle', 'activationSuccess');
            })
            .error(function() {
                popup.default('activationErrorTitle', 'activationError');
            });
    }
};