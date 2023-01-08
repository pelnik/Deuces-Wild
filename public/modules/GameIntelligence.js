/* eslint-disable */
/* still in dev */
// The good stuff, this object will calculate best hands, EV of hands, track history, etc. Will contain the 'intelligent' parts of the game
export default class GameIntelligence {
  contructor() {
  }

  // Generate an array of arrays.
  // Each child array is a combination of boolean values of a certain size;
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
    let allNonTwoCombinations = [];

    allNonTwoCombinations = this.generateCombinations(sizeOfHandWithNoTwos, sizeOfHandWithNoTwos);

  }
}
