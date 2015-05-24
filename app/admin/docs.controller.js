export default class DocsController {
    constructor(api, $window, authentication, $location) {
        'ngInject';

        this.api = api;
        this.authentication = authentication;
        this.$location = $location;

        this.dom = $window.document;

        this.email = '';
        this.password = '';

        if (this.$location.host() === 'groupeat.dev') {
            this.email = 'admin@groupeat.fr';
            this.password = 'groupeat';
            this.logIn();
        }
    }

    logIn() {
        const hash = this.$location.hash();

        this.authentication.logIn(this.email, this.password).then(() => {
            this.api.get('admin/docs').success(response => {
                if (this.$location.port() === 3474) { // Replacing the whole dom will get protractor to fail badly
                    this.dom.body.innerHTML = response;
                } else {
                    this.dom.open('text/html');
                    this.dom.write(response); // jshint ignore:line
                    this.dom.close();

                    if (hash !== '') {
                        this.dom.getElementById(hash).scrollIntoView();
                    }
                }
            });
        });
    }
}
