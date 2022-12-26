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

    //Manually replace one card, drawn or undrawn, with a certain value and suit, index count starting at zero
    replaceCard(cardIndexToReplace, value, suit) {
        this.cards[cardIndexToReplace] = this.drawDeck.queryCard(value, suit);
    }

    withOnlyTwos() {
        return [...this.cards].filter((potentialCard) => {
            return potentialCard.getValue() === "2"
        })
    }

    withNoTwos() {
        return [...this.cards].filter((potentialCard) => {
            return potentialCard.getValue() !== "2"
        })
    }


    // Returns hand with twos sorted last, used for scoring logic
    withTwosSortedLast() {
        return this.withNoTwos().concat(this.withOnlyTwos());
    }


    // Identify if all cards are the same suit for flushes
    identifyAllSameSuit() {
        const handWithNoTwos = this.hand.withNoTwos();

        const numberOfNonTwos = handWithNoTwos.length;
        const numberMatchingSuitOfFirstCard = handWithNoTwos.filter((card) => {
            card.getSuit() === handWithNoTwos[0].getSuit()
        }).length;

        return numberOfNonTwos === numberMatchingSuitOfFirstCard;
    }

    // Mainly used for straight calculations, identifies total number of gaps between each card, testing Ace high and low
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
            console.log(`${cardValueDict[`${a.getValue()}`] - cardValueDict[`${a.getValue()}`]}`)
        }

        // Check Ace High
        let sortedCards = [...this.withNoTwos()].sort(arraySortFunction);
        
        console.log(`sortedCards ${sortedCards}`)
        
        for (let i=0; i < sortedCards.length - 1; i++) {
            const gap = cardValueDict[`${sortedCards[i + 1].getValue()}`] - cardValueDict[`${sortedCards[i].getValue()}`] - 1;
            
            if (gap === -1) {
                aceHighDuplicates += 1;
            } else {
                aceHighGap += gap;
            };

            console.log(`aceHighGap ${aceHighGap}`);
            console.log(`ace high Duplicates ${aceHighDuplicates}`);
        };

        
        // Ace Low
        cardValueDict["Ace"] = 1;

        sortedCards = [...this.withNoTwos()].sort(arraySortFunction);

        console.log(`sortedCards ${sortedCards}`);
        
        for (let i=0; i < sortedCards.length - 1; i++) {
            const gap = cardValueDict[`${sortedCards[i + 1].getValue()}`] - cardValueDict[`${sortedCards[i].getValue()}`] - 1;
            
            if (gap === -1) {
                aceLowDuplicates += 1;
            } else {
                aceLowGap += gap;
            };

            console.log(`aceLowGap ${aceLowGap}`);
            console.log(`acelowDuplicates ${aceLowDuplicates}`);
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
// Odds will take in an array of payouts for future game modes
class scoringCalculator {
    constructor(hand, DOMless, odds) {
        if (odds === undefined) {
            this.hand = hand;
            this.DOMless = DOMless;

            this.odds = {
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
            this.odds = odds;
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
                console.log(`false ${eachCard.getValue()} ${suit} ${eachCard.getSuit()}`);
                return false;
            } else if (count !== 4) {
                cardsDrawn[`${eachCard.getValue()}`] = 1;
                console.log(`true ${eachCard.getValue()}`);
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
                console.log(`false ${eachCard.getValue()} ${suit} ${eachCard.getSuit()}`);
                return false;
            } else if (count !== 4) {
                cardsDrawn[`${eachCard.getValue()}`] = 1;
                console.log(`true ${eachCard.getValue()}`);
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
}

// The DOMManager will manage all interactions with the buttons and game screen
class DOMManager {
    constructor(hand, buttons, gameParent) {
        this.hand = hand;
        this.buttons = buttons;

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
    // if testCards have been passed, will assign those cards instead
    setButtonsToCards() {
        for (let i = 0; i < 5; i++) {
            this.buttons[i].textContent = `${this.hand.getAllCards()[i]}`;
        }
    }

    // Add onClick event listeners for cards and submit
    listenForCardClicks() {
        for (const button of buttons) {
            button.addEventListener("click", this.onClickButtonChange);
        };

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


    onSubmitButtonClick(evt) {
        const selectedCards = document.querySelectorAll(".selectedCard");


        for (const cardNode of selectedCards) {
            console.log(`${cardNode.id}`);
            console.log(`test`);

            const cardIndex = this.buttonIDs.indexOf(`${cardNode.id}`);
            console.log(`${cardIndex}`)
        }
        
        console.log(`${selectedCards}`);



        const submitLabel = document.createElement("label");
        submitLabel.textContent = "Great job!";
        evt.target.after(submitLabel);
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
        this.DOMManager = new DOMManager(this.hand, this.buttons, self);
        this.scoringCalculator = new scoringCalculator(this.hand, false);




        this.DOMManager.createNewGameButtons();
        this.testCardReplacer(testCards);
        this.DOMManager.setButtonsToCards();
        this.DOMManager.listenForCardClicks();
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
        this.DOMManager.setButtonsToCards();
    }
}


let newGame = new deucesWildGame(false, buttons, ["King Hearts", "2 Clubs", "Ace Spades", "3 Diamonds", "2 Spades"]);

// test
console.log(`${newGame.hand}`);
const testScorer = new scoringCalculator(false);
console.log(`${testScorer.identifyFiveOfAKind(newGame.hand, false)}`);
console.log(`number of gap ${newGame.hand.numberOfGaps().gap} ${newGame.hand.numberOfGaps().duplicates}`);
