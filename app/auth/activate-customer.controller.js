export default class ActivateCustomerController {
  constructor(api, $stateParams, popup) {
    'ngInject';

    this.api = api;
    this.popup = popup;

    const token = $stateParams.token;

    this.api.post('auth/activationTokens', { token })
      .success(() => this.popup.default('activationSuccessTitle', 'activationSuccess'))
      .error(() => this.popup.default('activationErrorTitle', 'activationError'));
  }
}
