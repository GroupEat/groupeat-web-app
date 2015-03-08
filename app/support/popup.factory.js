/*@ngInject*/
module.exports = function($mdDialog, $filter) {
    var factory = {
        default: showDefault,
        error: showError,
        defaultContentOnly: showDefaultContentOnly
    };

    return factory;

    function showDefault(title, content) {
        makePopup(function(dialog) {
            dialog.title(translate(title))
                .content(translate(content));
        });
    }

    function showError(content) {
        makePopup(function(dialog) {
            dialog.title(translate('errorPopupTitle'))
                .content(translate(content));
        });
    }

    function showDefaultContentOnly(content) {
        makePopup(function(dialog) {
            dialog.content(translate(content));
        });
    }

    function translate(key) {
        return $filter('translate')(key);
    }

    function makePopup(callback) {
        var dialog = $mdDialog.alert();
        callback(dialog);
        dialog.ok('ok');

        $mdDialog.show(dialog);
    }
};
