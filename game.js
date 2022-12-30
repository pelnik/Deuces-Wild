"use strict";

const header = document.querySelector("h1");
const buttonFirstCard = document.querySelector("#firstCard");
const buttonSecondCard = document.querySelector("#secondCard");
const buttonThirdCard = document.querySelector("#thirdCard");
const buttonFourthCard = document.querySelector("#fourthCard");
const buttonFifthCard = document.querySelector("#fifthCard");

const buttons = [buttonFirstCard, buttonSecondCard, buttonThirdCard, buttonFourthCard, buttonFifthCard]

// Each card has a value, a suit, and a status of whether it's drawn or not
class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.drawn = false;
    };

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

// Deck objects to hold cards drawn and undrawn
class Deck {
    // Puts in all cards when instantiated
    constructor() {
        this.cards = [];
        this.suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
        this.values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
        for (const suit of this.suits) {
            for (const value of this.values) {
                this.cards.push(new Card(value, suit));
            }
        }
    };

    recreateDeck() { 
        this.cards = [];
        for (let suit of this.suits) {
            for (let value of this.values) {
                this.cards.push(new Card(value, suit));
            }
        }
    };

    //Returns a random undrawn card and marks it as drawn
    drawCard() {
        const undrawnCards = [...this.cards].filter((potentialCard) => {
            return potentialCard.drawn === false
        }
        );

        const drawnCard = undrawnCards[Math.floor(Math.random() * undrawnCards.length)];
        drawnCard.drawn = true;

        return drawnCard;
    }

    // Return a specific card in the deck, drawn or undrawn
    queryCard(value, suit) {
        for (const card of this.cards) {
            if (card.getValue() === value && card.getSuit() === suit) {
                return card;
            }
        }
        
        // Only runs if function doesn't return a card
        throw new Error("Card not queried, give 'Value Suit'");
    }

    // Just returns the card array to iterate through without twos
    drawEntireDeckWithoutTwosArray() {
        return [...this.cards].filter((potentialCard) => {
            return potentialCard.value !== "2"
        })
    }

    toString() {
        return `${this.cards}`
    }
}




// The hand will hold 5 cards, for Deuces Wild
class Hand {
    constructor(drawDeck) {
        this.cards = [];
        this.drawDeck = drawDeck;
        this.deucesDeal();
    };

    clear() {
        this.cards = []
    };

    addCard(card) {
        card.handPosition = this.cards.length - 1;
        this.cards.push(card);
    };

    getAllCards() {
        return [...this.cards];
    };

    deucesDeal() {
        for (let i = 0; i < 5; i++) {
            this.addCard(this.drawDeck.drawCard());
        }
    };

    // Redeals deck
    deucesRedeal() {
        this.clear();
        for (let i = 0; i < 5; i++) {
            this.addCard(this.drawDeck.drawCard());
        }
    };

    // Manually replace one card, if value and suit not specified, the card is random undrawn card and gets marked as drawn
    replaceCard(cardIndexToReplace, value, suit) {
        if (value === undefined || suit === undefined) {
            this.cards[cardIndexToReplace] = this.drawDeck.drawCard();
        } else {
            this.cards[cardIndexToReplace] = this.drawDeck.queryCard(value, suit);
        }
    }

    // Returns only the twos in hand
    withOnlyTwos() {
        return [...this.cards].filter((potentialCard) => {
            return potentialCard.getValue() === "2"
        })
    }

    // returns array of cards that are not twos
    withNoTwos() {
        return [...this.cards].filter((potentialCard) => {
            return potentialCard.getValue() !== "2"
        })
    }


    // Returns hand with twos sorted last, used for scoring logic
    withTwosSortedLast() {
        return this.withNoTwos().concat(this.withOnlyTwos());
    }


    // Identify if all cards are the same suit for flushes, ignores twos
    identifyAllSameSuit() {
        const handWithNoTwos = this.withNoTwos();
        const numberOfNonTwos = handWithNoTwos.length;

        const numberMatchingSuitOfFirstCard = handWithNoTwos.filter((card) => {
            return card.getSuit() === handWithNoTwos[0].getSuit()
        }).length;

        return numberOfNonTwos === numberMatchingSuitOfFirstCard;
    }

