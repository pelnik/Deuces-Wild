import Hand from "../modules/Hand.js";
import Deck from "../modules/Deck.js";
import ScoringCalculator from "../modules/ScoringCalculator.js";


test('Test Check', () => {
  const newDeck = new Deck();
  expect(newDeck.getEntireDeck().length).toBe(52);
})

test('Nat Royal Flush Check', () => {
  const hand = new Hand(new Deck(), ["Ace Hearts", "King Hearts", "Queen Hearts", "Jack Hearts", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(800);
})

test('Nat Royal Flush Check 2', () => {
  const hand = new Hand(new Deck(), ["Ace Hearts", "King Diamonds", "Queen Hearts", "Jack Hearts", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(2);
})

test('Wild Royal Flush Check 1', () => {
  const hand = new Hand(new Deck(), ["Ace Hearts", "2 Diamonds", "Queen Hearts", "Jack Hearts", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(25);
})

test('Wild Royal Flush Check 2', () => {
  const hand = new Hand(new Deck(), ["Ace Hearts", "2 Diamonds", "Queen Hearts", "2 Clubs", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(25);
})

test('Straight Flush Check 1', () => {
  const hand = new Hand(new Deck(), ["9 Hearts", "2 Diamonds", "Queen Hearts", "2 Clubs", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(9);
})

test('Straight Flush Check 1', () => {
  const hand = new Hand(new Deck(), ["9 Hearts", "2 Diamonds", "Queen Hearts", "2 Clubs", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(9);
})

test('Straight Flush Check 2', () => {
  const hand = new Hand(new Deck(), ["7 Hearts", "2 Diamonds", "Queen Hearts", "2 Clubs", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(2);
})

test('Full House 1', () => {
  const hand = new Hand(new Deck(), ["9 Hearts", "2 Diamonds", "9 Clubs", "10 Clubs", "10 Hearts"]);
  const calc = new ScoringCalculator();

  expect(calc.getScore(hand)).toBe(3);
})