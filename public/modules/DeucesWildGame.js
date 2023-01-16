import Deck from './Deck.js';
import Hand from './Hand.js';
import ScoringCalculator from './ScoringCalculator.js';
import DOMManager from './DOMManager.js';

// The deuces wild game will manage most of the gameflow and call DOM Manager methods as needed
// DOMless setting is for headless games calculating values
// testCards will take an array that with string 'Value Suit'
// that will manually set cards for testing
export default class DeucesWildGame {
  constructor(DOMless, testCards) {
    this.DOMless = DOMless;
    this.testCards = testCards;

    this.deck = new Deck();
    this.hand = new Hand(this.deck);

    this.DOMManager = new DOMManager(this);
    this.ScoringCalculator = new ScoringCalculator(false);

    this.DOMManager.createNewGameButtons();
    this.testCardReplacer(testCards);
    this.DOMManager.setImagesToCards(this.hand);
    this.DOMManager.listenForCardClicks();
    this.DOMManager.listenForSubmitClicks();
  }

  // Will replace cards with testCards as needed since hand is dealt on creation
  // Will take any siize array with elementrs 'Value Suit'
  // Mark card as drawn, repalced cards are also drawn
  testCardReplacer(testCards) {
    if (testCards !== undefined) {
      for (let i = 0; i < 5; i += 1) {
        if (testCards[i] !== undefined) {
          const value = testCards[i].split(' ')[0];
          const suit = testCards[i].split(' ')[1];

          this.hand.replaceCard(i, value, suit);
        }
      }
    }
  }

  // Needed in case I need a restart of the game function
  restartDeucesHand() {
    this.deck.recreateDeck();
    this.hand.deucesDeal();
    this.DOMManager.setImagesToCards(this.hand);
  }

  // Game logic for on Submit, is called from DOM if DOM game
  onSubmit(selectedCards) {
    if (this.DOMless === false) {
      // Selected cards is a boolean array
      selectedCards.forEach((cardBool, i) => {
        if (cardBool === false) {
          this.hand.replaceCard(i);
        }
      });

      const scoreLabel = DOMManager.addSubmitLabel(this.ScoringCalculator.getScore(this.hand));

      this.DOMManager.setImagesToCards(this.hand);
      this.DOMManager.moveScoringElementsToSidebar(scoreLabel);

      this.deck = new Deck();
      this.hand = new Hand(this.deck);

      this.DOMManager.createNewGameButtons();
      this.DOMManager.setImagesToCards(this.hand);
      this.DOMManager.listenForCardClicks();
    }
  }

  toString() {
    return `Game hand: ${this.hand}; Game DOMless: ${this.DOMless}`;
  }
}
