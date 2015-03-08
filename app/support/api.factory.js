/*@ngInject*/
module.exports = function($http, $location, authentication) {
    var factory = makeRequest;

    return factory;

    function makeRequest(method, url, data) {
        var request = {
            method: method,
            url: 'https://' + $location.host() + '/api/' + url,
            headers: {
                Accept: 'application/vnd.groupeat.v1+json'
            }
        };

        if (method !== 'GET') {
            request.data = data;
        }

        if (authentication.isLoggedIn()) {
            request.headers.Authorization = 'bearer ' + authentication.getToken();
        }

        return $http(request);
    }
};
