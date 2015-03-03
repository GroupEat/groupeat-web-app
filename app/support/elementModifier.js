angular.module("groupeat.support")
    .factory("elementModifier", elementModifier);

function elementModifier($filter, $window) {
    var factory = {
        makeValid: makeValid,
        makeInvalid: makeInvalid,
        makeDefault: makeDefault,
        key: "groupeatModifierKey"
    };

    var dom = $window.document;
    var capitalize = $filter("capitalize");

    function makeValid(element) {
        var errors = dom.getElementById(element[0].id + "errors");

        if (errors !== null)
        {
            errors.innerHTML = "";
        }
    };

    function makeInvalid(element, errorMessage) {
        var element = element[0];
        var errorsId = element.id + "errors";

        if (dom.getElementById(errorsId) === null)
        {
            var div = dom.createElement("div");
            div.setAttribute("ng-messages", element.form.name + "." + element.getAttribute("name") + ".$error");
            div.setAttribute("class", "ng-active");
            div.setAttribute("id", errorsId);
            element.parentNode.appendChild(div);
        }

        var errorsContainer = dom.getElementById(errorsId);

        errorsContainer.innerHTML = '<div ng-message="error" class="ng-scope">'
            + capitalize(errorMessage, "first")
            + "</div>";
    };

    function makeDefault(el) {
        makeValid(el);
    };

    return factory;
};