    // Mainly used for straight calculations, identifies total number of gaps between each card, testing Ace high and low
    // Knowing the gaps allows you to know if the two's will "cover" the gaps
    // Also returns number of value duplicates, since duplicates will invalidate straight
    numberOfGaps() {
        let aceHighGap = 0;
        let aceLowGap = 0;
        let aceHighDuplicates = 0;
        let aceLowDuplicates = 0;

        
        // Ace property will be added in manually each test
        const cardValueDict = {
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 9,
            "10": 10,
            "Jack": 11,
            "Queen": 12,
            "King": 13,
            "Ace": 14
        };

        // Passed to array sort function to determine sorting behavior
        function arraySortFunction(a, b) {
            return cardValueDict[`${a.getValue()}`] - cardValueDict[`${b.getValue()}`];
        }

        // Check Ace High
        let sortedCards = [...this.withNoTwos()].sort(arraySortFunction);
                
        for (let i=0; i < sortedCards.length - 1; i++) {
            const gap = cardValueDict[`${sortedCards[i + 1].getValue()}`] - cardValueDict[`${sortedCards[i].getValue()}`] - 1;
            
            if (gap === -1) {
                aceHighDuplicates += 1;
            } else {
                aceHighGap += gap;
            };
        };

        
        // Ace Low
        cardValueDict["Ace"] = 1;

        sortedCards = [...this.withNoTwos()].sort(arraySortFunction);
        
        for (let i=0; i < sortedCards.length - 1; i++) {
            const gap = cardValueDict[`${sortedCards[i + 1].getValue()}`] - cardValueDict[`${sortedCards[i].getValue()}`] - 1;
            
            if (gap === -1) {
                aceLowDuplicates += 1;
            } else {
                aceLowGap += gap;
            };
        };

        if (aceHighDuplicates === 0 && aceHighGap < aceLowGap) {
            return {
                duplicates: aceHighDuplicates,
                gap: aceHighGap
            }
        } else {
            return {
                duplicates: aceLowDuplicates,
                gap: aceLowGap
            }
        }
    }

    toString() {
        return `${this.cards}`;
    }
}

