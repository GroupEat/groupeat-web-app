export default class ActivateCustomerController {
  constructor(api, $stateParams, popup) {
    'ngInject';

    const token = $stateParams.token;

    api.post('auth/activationTokens', {token})
      .success(() => popup.default('activationSuccessTitle', 'activationSuccess'))
      .error(() => popup.default('activationErrorTitle', 'activationError'));
  }
}
