// A separate class will be used to manage the scoring DOM elements and calculations.
// handScores will take in an array of payouts for future game modes
export default class ScoringCalculator {
  constructor(DOMless, handScores) {
    if (handScores === undefined) {
      this.DOMless = DOMless;

      this.handScores = {
        natRoyalFlush: 800,
        fourDeuces: 200,
        wildRoyalFlush: 25,
        fiveOfAKind: 15,
        straightFlush: 9,
        fourOfAKind: 5,
        fullHouse: 3,
        flush: 2,
        straight: 2,
        threeOfAKind: 1,
      };
    } else {
      this.handScores = handScores;
    }
  }

  // Returns true if hand is a royal flush
  static identifyNatRoyalFlush(hand) {
    // This will track how many times each value is in hand.
    const cardsDrawn = {
      Ace: 0,
      King: 0,
      Queen: 0,
      Jack: 0,
      10: 0,
    };

    // Natural royal flush by definition can't have twos
    // Check suit and check if there are any twos reject if not all same
    const onlyTwos = hand.withOnlyTwos();
    if (!hand.identifyAllSameSuit() || onlyTwos.length !== 0) {
      return false;
    }

    // Check values of cards and check that each is found and is not drawn twice
    const allCards = hand.getAllCards();
    const allRoyalCheck = allCards.map((card) => {
      const cardValue = card.getValue();
      const isRoyalValue = cardsDrawn[cardValue];

      if (isRoyalValue !== undefined) {
        cardsDrawn[cardValue] += 1;
      }

      return isRoyalValue;
    });

    // Check if all returned zero, meaning none were drawn twice, or not in the Royal Cards object
    if (allRoyalCheck.every((isRoyalValue) => isRoyalValue === 0)) {
      return true;
    }

    return false;
  }

  static identifyFourDeuces(hand) {
    // Filters to cards with value of two and checks if length is 4
    const onlyTwos = hand.withOnlyTwos();

    return onlyTwos.length === 4;
  }

  static identifyWildRoyalFlush(hand) {
    const cardsDrawn = {
      Ace: 0,
      King: 0,
      Queen: 0,
      Jack: 0,
      10: 0,
    };

    // Check suit
    if (!hand.identifyAllSameSuit()) {
      return false;
    }

    // Check values of cards and check that each is found and is not drawn twice
    // Twos don't need to be checked, they'll fill in where needed
    const noTwos = hand.withNoTwos();
    const allRoyalCheck = noTwos.map((card) => {
      const cardValue = card.getValue();
      const isRoyalValue = cardsDrawn[cardValue];

      if (isRoyalValue !== undefined) {
        cardsDrawn[cardValue] += 1;
      }

      return isRoyalValue;
    });

    // Check if all returned zero, meaning none were drawn twice, or not in the Royal Cards object
    if (allRoyalCheck.every((isRoyalValue) => isRoyalValue === 0)) {
      return true;
    }

    return false;
  }

  static identifyFiveOfAKind(hand) {
    const allCards = hand.withTwosSortedLast();

    const firstCardValue = allCards[0].getValue();
    function fiveOfAKindFilter(card) {
      return card.getValue() === firstCardValue || card.getValue() === '2';
    }

    const numberOfCardsMatchingValue = [...allCards].filter(fiveOfAKindFilter).length;

    if (numberOfCardsMatchingValue === 5) {
      return true;
    }

    return false;
  }

  // Identifies straight flushes
  static identifyStraightFlush(hand) {
    // Checks if all non-two cards are the same suit
    if (hand.identifyAllSameSuit() === false) {
      return false;
    }

    const numOfGapsObject = hand.numberOfGaps();

    if (numOfGapsObject.duplicates !== 0) {
      return false;
    }
    if (numOfGapsObject.gap > hand.withOnlyTwos().length) {
      return false;
    }

    return true;
  }

