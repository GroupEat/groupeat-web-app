export default class LogInController {
  constructor(auth) {
    'ngInject';

    this.auth = auth;

    this.email = null;
    this.password = null;
  }

  logIn() {
    this.auth.logIn(this.email, this.password);
  }
}
