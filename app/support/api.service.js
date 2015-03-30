export class Api {
    /*@ngInject*/
    constructor($http, authentication) {
        this.$http = $http;
        this.authentication = authentication;
    }

    send(method, url ,data) {
        let request = {
            method: method,
            url: '/api/' + url,
            headers: {
                Accept: 'application/vnd.groupeat.v1+json'
            }
        };

        if (method !== 'GET') {
            request.data = data;
        }

        if (this.authentication.isLoggedIn()) {
            request.headers.Authorization = 'bearer ' + this.authentication.getToken();
        }

        return this.$http(request);
    }
}
