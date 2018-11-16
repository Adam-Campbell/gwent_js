/*

External Interface:

Properties: 
name - {string} - the name of this card.
id - {string} - the id of this card.
image - {string} - url for the image for this card.
ownerId - {number} - the id for the player that currently owns this card.
gameRef - {object} - a reference to the main Game object.

Methods:
render() - renders this card.
renderCardBack() - renders the back of this card. 
renderJumbo() - renders a larger version of this card in a modal.

*/

class Card {
    constructor(name, id, image, ownerId, gameRef) {
        this.name = name;
        this.id = id;
        this.image = image;
        // note - owners id used instead of the actual owner object in order to avoid 
        // circular reference. 
        this.ownerId = ownerId;
        this.gameRef = gameRef
    }

    /** 
    * Constructs the HTML representation of this card
    * @param   {boolean}    inPlay - true if card is on a row, false if in hand, graveyard etc.
    * @returns {HTMLElement} a document fragment containing the HTML representation of the card.
    */
    // change this to use the options object pattern, as just seeing true or false 
    // on its own doesn't make much sense
    render(inPlay=false) {
        const imageElement = document.createElement('img');
        const imageContainer = document.createElement('div');
        imageElement.classList.add('card-image');
        imageElement.src = `images/${this.image}`;
        imageContainer.classList.add('card');
        imageContainer.dataset.cardId = this.id;
        imageContainer.appendChild(imageElement);
        imageContainer.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                this.renderJumbo();
            } else if (!inPlay && this.gameRef.activePlayer.id === this.ownerId) {
                this.playCard();
            }
        });
        return imageContainer;
    }

    renderCardBack() {
       const card = document.createElement('div');
       card.classList.add('card');
       card.classList.add('show-back');
       card.dataset.cardId = this.id;
       return card; 
    }

    /** 
    * Renders a larger image of the card as an overlay/modal.
    */
    renderJumbo() {
        const jumboImage = document.createElement('img');
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('jumbo-card__container');
        jumboImage.classList.add('jumbo-card__image');
        jumboImage.src = `images/${this.image}`;
        imageContainer.appendChild(jumboImage);
        renderInModal({
            contentToRender: imageContainer,
            withButton: false
        });
    }

}
