// The DOMManager will manage all interactions with the buttons and game screen
export default class DOMManager {
  constructor(gameParent) {
    this.gameParent = gameParent;

    this.imageParent = document.querySelector('#imageParent');

    const imageFirstCard = document.querySelector('#firstCard');
    const imageSecondCard = document.querySelector('#secondCard');
    const imageThirdCard = document.querySelector('#thirdCard');
    const imageFourthCard = document.querySelector('#fourthCard');
    const imageFifthCard = document.querySelector('#fifthCard');

    this.cardImages = [
      imageFirstCard,
      imageSecondCard,
      imageThirdCard,
      imageFourthCard,
      imageFifthCard,
    ];

    this.cardImageIDs = ['firstCard', 'secondCard', 'thirdCard', 'fourthCard', 'fifthCard'];
    this.submitButton = document.querySelector('#submitButton');
    this.cardsSubmitted = false;
  }

  // We'll regenerate buttons in case multiple games are called. This will remove event listeners
  // Does not have any card based interactions
  createNewGameButtons() {
    for (let i = 0; i < 5; i += 1) {
      const newcardImage = document.createElement('img');
      const imageElementParent = document.querySelector('#imageParent');

      newcardImage.className = 'unselectedCard cardImage';
      newcardImage.id = this.cardImageIDs[i];

      imageElementParent.replaceChild(newcardImage, this.cardImages[i]);
      this.cardImages[i] = newcardImage;
    }
  }

  // Update images to text values of cards
  // Updates hand value
  // if testCards have been passed, will assign those cards instead
  setImagesToCards(hand) {
    for (let i = 0; i < 5; i += 1) {
      const currentCard = hand.getAllCards()[i];
      const suitValue = `${currentCard.getValue()} ${currentCard.getSuit()}`;

      const currentDOMCard = this.cardImages[i];
      currentDOMCard.src = `/Media/${suitValue}.png`;
    }
  }

  // Add onClick event listeners for cards and submit
  listenForCardClicks() {
    this.cardImages.forEach((cardImage) => {
      cardImage.addEventListener('click', DOMManager.onClickImageChange);
    });
  }

  // Change card imagess
  static onClickImageChange(evt) {
    const event = evt;

    if (evt.target.className === 'unselectedCard cardImage') {
      event.target.className = 'selectedCard cardImage';
    } else {
      event.target.className = 'unselectedCard cardImage';
    }
  }

  listenForSubmitClicks() {
    this.submitButton.addEventListener('click', this.onSubmitButtonClick.bind(this));
  }

  // Event listener function
  onSubmitButtonClick() {
    const selectedCards = [false, false, false, false, false];
    const selectedDOMCards = document.querySelectorAll('.selectedCard');

    selectedDOMCards.forEach((DOMcardElement) => {
      const cardIndex = this.cardImageIDs.indexOf(`${DOMcardElement.id}`);
      selectedCards[cardIndex] = true;
    });

    this.gameParent.onSubmit(selectedCards);
  }

  static listenForSidebarOpenClose() {
    const sidebarArrow = document.querySelector('#sidebarArrow');
    const scoreSidebar = document.querySelector('.scoreSidebar');

    function sidebarArrowClick() {
      const fullWindow = document.getElementById('fullWindow');
      const currentColumns = window.getComputedStyle(fullWindow).gridTemplateColumns;

      // Regular expressions
      const sidebarOpenRegExp = / 320px/;
      const sidebarClosedRegExp = / 50px/;

      if (sidebarClosedRegExp.test(currentColumns)) {
        fullWindow.style.gridTemplateColumns = 'auto 320px';
        scoreSidebar.style.visibility = 'visible';
        sidebarArrow.style.transform = 'rotate(0deg)';
      } else if (sidebarOpenRegExp.test(currentColumns)) {
        fullWindow.style.gridTemplateColumns = 'auto 50px';
        scoreSidebar.style.visibility = 'hidden';
        sidebarArrow.style.transform = 'rotate(180deg)';
        sidebarArrow.style.visibility = 'visible';
      }
    }

    sidebarArrow.addEventListener('click', sidebarArrowClick);
  }

  // Adds the submit label and returns it
  // Called form game manager since hand access needed
  static addSubmitLabel(score) {
    const submitLabel = document.createElement('p');
    submitLabel.className = 'scoreLabel';

    submitLabel.textContent = `Great job! Score: ${score}`;

    // Get parent div for submit button
    const parentSubmitDiv = document.querySelector('#parentSubmitButton');
    parentSubmitDiv.appendChild(submitLabel);

    return submitLabel;
  }

  // Used after submission to save the hand history
  // Copies elemtns to the sidebar and cleans up classes and IF's so they return for DOM queries
  moveScoringElementsToSidebar(scoreLabel) {
    const imageParentClone = this.imageParent.cloneNode(true);
    const sidebarHeading = document.querySelector('.scoreSidebar h1');

    sidebarHeading.after(imageParentClone);
    imageParentClone.className = 'scoreHand';
    imageParentClone.id = 'oldImageParent';

    DOMManager.changeChildClassesToOld(imageParentClone);
    DOMManager.removeOldSidebarHands();
    imageParentClone.appendChild(scoreLabel);
  }

  static changeChildClassesToOld(imageParentClone) {
    for (let i = 0; i < imageParentClone.children.length; i += 1) {
      const child = imageParentClone.children[i];
      const childClasses = child.classList;

      // Copy the clas list because we need to modify the original while iterating through it
      const classListCopy = [...child.classList];
      for (let j = 0; j < classListCopy.length; j += 1) {
        const oldClassName = classListCopy[j];

        childClasses.remove(`${oldClassName}`);
        childClasses.add(`old${oldClassName}`);
      }

      child.id = `old${child.id}`;
    }
  }

  static removeOldSidebarHands() {
    const numberOfHandsToKeep = 10;

    const imageParents = document.querySelectorAll('.scoreHand');
    const numberOfHands = imageParents.length;

    if (numberOfHands > numberOfHandsToKeep) {
      imageParents[numberOfHands - 1].remove();
    }
  }
}
