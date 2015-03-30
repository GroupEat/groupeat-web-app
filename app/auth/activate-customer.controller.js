export class ActivateCustomerController {
    /*@ngInject*/
    constructor(api, $routeParams, popup) {
        this.api = api;
        this.popup = popup;

        this.token = $routeParams.token;

        this.api.send('POST', 'auth/activationTokens', {
            token: this.token
        })
            .success(() => this.popup.default('activationSuccessTitle', 'activationSuccess'))
            .error(() => this.popup.default('activationErrorTitle', 'activationError'));
    }
}
