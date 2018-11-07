class Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId) {
        this.name = name;
        this.id = id;
        this.baseScore = baseScore;
        this.type = type;
        this.isHero = isHero;
        this.image = image;
        // note - owners id used instead of the actual owner object in order to avoid 
        // circular reference. 
        this.ownerId = ownerId;
        this.ability = cardAbilities.standard;
        this._currentScore = baseScore;
    }

    /** 
    * Puts this card into play on the board.
    * No return value
    */
    playCard() {
        const activePlayer = game.activePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the board
        const activePlayersRows = game.board.getPlayersRows(activePlayer);
        const rowForCard = activePlayersRows.filter(row => row.type === this.type)[0];
        rowForCard.addUnit(this);
        // call the main game.playTurn method
        game.playTurn();
    }

    /** 
    * Adds this card to the players graveyard and resets the cards currentScore to its baseScore
    * @param   {Object}    playerObject - the player whose graveyard card should be added to.
    */
    killCard(playerObject) {
        this.resetScore();
        playerObject.graveyard.push(this);
    }

    /** 
    * Getter method for this cards currentScore
    */
    get currentScore() {
        return this._currentScore;
    }

    /** 
    * Setter method for this cards currentScore
    * @param   {number}    newScore - the newScore to set for this card.
    */
    set currentScore(newScore) {
        if (!this.isHero) {
            this._currentScore = newScore;
        }
    }

    /** 
    * Reset the card by setting its currentScore back to its baseScore. Used when taking a card
    * off of it's current row, moving it to the graveyard or players hand etc.
    * @param   {Object}    cardObject to be removed from the row.
    */
    resetScore() {
        this.currentScore = this.baseScore;
    }

    /** 
    * Constructrs the HTML representation of this card
    * @param   {boolean}    inPlay - true if card is on a row, false if in hand, graveyard etc.
    * @returns {HTMLElement} a document fragment containing the HTML representation of the card.
    */
    render(inPlay=false) {
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
            } else if (!inPlay && game.activePlayer.id === this.ownerId) {
                //game.activePlayer.cardToPlay = this.id;
                //game.playTurn();
                this.playCard();
            }
        });
        return imageContainer;
    }

    /** 
    * Renders a larger image of the card as an overlay/modal.
    */
    renderModal() {
        document.querySelector('.jumbo-card__image').src = `images/${this.image}`;
        document.querySelector('.modal__overlay').classList.add('modal__overlay--show');
    }
}



class ScorchCard extends Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId) {
        super(name, id, baseScore, type, isHero, image, ownerId);
        this.ability = cardAbilities.scorch;
    }

    /** 
    * All of the base playCard logic, plus the scorch functionality.
    * No return value
    */
    playCard() {
        const activePlayer = game.activePlayer;
        const inactivePlayer = game.inactivePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the board
        const activePlayersRows = game.board.getPlayersRows(activePlayer);
        const rowForCard = activePlayersRows.filter(row => row.type === this.type)[0];
        rowForCard.addUnit(this);

        // if inactivePlayers infantry row has a score >= 10, the find the strongest
        // non-hero card(s), remove them from the row and place them into 
        const rowToScorch = game.board.getPlayersRows(inactivePlayer)
                                      .find(row => row.type === unitTypes.infantry);
        if (rowToScorch.score >= 10) {
            //const cardsToScorch = this.determineCardsToScorch(rowToScorch);
            this.determineCardsToScorch(rowToScorch).forEach(card => {
                rowToScorch.removeUnit(card);
                card.killCard(inactivePlayer);
            });
        }

        // call the main game.playTurn method
        game.playTurn();
    }

    /** 
    * Given a row, it finds the non-hero card(s) with the highest score
    * and returns the cardObjects for those cards. 
    * @return {Array}  An array of 0 or more cardObjects
    */
    determineCardsToScorch(row) {
        const heroesFilteredOut = row.units.filter(card => card.isHero === false);
        let highestScore = 0;
        for (let card of heroesFilteredOut) {
            if (card.baseScore > highestScore) {
                highestScore = card.baseScore;
            }
        } 
        const cardsToScorch = heroesFilteredOut.filter(card => card.baseScore === highestScore);
        return cardsToScorch;
    }
}


class SummonCard extends Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId) {
        super(name, id, baseScore, type, isHero, image, ownerId);
        this.ability = cardAbilities.summon;
    }

    /** 
    * All of the base playCard logic, plus the summon functionality.
    * No return value
    */
    playCard() {
        const activePlayer = game.activePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the board
        const activePlayersRows = game.board.getPlayersRows(activePlayer);
        const rowForCard = activePlayersRows.filter(row => row.type === this.type)[0];
        rowForCard.addUnit(this);

        // search activePlayers deck and hand for all corresponding summon cards
        // add all of these cards to the board as well

        // call the main game.playTurn method
        game.playTurn();
    }
}


class SpyCard extends Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId) {
        super(name, id, baseScore, type, isHero, image, ownerId);
        this.ability = cardAbilities.spy;
    }

    /** 
    * All of the base playCard logic, plus the spy functionality.
    * No return value
    */
    playCard() {
        const activePlayer = game.activePlayer;
        const inactivePlayer = game.inactivePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the inactive players side of the board
        const inactivePlayersRows = game.board.getPlayersRows(inactivePlayer);
        const rowForCard = inactivePlayersRows.find(row => row.type === this.type);
        rowForCard.addUnit(this);
        // draw two cards from activePlayers deck and place into their hand
        activePlayer.drawFromDeck(2);
        // call the main game.playTurn method
        game.playTurn();
       
        
    }
}


class HealCard extends Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId) {
        super(name, id, baseScore, type, isHero, image, ownerId);
        this.ability = cardAbilities.heal;
    }

    /** 
    * All of the base playCard logic, plus the heal functionality.
    * No return value
    */
    playCard() {
        const activePlayer = game.activePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the board
        const activePlayersRows = game.board.getPlayersRows(activePlayer);
        const rowForCard = activePlayersRows.filter(row => row.type === this.type)[0];
        rowForCard.addUnit(this);

        // if the activePlayer has cards in their graveyard, let the activePlayer
        // pick one of them to play onto the board
        activePlayer.playFromGraveyard();
        // call the main game.playTurn method
        //game.playTurn();
    }
}


class TightBondCard extends Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId, bondGroup) {
        super(name, id, baseScore, type, isHero, image, ownerId);
        this.ability = cardAbilities.tightBond;
        this.bondGroup = bondGroup;
    }

}


class MoraleBoostCard extends Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId) {
        super(name, id, baseScore, type, isHero, image, ownerId);
        this.ability = cardAbilities.moraleBoost;
    }

}


class CommandersHornCard extends Card {
    constructor(name, id, baseScore, type, isHero, image, ownerId) {
        super(name, id, baseScore, type, isHero, image, ownerId);
        this.ability = cardAbilities.commandersHorn;
    }

}

