export class DocsController {
    /*@ngInject*/
    constructor(api, $window, authentication, $location) {
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
                this.dom.open('text/html');
                this.dom.write(response); // jshint ignore:line
                this.dom.close();

                if (hash !== '') {
                    this.dom.getElementById(hash).scrollIntoView();
                }
            });
        });
    }
}
