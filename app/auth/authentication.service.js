export default class Authentication {
    /*@ngInject*/
    constructor($injector, $q, popup) {
        this.$injector = $injector;
        this.$q = $q;
        this.popup = popup;

        this.token = '';
    }

    logIn(email, password) {
        return this.$injector.get('api').send('POST', 'auth/token', {
            email,
            password
        })
            .then(
                response => {
                    this.token = response.data.data.token;
                },
                () => {
                    this.popup.error('authenticationError');

                    return this.$q.reject(false);
                }
            );
    }

    isLoggedIn() {
        return this.token != null;
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
    }
}
