export default class ActivateCustomerController {
  constructor (api, $routeParams, popup) {
    'ngInject'

    this.api = api
    this.popup = popup

    const token = $routeParams.token

    this.api.post('auth/activationTokens', { token })
      .success(() => this.popup.default('activationSuccessTitle', 'activationSuccess'))
      .error(() => this.popup.default('activationErrorTitle', 'activationError'))
  }
}
