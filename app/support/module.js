require("angular-capitalize-filter");

require("angular").module("groupeat.support", ["angular-capitalize-filter"])
    .factory("elementModifier", require("./elementModifier"))
;