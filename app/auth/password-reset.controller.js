export default class PasswordResetController {
  constructor (api, $routeParams, popup) {
    'ngInject'

    this.api = api
    this.popup = popup

    this.token = $routeParams.token

    this.email = ''
    this.password = ''
  }

  resetPassword () {
    this.api.post('api/auth/password', {
      email: this.email,
      password: this.password,
      token: this.token
    })
      .success(() => this.popup.defaultContentOnly('resetPasswordSuccess'))
      .error(response => this.popup.default('errorDialogTitle', response.errorKey))
  }
}
