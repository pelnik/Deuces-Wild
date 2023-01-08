// Import classes
import Card from './modules/Card.js';
import Deck from './modules/Deck.js';
import Hand from './modules/Hand.js';
import ScoringCalculator from './modules/ScoringCalculator.js';
import GameIntelligence from './modules/GameIntelligence.js';
import DOMManager from './modules/DOMManager.js';

const header = document.querySelector('h1');
const buttonFirstCard = document.querySelector('#firstCard');
const buttonSecondCard = document.querySelector('#secondCard');
const buttonThirdCard = document.querySelector('#thirdCard');
const buttonFourthCard = document.querySelector('#fourthCard');
const buttonFifthCard = document.querySelector('#fifthCard');

const buttons = [buttonFirstCard, buttonSecondCard, buttonThirdCard, buttonFourthCard, buttonFifthCard]

// The deuces wild game will manage most of the gameflow and call DOM Manager methods as needed
// DOMless setting is for headless games calculating values
// testCards will take an array that with string 'Value Suit' that will manually set cards for testing
class deucesWildGame {
  constructor(DOMless, buttons, testCards) {
    this.DOMless = DOMless;
    this.buttons = buttons;
    this.testCards = testCards;

    this.deck = new Deck();    
    this.hand = new Hand(this.deck);

    this.DOMManager = new DOMManager(this.buttons, this);
    this.ScoringCalculator = new ScoringCalculator(false);

    this.DOMManager.createNewGameButtons();
    this.testCardReplacer(testCards);
    this.DOMManager.setButtonsToCards(this.hand);
    this.DOMManager.listenForCardClicks();
    this.DOMManager.listenForSubmitClicks();
  };


  // Will replace cards with testCards as needed since hand is dealt on creation
  // Will take any siize array with elementrs 'Value Suit'
  // Mark card as drawn, repalced cards are also drawn
  testCardReplacer(testCards) {
    if (testCards !== undefined) {
      for (let i = 0; i < 5; i++) {
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
    this.DOMManager.setButtonsToCards(this.hand);
  }


  // Game logic for on Submit, is called from DOM if DOM game
  onSubmit(selectedCards) {
    if (this.DOMless === false) {
      // Selected cards is a boolean array
      let i = 0;
      for (const cardBool of selectedCards) {
        if (cardBool === false) {
          this.hand.replaceCard(i);
        }
        i++;
      }

      console.log(`on Submit score: ${this.ScoringCalculator.getScore(this.hand)}`)
      const scoreLabel = DOMManager.addSubmitLabel(this.ScoringCalculator.getScore(this.hand));

      this.DOMManager.setButtonsToCards(this.hand);
      DOMManager.moveScoringElementsToSidebar(scoreLabel);

      this.deck = new Deck();    
      this.hand = new Hand(this.deck);
        
      this.DOMManager.createNewGameButtons();
      this.DOMManager.setButtonsToCards(this.hand);
      this.DOMManager.listenForCardClicks();
      }
}

  toString() {
    return `Game hand: ${this.hand}; Game DOMless: ${this.DOMless}`;
  }
}


let newGame = new deucesWildGame(false, buttons, ['King Hearts', '3 Clubs','3 Diamonds', '3 Spades', '3 Hearts']);

// test
console.log(`${newGame.hand}`);
const testScorer = new ScoringCalculator(false);
console.log(`number of gap ${newGame.hand.numberOfGaps().gap} ${newGame.hand.numberOfGaps().duplicates}`);
console.log(`straight: ${testScorer.getScore(newGame.hand, false)}`);

const intelCheck = new GameIntelligence();

console.log(`combo generator check: ${intelCheck.generateCombinations(3, 3)}`);
console.log(`Is this has a full house? ${ScoringCalculator.identifyFullHouse(newGame.hand)}`)