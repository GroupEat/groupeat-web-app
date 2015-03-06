require("angular-input-match");

require("angular").module("groupeat.auth", ["validation.match"])
    .controller("ActivateCustomerController", require("./activate-customer.controller"))
    .controller("PasswordResetController", require("./password-reset.controller"))
;