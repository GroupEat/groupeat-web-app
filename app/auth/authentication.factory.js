/*@ngInject*/
module.exports = function($injector, $q, popup) {
    var factory = {
        logIn: logIn,
        isLoggedIn: isLoggedIn,
        getToken: getToken,
        setToken: setToken
    };

    var that = this;
    that.token = null;

    return factory;

    function logIn(email, password) {
        var api = $injector.get('api');

        return api('POST', 'auth/token', {
            email: email,
            password: password
        }).then(function(response) {
            that.token = response.data.data.token;
        }, function() {
            popup.error('authenticationError');

            return $q.reject(false);
        });
    }

    function isLoggedIn() {
        return that.token != null;
    }

    function getToken() {
        return that.token;
    }

    function setToken(token) {
        that.token = token;
    }
};