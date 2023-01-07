import Card from './Card.js';

// Deck objects to hold cards drawn and undrawn
export default class Deck {
  // Puts in all cards when instantiated
  constructor() {
    this.cards = [];
    this.suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
    this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

    this.suits.forEach((suit) => {
      this.values.forEach((value) => {
        this.cards.push(new Card(value, suit));
      });
    });
  }

  recreateDeck() {
    this.cards = [];

    this.suits.forEach((suit) => {
      this.value.forEach((value) => {
        this.cards.push(new Card(value, suit));
      });
    });
  }

  // Returns a random undrawn card and marks it as drawn
  drawCard() {
    const undrawnCards = [...this.cards].filter((potentialCard) => potentialCard.drawn === false);

    const drawnCard = undrawnCards[Math.floor(Math.random() * undrawnCards.length)];
    drawnCard.drawn = true;

    return drawnCard;
  }

  // Return a specific card in the deck, drawn or undrawn
  queryCard(value, suit) {
    function checkValueSuit(card) {
      return card.getValue() === value && card.getSuit() === suit;
    }

    const queriedCard = this.cards.find(checkValueSuit);

    if (queriedCard === undefined) {
      throw new Error(`Card ${value} ${suit} not queried, give "Value Suit" and use the number keys`);
    } else {
      queriedCard.drawn = true;
    }

    return queriedCard;
  }

  // Just returns the card array to iterate through without twos
  drawEntireDeckWithoutTwosArray() {
    return [...this.cards].filter((potentialCard) => potentialCard.value !== '2');
  }

  toString() {
    return `${this.cards}`;
  }
}
