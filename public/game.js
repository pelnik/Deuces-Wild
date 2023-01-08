// Import classes
import Card from './modules/Card.js';
import Deck from './modules/Deck.js';
import Hand from './modules/Hand.js';
import ScoringCalculator from './modules/ScoringCalculator.js';

const header = document.querySelector('h1');
const buttonFirstCard = document.querySelector('#firstCard');
const buttonSecondCard = document.querySelector('#secondCard');
const buttonThirdCard = document.querySelector('#thirdCard');
const buttonFourthCard = document.querySelector('#fourthCard');
const buttonFifthCard = document.querySelector('#fifthCard');

const buttons = [buttonFirstCard, buttonSecondCard, buttonThirdCard, buttonFourthCard, buttonFifthCard]



// The good stuff, this object will calculate best hands, EV of hands, track history, etc. Will contain the 'intelligent' parts of the game
class GameIntelligence {
  contructor() {
  }

  // Generate an array of arrays. Each child array is a combination of boolean values of a certain size;
  // Used to iterate through for each combination of cards to hold
  // Call the function with the same two values
  generateCombinations(numberOfCards, level) {
    // Array of arrays to iterate through
    let combos = [];

    if (level === 1) {
      return [[true], [false]]
    }

    let lowerCombos = this.generateCombinations(numberOfCards, level - 1);

    for (const combo of lowerCombos) {
      combos.push([true, ...combo])
      combos.push([false, ...combo])
    }
     

    console.log(combos)
    return combos;
  }

  // This will tell the user which cards they should have kept
  calculateBestCardKeep(hand) {
    // Twos will always be kept, so those won't be checked
    const handWithNoTwos = hand.withNoTwos();
    const sizeOfHandWithNoTwos = handWithNoTwos.length;
    const allNonTwoCombinations = [];

    allNonTwoCombinations = this.generateCombinations(sizeOfHandWithNoTwos, sizeOfHandWithNoTwos);

  }
}


// The DOMManager will manage all interactions with the buttons and game screen
class DOMManager {
  constructor(buttons, gameParent) {
    this.buttons = buttons;
    this.gameParent = gameParent;

    this.buttonIDs = ['firstCard','secondCard','thirdCard','fourthCard','fifthCard'];
    this.submitButton = document.querySelector('#submitButton');
    this.cardsSubmitted = false;
  }


  // We'll regenerate buttons in case multiple games are called. This will remove event listeners
  // Does not have any card based interactions
  createNewGameButtons() {
    for (let i=0; i<5; i++) {
      const newButton = document.createElement('button');
      const buttonElementParent = document.querySelector('#buttonParent');

      newButton.className = 'unselectedCard';
      newButton.id = this.buttonIDs[i];

      buttonElementParent.replaceChild(newButton, this.buttons[i]);
      this.buttons[i] = newButton;
    }

  };

  // Update buttons to text values of cards
  // Updates hand value
  // if testCards have been passed, will assign those cards instead
  setButtonsToCards(hand) {
    for (let i = 0; i < 5; i++) {
      this.buttons[i].textContent = `${hand.getAllCards()[i]}`;
    }
  }

  // Add onClick event listeners for cards and submit
  listenForCardClicks() {
    for (const button of this.buttons) {
      button.addEventListener('click', this.onClickButtonChange);
    };

  }

  listenForSubmitClicks() {
    this.submitButton.addEventListener('click', this.onSubmitButtonClick.bind(this))
  }

  // Change card buttons
  onClickButtonChange(evt) {
    if (evt.target.className === 'unselectedCard') {
      evt.target.className = 'selectedCard';       
    } else {
      evt.target.className = 'unselectedCard';
    }

  }

  // Adds the submit label and returns it
  addSubmitLabel(score) {
    const submitLabel = document.createElement('label');
    submitLabel.textContent = `Great job! Score: ${score}`;
    
    // Get parent div for submit button
    const parentSubmitDiv = document.querySelector('#parentSubmitButton');
    parentSubmitDiv.appendChild(submitLabel);

    return submitLabel;
  }


  onSubmitButtonClick(evt) {
    const selectedCards = [false, false, false, false, false]
    const selectedDOMCards = document.querySelectorAll('.selectedCard');


    for (const DOMcardElement of selectedDOMCards) {
      const cardIndex = this.buttonIDs.indexOf(`${DOMcardElement.id}`);
      selectedCards[cardIndex] = true;
    }

    console.log(`${selectedCards}`);
    console.log(`${this.gameParent}`);
    this.gameParent.onSubmit(selectedCards);
  }

  // Used after submission to save the hand history
  // Copies elemtns to the sidebar and cleans up classes and IF's so they return for DOM queries
  moveScoringElementsToSidebar(scoreLabel) {
    const buttonParentClone = document.querySelector('#buttonParent').cloneNode(true);
    const sidebarHeading = document.querySelector('.scoreSidebar h1');

    sidebarHeading.after(buttonParentClone);
    buttonParentClone.className = 'scoreHand';
    buttonParentClone.id = 'oldButtonParent';


    for (let child of buttonParentClone.children) {
      child.className = `old${child.className}`;
      console.log(`old${child.id}`);
      child.id = `old${child.id}`;
    }

    buttonParentClone.appendChild(scoreLabel);
  }
}

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
      const scoreLabel = this.DOMManager.addSubmitLabel(this.ScoringCalculator.getScore(this.hand));

      this.DOMManager.setButtonsToCards(this.hand);
      this.DOMManager.moveScoringElementsToSidebar(scoreLabel);

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