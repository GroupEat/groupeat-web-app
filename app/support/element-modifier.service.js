export class ElementModifier {
    /*@ngInject*/
    constructor($filter, $window) {
        this.capitalize = $filter('capitalize');
        this.dom = $window.document;

        this.key = 'groupeatModifierKey';
    }

    makeValid(element) {
        var errors = this.dom.getElementById(element[0].id + 'errors');

        if (errors != null) {
            errors.innerHTML = '';
        }
    }

    makeInvalid(element, errorMessage) {
        var element = element[0];
        var errorsId = element.id + 'errors';

        if (this.dom.getElementById(errorsId) === null) {
            var div = this.dom.createElement('div');
            div.setAttribute('ng-messages', element.form.name + '.' + element.getAttribute('name') + '.$error');
            div.setAttribute('class', 'ng-active');
            div.setAttribute('id', errorsId);
            element.parentNode.appendChild(div);
        }

        var errorsContainer = this.dom.getElementById(errorsId);

        errorsContainer.innerHTML = '<div ng-message=\'error\' class=\'ng-scope\'>' +
            this.capitalize(errorMessage, 'first') +
            '</div>';
    }

    makeDefault(el) {
        this.makeValid(el);
    }
}
