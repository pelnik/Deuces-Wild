// Import classes
import Hand from './modules/Hand.js';
import Deck from './modules/Deck.js';
import ScoringCalculator from './modules/ScoringCalculator.js';
import GameIntelligence from './modules/GameIntelligence.js';
import DeucesWildGame from './modules/DeucesWildGame.js';

const newGame = new DeucesWildGame(false, ['King Hearts', '3 Clubs', '3 Diamonds', '3 Spades', '3 Hearts']);

// test
console.log(`${newGame.hand}`);
const testScorer = new ScoringCalculator(false);
console.log(`number of gap ${newGame.hand.numberOfGaps().gap} ${newGame.hand.numberOfGaps().duplicates}`);
console.log(`straight: ${testScorer.getScore(newGame.hand, false)}`);

const intelCheck = new GameIntelligence();

console.log(`combo generator check: ${intelCheck.generateCombinations(3, 3)}`);
console.log(`Is this has a full house? ${ScoringCalculator.identifyFullHouse(newGame.hand)}`);

const testhand = new Hand(new Deck(), ["7 Hearts", "2 Diamonds", "Queen Hearts", "2 Clubs", "10 Hearts"]);
const testcalc = new ScoringCalculator();
console.log(`testcalc: ${testcalc.getScore(testhand)}`);