  static identifyFourOfAKind(hand) {
    const allCards = hand.withTwosSortedLast();

    const firstCardValue = allCards[0].getValue();
    function fiveOfAKindFilter(card) {
      return card.getValue() === firstCardValue || card.getValue() === '2';
    }

    const numberOfCardsMatchingValue = [...allCards].filter(fiveOfAKindFilter).length;

    if (numberOfCardsMatchingValue === 4) {
      return true;
    }

    return false;
  }

  static identifyFullHouse(hand) {
    // Tests if only two numbers exist of the non-Twos.
    // Will ensure that four of a value doesn't exist.
    // Shouldn't practically matter since four of a kind
    // will always be checked first, but better to be defensive!
    const numberOfEachValue = {};

    hand.withNoTwos().forEach((card) => {
      const cardValue = card.getValue();
      if (Object.hasOwn(numberOfEachValue, cardValue)) {
        numberOfEachValue[cardValue] += 1;
      } else {
        numberOfEachValue[cardValue] = 1;
      }
    });

    const fourOfAnyValueCheck = Object.values(numberOfEachValue).some((value) => value === 4);

    if (Object.values(numberOfEachValue).length > 2 || fourOfAnyValueCheck === true) {
      return false;
    }

    // If passed all above, return true
    return true;
  }

  // Wrapper for all same suit hand method, for consistency
  static identifyFlush(hand) {
    return hand.identifyAllSameSuit();
  }

  static identifyStraight(hand) {
    const numOfGapsObject = hand.numberOfGaps();
    const numOfTwosInHand = hand.withOnlyTwos().length;

    if (numOfTwosInHand < numOfGapsObject.gap || numOfGapsObject.duplicates !== 0) {
      return false;
    }

    return true;
  }

  static identifyThreeOfAKind(hand) {
    const allCards = hand.withTwosSortedLast();

    const firstCardValue = allCards[0].getValue();
    function threeOfAKindFilter(card) {
      return card.getValue() === firstCardValue || card.getValue() === '2';
    }

    const numberOfCardsMatchingValue = [...allCards].filter(threeOfAKindFilter).length;

    if (numberOfCardsMatchingValue === 3) {
      return true;
    }

    return false;
  }

  // Returns the score of hand passed in using handScores
  getScore(hand) {
    if (ScoringCalculator.identifyNatRoyalFlush(hand) === true) {
      return this.handScores.natRoyalFlush;
    }
    if (ScoringCalculator.identifyFourDeuces(hand) === true) {
      return this.handScores.fourDeuces;
    }
    if (ScoringCalculator.identifyWildRoyalFlush(hand) === true) {
      return this.handScores.wildRoyalFlush;
    }
    if (ScoringCalculator.identifyFiveOfAKind(hand) === true) {
      return this.handScores.fiveOfAKind;
    }
    if (ScoringCalculator.identifyStraightFlush(hand) === true) {
      return this.handScores.straightFlush;
    }
    if (ScoringCalculator.identifyFourOfAKind(hand) === true) {
      return this.handScores.fourOfAKind;
    }
    if (ScoringCalculator.identifyFullHouse(hand) === true) {
      return this.handScores.fullHouse;
    }
    if (ScoringCalculator.identifyFlush(hand) === true) {
      return this.handScores.flush;
    }
    if (ScoringCalculator.identifyStraight(hand) === true) {
      return this.handScores.straight;
    }
    if (ScoringCalculator.identifyThreeOfAKind(hand) === true) {
      return this.handScores.threeOfAKind;
    }

    return 0;
  }

  // This will give an expected score of a certain hand within a certain
  // confidence interval, given out of 100, (99.9 receommended)
  // runScoringIterations(hand, handcombos, CI) {
  //   // The code will check the calculated confidence interval after the
  // number of iterations gone by for each set
  //   let set = 100;
  //   expectedCI = CI === undefined ? 99.9 : CI;

  //   // This will track the score history of the hand
  //   scoreHistory = [];

  //   handWithNoTwos = hand.withNoTwos();
  //   handwithOnlyTwos = hand.withOnlyTwos();
  // }
}
