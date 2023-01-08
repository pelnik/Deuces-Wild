// The DOMManager will manage all interactions with the buttons and game screen
export default class DOMManager {
  constructor(buttons, gameParent) {
    this.buttons = buttons;
    this.gameParent = gameParent;

    this.buttonIDs = ['firstCard', 'secondCard', 'thirdCard', 'fourthCard', 'fifthCard'];
    this.submitButton = document.querySelector('#submitButton');
    this.cardsSubmitted = false;
  }

  // We'll regenerate buttons in case multiple games are called. This will remove event listeners
  // Does not have any card based interactions
  createNewGameButtons() {
    for (let i = 0; i < 5; i += 1) {
      const newButton = document.createElement('button');
      const buttonElementParent = document.querySelector('#buttonParent');

      newButton.className = 'unselectedCard';
      newButton.id = this.buttonIDs[i];

      buttonElementParent.replaceChild(newButton, this.buttons[i]);
      this.buttons[i] = newButton;
    }
  }

  // Update buttons to text values of cards
  // Updates hand value
  // if testCards have been passed, will assign those cards instead
  setButtonsToCards(hand) {
    for (let i = 0; i < 5; i += 1) {
      this.buttons[i].textContent = `${hand.getAllCards()[i]}`;
    }
  }

  // Add onClick event listeners for cards and submit
  listenForCardClicks() {
    this.buttons.forEach((button) => {
      button.addEventListener('click', DOMManager.onClickButtonChange);
    });
  }

  listenForSubmitClicks() {
    this.submitButton.addEventListener('click', this.onSubmitButtonClick.bind(this));
  }

  // Change card buttons
  static onClickButtonChange(evt) {
    const event = evt;

    if (evt.target.className === 'unselectedCard') {
      event.target.className = 'selectedCard';
    } else {
      event.target.className = 'unselectedCard';
    }
  }

  // Adds the submit label and returns it
  static addSubmitLabel(score) {
    const submitLabel = document.createElement('label');
    submitLabel.textContent = `Great job! Score: ${score}`;

    // Get parent div for submit button
    const parentSubmitDiv = document.querySelector('#parentSubmitButton');
    parentSubmitDiv.appendChild(submitLabel);

    return submitLabel;
  }

  onSubmitButtonClick() {
    const selectedCards = [false, false, false, false, false];
    const selectedDOMCards = document.querySelectorAll('.selectedCard');

    selectedDOMCards.forEach((DOMcardElement) => {
      const cardIndex = this.buttonIDs.indexOf(`${DOMcardElement.id}`);
      selectedCards[cardIndex] = true;
    });

    this.gameParent.onSubmit(selectedCards);
  }

  // Used after submission to save the hand history
  // Copies elemtns to the sidebar and cleans up classes and IF's so they return for DOM queries
  static moveScoringElementsToSidebar(scoreLabel) {
    const buttonParentClone = document.querySelector('#buttonParent').cloneNode(true);
    const sidebarHeading = document.querySelector('.scoreSidebar h1');

    sidebarHeading.after(buttonParentClone);
    buttonParentClone.className = 'scoreHand';
    buttonParentClone.id = 'oldButtonParent';

    // The preferred forEach syntax doesn't work on HTML collected like .children
    for (let i = 0; i < buttonParentClone.children; i += 1) {
      const child = buttonParentClone.children[i];

      child.className = `old${child.className}`;
      child.id = `old${child.id}`;
    }

    buttonParentClone.appendChild(scoreLabel);
  }
}