// A separate class will be used to manage the scoring DOM elements and caclulations.
// handScores will take in an array of payouts for future game modes
class scoringCalculator {
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
                threeOfAKind: 1
            }
        } else {
            this.handScores = handScores;
        }
    }



    // Returns true if hand is a royal flush
    identifyNatRoyalFlush(hand) {
        let suit;
        const cardsDrawn = {
            "Ace": 0,
            "King": 0,
            "Queen": 0,
            "Jack": 0,
            "10": 0
        }

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
            return card.getValue() === "2"
        }).length === 4) {
            return true
        } else {
            return false
        }
    }

    identifyWildRoyalFlush(hand) {
        let suit;
        const cardsDrawn = {
            "Ace": 0,
            "King": 0,
            "Queen": 0,
            "Jack": 0,
            "10": 0
        }

        let count = 0;
        for (const eachCard of hand.withTwosSortedLast()) {
            if (count === 0) {
                suit = eachCard.getSuit();
            }

            // If card value has already been drawn or doesn't have the same suit as first card, immediately returns false
            if ((eachCard.getSuit() !== suit || cardsDrawn[`${eachCard.getValue()}`] !== 0) && eachCard.getValue() !== "2") {
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
            return (card.getValue() === allCards[0].getValue() || card.getValue() === "2")
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
            return (card.getValue() === allCards[0].getValue() || card.getValue() === "2")
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
            return (card.getValue() === allCards[0].getValue() || card.getValue() === "2")
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
        } else if (this.identifyFourDeuces(hand) === true) {
            return this.handScores.fourDeuces;
        } else if (this.identifyWildRoyalFlush(hand) === true) {
            return this.handScores.wildRoyalFlush;
        } else if (this.identifyFiveOfAKind(hand) === true) {
            return this.handScores.fiveOfAKind;
        } else if (this.identifyStraightFlush(hand) === true) {
            return this.handScores.straightFlush;
        } else if (this.identifyFourOfAKind(hand) === true) {
            return this.handScores.fourOfAKind;
        } else if (this.identifyFullHouse(hand) === true) {
            return this.handScores.fullHouse;
        } else if (this.identifyFlush(hand) === true) {
            return this.handScores.flush;
        } else if (this.identifyStraight(hand) === true) {
            return this.handScores.straight;
        } else if (this.identifyThreeOfAKind(hand) === true) {
            return this.handScores.threeOfAKind;
        } else {
            return 0;
        }
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

// The good stuff, this object will calculate best hands, EV of hands, track history, etc. Will contain the "intelligent" parts of the game
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

        this.buttonIDs = ["firstCard","secondCard","thirdCard","fourthCard","fifthCard"];
        this.submitButton = document.querySelector("#submitButton");
        this.cardsSubmitted = false;
    }


    // We'll regenerate buttons in case multiple games are called. This will remove event listeners
    // Does not have any card based interactions
    createNewGameButtons() {
        for (let i=0; i<5; i++) {
            const newButton = document.createElement("button");
            const buttonElementParent = document.querySelector("#buttonParent");

            newButton.className = "unselectedCard";
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
            button.addEventListener("click", this.onClickButtonChange);
        };

    }

    listenForSubmitClicks() {
        this.submitButton.addEventListener("click", this.onSubmitButtonClick.bind(this))
    }

    // Change card buttons
    onClickButtonChange(evt) {
        if (evt.target.className === "unselectedCard") {
            evt.target.className = "selectedCard";           
        } else {
            evt.target.className = "unselectedCard";
        }

    }

    // Adds the submit label and returns it
    addSubmitLabel(score) {
        const submitLabel = document.createElement("label");
        submitLabel.textContent = `Great job! Score: ${score}`;
        
        // Get parent div for submit button
        const parentSubmitDiv = document.querySelector("#parentSubmitButton");
        parentSubmitDiv.appendChild(submitLabel);

        return submitLabel;
    }


    onSubmitButtonClick(evt) {
        const selectedCards = [false, false, false, false, false]
        const selectedDOMCards = document.querySelectorAll(".selectedCard");


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
        const buttonParentClone = document.querySelector("#buttonParent").cloneNode(true);
        const sidebarHeading = document.querySelector(".scoreSidebar h1");

        sidebarHeading.after(buttonParentClone);
        buttonParentClone.className = "scoreHand";
        buttonParentClone.id = "oldButtonParent";


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
// testCards will take an array that with string "Value Suit" that will manually set cards for testing
class deucesWildGame {
    constructor(DOMless, buttons, testCards) {
        this.DOMless = DOMless;
        this.buttons = buttons;
        this.testCards = testCards;

        this.deck = new Deck();        
        this.hand = new Hand(this.deck);

        this.DOMManager = new DOMManager(this.buttons, this);
        this.scoringCalculator = new scoringCalculator(false);

        this.DOMManager.createNewGameButtons();
        this.testCardReplacer(testCards);
        this.DOMManager.setButtonsToCards(this.hand);
        this.DOMManager.listenForCardClicks();
        this.DOMManager.listenForSubmitClicks();
    };


    // Will replace cards with testCards as needed since hand is dealt on creation
    // Will take any siize array with elementrs "Value Suit"
    testCardReplacer(testCards) {
        if (testCards !== undefined) {
            for (let i = 0; i < 5; i++) {
                if (testCards[i] !== undefined) {
                    const value = testCards[i].split(" ")[0];                
                    const suit = testCards[i].split(" ")[1];
    
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

            console.log(`on Submit score: ${this.scoringCalculator.getScore(this.hand)}`)
            const scoreLabel = this.DOMManager.addSubmitLabel(this.scoringCalculator.getScore(this.hand));

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


let newGame = new deucesWildGame(false, buttons, ["King Hearts", "Queen Hearts","10 Hearts", "Ace Hearts", "Jack Hearts"]);

// test
console.log(`${newGame.hand}`);
const testScorer = new scoringCalculator(false);
console.log(`${testScorer.identifyFiveOfAKind(newGame.hand, false)}`);
console.log(`number of gap ${newGame.hand.numberOfGaps().gap} ${newGame.hand.numberOfGaps().duplicates}`);
console.log(`straight: ${testScorer.getScore(newGame.hand, false)}`);

const intelCheck = new GameIntelligence();

console.log(`combo generator check: ${intelCheck.generateCombinations(3, 3)}`);