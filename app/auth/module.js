require("angular-input-match");

require("angular").module("groupeat.auth", ["validation.match"])
    .controller("ActivateCustomerController", require("./activateCustomerController"))
    .controller("PasswordResetController", require("./passwordResetController"))
;