// Each card has a value, a suit, and a status of whether it's drawn or not
export default class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;

    // This will mark if the card was drawn
    this.drawn = false;

    // This will mark if the card was drawn for iterative purposes
    // Should be unmarked immediately after tested
    this.tempDrawn = false;
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
