import Deck from "../modules/Deck.js";

test('check', () => {
  const newDeck = new Deck();
  expect(newDeck.getEntireDeck().length).toBe(52);
})