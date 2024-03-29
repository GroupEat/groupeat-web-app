export default class PasswordResetController {
  constructor(api, $stateParams, popup) {
    'ngInject';

    this.api = api;
    this.popup = popup;

    this.token = $stateParams.token;

    this.email = null;
    this.password = null;
  }

  resetPassword() {
    this.api.post('auth/password', {
      email: this.email,
      password: this.password,
      token: this.token,
    })
      .success(() => this.popup.defaultContentOnly('resetPasswordSuccess'))
      .error(response => this.popup.default('errorDialogTitle', response.errorKey));
  }
}
