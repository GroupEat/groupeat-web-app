export default class Api {
    /*@ngInject*/
    constructor($http, authentication) {
        this.$http = $http;
        this.authentication = authentication;
    }

    get(url) {
        return this.send('GET', url, {});
    }

    post(url, data) {
        return this.send('POST', url, data);
    }

    put(url, data) {
        return this.send('PUT', url, data);
    }

    patch(url, data) {
        return this.send('PATCH', url, data);
    }

    delete(url, data) {
        return this.send('DELETE', url, data);
    }

    send(method, url, data) {
        let request = {
            method,
            url: `/api/${url}`,
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
