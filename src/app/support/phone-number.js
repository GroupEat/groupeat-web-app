export default class PhoneNumber {
  constructor(number) {
    this.number = number;
  }

  toString() {
    return `0${this.number.substring(2)}`.match(/.{1,2}/g).join('-');
  }
}
