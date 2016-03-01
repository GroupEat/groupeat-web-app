export default class Money {
  constructor(amount) {
    this.amount = amount;
  }

  applyDiscount(rate) {
    return new Money(Math.round(this.amount * (1 - rate / 100)));
  }

  toString() {
    return (parseFloat(this.amount) / 100).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  }
}
