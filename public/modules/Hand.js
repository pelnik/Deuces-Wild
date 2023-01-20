// The hand will hold 5 cards, for Deuces Wild
// defaultHand should be an array of strings specifying card
export default class Hand {
  constructor(drawDeck, defaultHand) {
    this.cards = [];
    this.drawDeck = drawDeck;
    this.deucesDeal();

    if (defaultHand !== undefined) {
      this.defaultHand = defaultHand;
      this.setDefaultHand();
    }
  }

  // Clears the hand and marks each card as undrawn
  clear() {
    this.cards.forEach((card) => {
      const cardToMark = card;
      cardToMark.drawn = false;
    });

    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  getAllCards() {
    return [...this.cards];
  }

  // Sets the default hand, keeps previously drawn cards marked as drawn
  setDefaultHand() {
    this.defaultHand.forEach((cardQuery, i) => {
      // Break out card query
      const valueSuitSplit = cardQuery.split(' ');
      const cardValue = valueSuitSplit[0];
      const cardSuit = valueSuitSplit[1];

      this.cards[i] = this.drawDeck.queryCard(cardValue, cardSuit);
    });
  }

  deucesDeal() {
    for (let i = 0; i < 5; i += 1) {
      this.addCard(this.drawDeck.drawCard());
    }
  }

  // Redeals deck, marks cards as undrawn then marks new cards as drawn
  deucesRedeal() {
    this.clear();
    for (let i = 0; i < 5; i += 1) {
      this.addCard(this.drawDeck.drawCard());
    }
  }

  // Manually replace one card, if value and suit not specified
  // The card is random undrawn card and gets marked as drawn
  // Card always marked as drawn
  replaceCard(cardIndexToReplace, value, suit) {
    if (value === undefined || suit === undefined) {
      this.cards[cardIndexToReplace] = this.drawDeck.drawCard();
    } else {
      this.cards[cardIndexToReplace] = this.drawDeck.queryCard(value, suit);
    }
  }

  // Returns only the twos in hand
  withOnlyTwos() {
    return [...this.cards].filter((potentialCard) => potentialCard.getValue() === '2');
  }

  // returns array of cards that are not twos
  withNoTwos() {
    return [...this.cards].filter((potentialCard) => potentialCard.getValue() !== '2');
  }

  // Returns hand with twos sorted last, used for scoring logic
  withTwosSortedLast() {
    return this.withNoTwos().concat(this.withOnlyTwos());
  }

  withSameValue(value) {
    return [...this.cards].filter((card) => card.getValue() === value);
  }

  // Identify if all cards are the same suit for flushes, ignores twos
  identifyAllSameSuit() {
    const handWithNoTwos = this.withNoTwos();
    const numberOfNonTwos = handWithNoTwos.length;

    function cardsWithSameSuitAsFirst(card) {
      return card.getSuit() === handWithNoTwos[0].getSuit();
    }

    const numberMatchingSuitOfFirstCard = handWithNoTwos.filter(cardsWithSameSuitAsFirst).length;

    return numberOfNonTwos === numberMatchingSuitOfFirstCard;
  }

  // Mainly used for straight calculations
  // Identifies total number of gaps between each card, testing Ace high and low
  // Knowing the gaps allows you to know if the two's will 'cover' the gaps
  // Also returns number of value duplicates, since duplicates will invalidate straight
  numberOfGaps() {
    let aceHighGap = 0;
    let aceLowGap = 0;
    let aceHighDuplicates = 0;
    let aceLowDuplicates = 0;

    // Ace property will be added in manually each test
    const cardValueDict = {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      Jack: 11,
      Queen: 12,
      King: 13,
      Ace: 14,
    };

    // Passed to array sort function to determine sorting behavior
    function arraySortFunction(a, b) {
      return cardValueDict[`${a.getValue()}`] - cardValueDict[`${b.getValue()}`];
    }

    // Check Ace High
    let sortedCards = [...this.withNoTwos()].sort(arraySortFunction);

    for (let i = 0; i < sortedCards.length - 1; i += 1) {
      const gap = cardValueDict[`${sortedCards[i + 1].getValue()}`] - cardValueDict[`${sortedCards[i].getValue()}`] - 1;

      if (gap === -1) {
        aceHighDuplicates += 1;
      } else {
        aceHighGap += gap;
      }
    }

    // Ace Low
    cardValueDict.Ace = 1;

    sortedCards = [...this.withNoTwos()].sort(arraySortFunction);

    for (let i = 0; i < sortedCards.length - 1; i += 1) {
      const gap = cardValueDict[`${sortedCards[i + 1].getValue()}`] - cardValueDict[`${sortedCards[i].getValue()}`] - 1;

      if (gap === -1) {
        aceLowDuplicates += 1;
      } else {
        aceLowGap += gap;
      }
    }

    if (aceHighDuplicates === 0 && aceHighGap < aceLowGap) {
      return {
        duplicates: aceHighDuplicates,
        gap: aceHighGap,
      };
    }

    return {
      duplicates: aceLowDuplicates,
      gap: aceLowGap,
    };
  }

  toString() {
    return `${this.cards}`;
  }
}
