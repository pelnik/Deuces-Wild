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
  identifyNatRoyalFlush(hand) {
    let suit;
    const cardsDrawn = {
      Ace: 0,
      King: 0,
      Queen: 0,
      Jack: 0,
      10: 0,
    };

    let count = 0;
    for (const eachCard of hand.withTwosSortedLast()) {
      if (count === 0) {
        suit = eachCard.getSuit();
      }

      // If card value has already been drawn or doesn't have the same suit as first card, immediately returns false
      if (eachCard.getSuit() !== suit || cardsDrawn[`${eachCard.getValue()}`] !== 0) {
        return false;
      } else if (count !== 4) {
        cardsDrawn[`${eachCard.getValue()}`] = 1;
      } else {
        return true;
      }

      count++;
    }
  }
  
  identifyFourDeuces(hand) {
    // Filters to cards with value of two and checks if length is 4
    if (hand.getAllCards().filter((card) => {
      return card.getValue() === '2'
    }).length === 4) {
      return true;
    } else {
      return false;
    }
  }

  identifyWildRoyalFlush(hand) {
    let suit;
    const cardsDrawn = {
      'Ace': 0,
      'King': 0,
      'Queen': 0,
      'Jack': 0,
      '10': 0
    }

    let count = 0;
    for (const eachCard of hand.withTwosSortedLast()) {
      if (count === 0) {
        suit = eachCard.getSuit();
      }

      // If card value has already been drawn or doesn't have the same suit as first card, immediately returns false
      if ((eachCard.getSuit() !== suit || cardsDrawn[`${eachCard.getValue()}`] !== 0) && eachCard.getValue() !== '2') {
        return false;
      } else if (count !== 4) {
        cardsDrawn[`${eachCard.getValue()}`] = 1;
      } else {
        return true;
      }

      count++;
    }
  }

  identifyFiveOfAKind(hand) {
    const allCards = hand.withTwosSortedLast();


    if ([...allCards].filter((card) => {
      return (card.getValue() === allCards[0].getValue() || card.getValue() === '2')
    }).length === 5
    ) {
      return true
    } else {
      return false
    }
  }

  // Identifies straight flushes
  identifyStraightFlush(hand) {
    // Checks if all non-two cards are the same suit
    if (hand.identifyAllSameSuit() === false) {
      return false
    }

    const numOfGapsObject = hand.numberOfGaps();

    if (numOfGapsObject.duplicates !== 0) {
      return false;
    } else if (numOfGapsObject.gap > hand.withOnlyTwos().length) {
      return false;
    } else {
      return true
    }

  }

  identifyFourOfAKind(hand) {
    const allCards = hand.withTwosSortedLast();


    if ([...allCards].filter((card) => {
      return (card.getValue() === allCards[0].getValue() || card.getValue() === '2')
    }).length === 4
    ) {
      return true
    } else {
      return false
    }
  }


  identifyFullHouse(hand) {
    // Tests if only two numbers exist of the non-Twos. 
    // Will ensure that four of a value doesn't exist. Shouldn't practically matter since four of a kind
    // will always be checked first, but better to be defensive!
    const numberOfEachCardValue = {};

    for (const card of hand.withNoTwos()) {
      if (card.getValue() in numberOfEachCardValue) {
        numberOfEachCardValue[card.getValue()] += 1;
      } else {
        numberOfEachCardValue[card.getValue()] = 1;
      }
    }

    if (Object.keys(numberOfEachCardValue).length > 2) {
      return false;
    } else {
      // Check for four of a kind, which is not a full house
      for (const numberofEach of Object.values(numberOfEachCardValue)) {
        if (numberofEach === 4) {
          return false;
        }
      }

      // If passed all above, return true
      return true;
    }
  }
  
  // Wrapper for all same suit hand method, for consistency
  identifyFlush(hand) {
    return hand.identifyAllSameSuit();
  }

  identifyStraight(hand) {
    const numOfGapsObject = hand.numberOfGaps();
    const numOfTwosInHand = hand.withOnlyTwos().length;

    if (numOfTwosInHand < numOfGapsObject.gap || numOfGapsObject.duplicates !== 0) {
      return false
    } else {
      return true
    }
  }

  identifyThreeOfAKind(hand) {
    const allCards = hand.withTwosSortedLast();


    if ([...allCards].filter((card) => {
      return (card.getValue() === allCards[0].getValue() || card.getValue() === '2')
    }).length === 3
    ) {
      return true
    } else {
      return false
    }
  }

  // Returns the score of hand passed in using handScores
  getScore(hand) {
    if (this.identifyNatRoyalFlush(hand) === true) {
      return this.handScores.natRoyalFlush;
    }
    if (this.identifyFourDeuces(hand) === true) {
      return this.handScores.fourDeuces;
    }
    if (this.identifyWildRoyalFlush(hand) === true) {
      return this.handScores.wildRoyalFlush;
    }
    if (this.identifyFiveOfAKind(hand) === true) {
      return this.handScores.fiveOfAKind;
    }
    if (this.identifyStraightFlush(hand) === true) {
      return this.handScores.straightFlush;
    }
    if (this.identifyFourOfAKind(hand) === true) {
      return this.handScores.fourOfAKind;
    }
    if (this.identifyFullHouse(hand) === true) {
      return this.handScores.fullHouse;
    }
    if (this.identifyFlush(hand) === true) {
      return this.handScores.flush;
    }
    if (this.identifyStraight(hand) === true) {
      return this.handScores.straight;
    }
    if (this.identifyThreeOfAKind(hand) === true) {
      return this.handScores.threeOfAKind;
    }

    return 0;
  }

  // This will give an expected score of a certain hand within a certain confidence interval, given out of 100, (99.9 receommended)
  runScoringIterations(hand, handcombos, CI) {
    // The code will check the calculated confidence interval after the number of iterations gone by for each set
    let set = 100;
    expectedCI = CI === undefined ? 99.9 : CI;

    // This will track the score history of the hand
    scoreHistory = [];

    handWithNoTwos = hand.withNoTwos();
    handwithOnlyTwos = hand.withOnlyTwos();

    for (combo of handcombos) {
      
    }
  }
}
