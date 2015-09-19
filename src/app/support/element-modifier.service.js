export default class ElementModifierService {
  constructor($window) {
    'ngInject';

    this.dom = $window.document;
    this.key = 'groupeatModifierKey';
  }

  makeValid(element) {
    let errors = this.dom.getElementById(`${element[0].id}-errors`);

    if (errors !== null) {
      errors.innerHTML = '';
    }
  }

  makeInvalid(element, errorMessage) {
    const firstElement = element[0];
    let errorsId = `${firstElement.id}-errors`;

    if (this.dom.getElementById(errorsId) === null) {
      const div = this.dom.createElement('div');
      div.setAttribute('ng-messages', firstElement.form.name + '.' + firstElement.getAttribute('name') + '.$error');
      div.setAttribute('class', 'ng-active');
      div.setAttribute('id', errorsId);
      firstElement.parentNode.appendChild(div);
    }

    let errorsContainer = this.dom.getElementById(errorsId);

    errorsContainer.innerHTML = '<div ng-message=\'error\' class=\'ng-scope\'>' + errorMessage + '</div>';
  }

  makeDefault(el) {
    this.makeValid(el);
  }
}
