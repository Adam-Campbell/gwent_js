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

    killCard(playerObject) {
        playerObject.graveyard.push(this);
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
                //game.activePlayer.cardToPlay = this.id;
                //game.playTurn();
                this.playCard();
            }
        });
        return imageContainer;
    }

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
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the board
        const activePlayersRows = game.board.getPlayersRows(activePlayer);
        const rowForCard = activePlayersRows.filter(row => row.type === this.type)[0];
        rowForCard.addUnit(this);
        
        game.playTurn();

        // the above is only temporary - I have just given the spy card the normal card
        // behaviour for now, but will need to modify it to have the spy card behaviour. 

        // add it to the relevant row on inactivePlayers side of board
        // draw two cards from activePlayers deck and place into the hand
        // call the main game.playTurn method
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

        // call the main game.playTurn method
        game.playTurn();
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

