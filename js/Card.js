class Card {
    constructor(name, id, baseScore, type, isHero, image, behaviours, owner) {
        this.name = name;
        this.id = id;
        this.baseScore = baseScore;
        this.type = type;
        this.isHero = isHero;
        this.image = image;
        this.behaviours = behaviours;
        this.owner = owner;
        this.inPlay = false;
    }

    /** 
    * Sets this cards inPlay value to true.
    * No return value
    */
    playCard() {
        this.inPlay = true;
    }

    render() {
        // not the actual rendering logic, just a simple test.
        const imageElement = document.createElement('img');
        const imageContainer = document.createElement('div');
        imageElement.classList.add('card-image');
        imageElement.src = `images/${this.image}`;
        imageContainer.classList.add('card');
        imageContainer.appendChild(imageElement);
        //document.querySelector('.card-dock').appendChild(imageContainer);
        imageContainer.addEventListener('click', (e) => {
            // todo: need to ensure before trying to play a card that I ensure that
            // the card clicked belonged to activePlayer
            if (e.ctrlKey) {
                this.renderModal();
            } else {
                game.activePlayer.cardToPlay = this.id;
                game.playTurn();
            }
        });
        return imageContainer;
    }

    renderModal() {
        document.querySelector('.jumbo-card__image').src = `images/${this.image}`;
        document.querySelector('.modal__overlay').classList.add('modal__overlay--show');
    }
}