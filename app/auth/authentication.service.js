export default class Authentication {
  constructor($injector, $q, popup) {
    'ngInject';

    this.$injector = $injector;
    this.$q = $q;
    this.popup = popup;

    this.token = null;
  }

  logIn(email, password) {
    return this.$injector.get('api').send('POST', 'auth/token', {
      email,
      password
    })
      .then(response => {
        this.token = response.data.data.token;
      }, () => {
        this.popup.error('authenticationError');

        return this.$q.reject(false);
      }
    );
  }

  isLoggedIn() {
    return this.token !== null;
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
  }
}
