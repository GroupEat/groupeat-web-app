export default class ElementModifier {
    constructor($filter, $window) {
        'ngInject';

        this.capitalize = $filter('capitalize');
        this.dom = $window.document;

        this.key = 'groupeatModifierKey';
    }

    makeValid(element) {
        let errors = this.dom.getElementById(`${element[0].id}-errors`);

        if (errors != null) {
            errors.innerHTML = '';
        }
    }

    makeInvalid(element, errorMessage) {
        element = element[0];
        let errorsId = `${element.id}-errors`;

        if (this.dom.getElementById(errorsId) === null) {
            var div = this.dom.createElement('div');
            div.setAttribute('ng-messages', element.form.name + '.' + element.getAttribute('name') + '.$error');
            div.setAttribute('class', 'ng-active');
            div.setAttribute('id', errorsId);
            element.parentNode.appendChild(div);
        }

        let errorsContainer = this.dom.getElementById(errorsId);

        errorsContainer.innerHTML = '<div ng-message=\'error\' class=\'ng-scope\'>' +
            this.capitalize(errorMessage, 'first') +
            '</div>';
    }

    makeDefault(el) {
        this.makeValid(el);
    }
}
