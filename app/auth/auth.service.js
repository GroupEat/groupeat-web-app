import _ from 'lodash';

const LOCAL_STORAGE_TOKEN_KEY = 'AUTH_TOKEN';
const LOCAL_STORAGE_USER_KEY = 'AUTH_USER';

export default class Auth {
  constructor($injector, $q, $state, popup, localStorageService) {
    'ngInject';

    this.$injector = $injector;
    this.$q = $q;
    this.$state = $state;
    this.popup = popup;
    this.localStorageService = localStorageService;
  }

  handle(event, toState) {
    if (this.needToLogInFor(toState)) {
      event.preventDefault();
      this.intendedState = toState;
      this.$state.go('logIn');
    }
  }

  logIn(email, password) {
    if (this.isLoggedIn()) {
      return this.$q.when({});
    }

    return this.$injector.get('api').send('PUT', 'auth/token', {
      email,
      password
    })
      .then(response => {
        const data = response.data.data;
        this.setToken(data.token);
        this.setUser(_.pick(data, ['id', 'type']));
        this.redirectToIntendedState();
      }, () => {
        this.popup.error('authenticationError');

        return this.$q.reject(false);
      }
    );
  }

  needToLogInFor(state) {
    if (!_.has(state, 'data.authenticated') || state.data.authenticated === false) {
      return false;
    }

    if (_.has(state, 'data.authorizedUser') && state.data.authorizedUser !== this.getUserType()) {
      return true;
    }

    return false;
  }

  isLoggedIn() {
    return this.getToken() !== null && this.getUser() !== null;
  }

  logOut() {
    this.localStorageService.remove(LOCAL_STORAGE_TOKEN_KEY);
    this.localStorageService.remove(LOCAL_STORAGE_USER_KEY);
  }

  getToken() {
    return this.localStorageService.get(LOCAL_STORAGE_TOKEN_KEY);
  }

  setToken(token) {
    this.localStorageService.set(LOCAL_STORAGE_TOKEN_KEY, token);
  }

  getUserId() {
    return this.isLoggedIn() ? this.getUser().id : null;
  }

  getUserType() {
    return this.isLoggedIn() ? this.getUser().type : null;
  }

  getUser() {
    return this.localStorageService.get(LOCAL_STORAGE_USER_KEY);
  }

  setUser(user) {
    this.localStorageService.set(LOCAL_STORAGE_USER_KEY, user);
  }

  redirectToIntendedState() {
    const state = this.intendedState || 'home';

    this.$state.go(state);
  }
}
