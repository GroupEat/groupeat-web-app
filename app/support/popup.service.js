export default class Popup {
    constructor($mdDialog, $filter) {
        'ngInject';

        this.$mdDialog = $mdDialog;

        this.translate = $filter('translate');
    }

    default(title, content) {
        this.makePopup(dialog => dialog.title(this.translate(title)).content(this.translate(content)));
    }

    error(content) {
        this.makePopup(dialog => dialog.title(this.translate('errorPopupTitle')).content(this.translate(content)));
    }

    defaultContentOnly(content) {
        this.makePopup(dialog => dialog.content(this.translate(content)));
    }

    makePopup(callback) {
        const dialog = this.$mdDialog.alert();
        callback(dialog);
        dialog.ok('ok');

        this.$mdDialog.show(dialog);
    }
}
