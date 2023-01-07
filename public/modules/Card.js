// Each card has a value, a suit, and a status of whether it's drawn or not
export default class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
    this.drawn = false;
  }

  getSuit() {
    return this.suit;
  }

  getValue() {
    return this.value;
  }

  toString() {
    return `${this.value} of ${this.suit}`;
  }
}
