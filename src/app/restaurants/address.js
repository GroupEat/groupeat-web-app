export default class Address {
  constructor(street, city, details) {
    this.street = street;
    this.city = city;
    this.details = details;
  }

  toString() {
    if (this.isProto204(this.details)) {
      return 'Proto204 (204 Rue André Ampère, 91440 Bures-sur-Yvette)';
    }

    let str = this.street + ', ' + this.city;

    if (this.details) {
      str = str + ' (' + this.details + ')';
    }

    return str;
  }

  isProto204(details) { // TODO: remove when Proto event is done
    if (!details) {
      return false;
    }

    return details.match(/(#|@)(proto|proto204|kite)\b/i);
  }
}
