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
    * Constructrs the HTML representation of this card
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
                this.renderModal();
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
    renderModal() {
        const jumboImage = document.createElement('img');
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('jumbo-card__container');
        jumboImage.classList.add('jumbo-card__image');
        jumboImage.src = `images/${this.image}`;
        imageContainer.appendChild(jumboImage);
        this.gameRef.board.renderModal(imageContainer, true);
    }

}

class UnitCard extends Card {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef);
        this.baseScore = baseScore;
        this.type = type;
        this.isHero = isHero;
        this.ability = cardAbilities.standard;
        this._currentScore = baseScore;
    }

    /** 
    * Puts this card into play on the board.
    * No return value
    */
    playCard() {
        const game = this.gameRef;
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
        this._currentScore = this.baseScore;
    }
}

class ScorchUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
        //this.ability = cardAbilities.scorchUnit;
    }

    /** 
    * All of the base playCard logic, plus the scorch functionality.
    * No return value
    */
    playCard() {
        const game = this.gameRef;
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
            this._determineCardsToScorch(rowToScorch).forEach(card => {
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
    _determineCardsToScorch(row) {
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

class SummonUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
        //this.ability = cardAbilities.summon;
    }

    /** 
    * All of the base playCard logic, plus the summon functionality.
    * No return value
    */
    playCard() {
        const game = this.gameRef;
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

class SpyUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
        //this.ability = cardAbilities.spy;
    }

    /** 
    * All of the base playCard logic, plus the spy functionality.
    * No return value
    */
    playCard() {
        const game = this.gameRef;
        const activePlayer = game.activePlayer;
        const inactivePlayer = game.inactivePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the inactive players side of the board
        const inactivePlayersRows = game.board.getPlayersRows(inactivePlayer);
        const rowForCard = inactivePlayersRows.find(row => row.type === this.type);
        rowForCard.addUnit(this);
        this.ownerId = inactivePlayer.id;
        // draw two cards from activePlayers deck and place into their hand
        activePlayer.drawFromDeck(2);
        // call the main game.playTurn method
        game.playTurn();  
    }
    
}

class HealUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
        //this.ability = cardAbilities.heal;
    }

    /** 
    * All of the base playCard logic, plus the heal functionality.
    * No return value
    */
    playCard() {
        const game = this.gameRef;
        const activePlayer = game.activePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the board
        const activePlayersRows = game.board.getPlayersRows(activePlayer);
        const rowForCard = activePlayersRows.filter(row => row.type === this.type)[0];
        rowForCard.addUnit(this);
        const revivableCards = game.activePlayer.graveyard.filter(card => {
            return (card instanceof UnitCard) && !card.isHero
        });
        game.board.renderModal(
            this._renderGraveyard(revivableCards)
        )
    }

    _renderGraveyard(cardObjects) {
        const game = this.gameRef;
        const docFrag = document.createDocumentFragment();
        for (let card of cardObjects) {
            const jumboImage = document.createElement('img');
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('jumbo-card__container');
            jumboImage.classList.add('jumbo-card__image');
            jumboImage.src = `images/${card.image}`;
            imageContainer.appendChild(jumboImage);
            docFrag.appendChild(imageContainer);
            jumboImage.addEventListener('click', function() {
                game.activePlayer.graveyard = game.activePlayer.graveyard
                                              .filter(graveyardCard => graveyardCard.id !== card.id);
                card.playCard();
                const modalOverlay = document.querySelector('.modal__overlay');
                document.body.removeChild(modalOverlay);
            });
        }
        return docFrag;
    }

}

class TightBondUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero, bondGroup) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
        //this.ability = cardAbilities.tightBond;
        this.bondGroup = bondGroup;
    }
}

class MoraleBoostUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
        //this.ability = cardAbilities.moraleBoost;
    }
}

class CommandersHornUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
        //this.ability = cardAbilities.commandersHornUnit;
    }
}

class WeatherCard extends Card {
    constructor(name, id, image, ownerId, gameRef, type) {
        super(name, id, image, ownerId, gameRef);
        this.type = type;
    }

    playCard() {
        const game = this.gameRef;
        // remove the card from the players hand
        game.activePlayer.removeFromHand(this);
        // move it into the players graveyard
        game.activePlayer.graveyard.push(this);
        // find the rows that correspond with this cards type property
        // set the weatherEffect property on those rows to true
        game.board.rows.filter(row => row.type === this.type)
                       .forEach(row => row.weatherEffect = true);
        // call game.playTurn()
        game.playTurn();
    }
}

class ClearWeatherCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    playCard() {
        const game = this.gameRef;
        // remove the card from the players hand
        game.activePlayer.removeFromHand(this);
        // move it into the players graveyard
        game.activePlayer.graveyard.push(this);
        // loop over every row on the board and set the weatherEffect boolean
        // to false for every row
        game.board.rows.forEach(row => row.weatherEffect = false);
        // call game.playTurn()
        game.playTurn();
    }

}

class ScorchCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    playCard() {
        // remove the card from the players hand
        // move it into the players graveyard
        // find the highest value non-hero unit card(s) across both players
        // remove those cards from their rows and move them into their respective owners graveyards
        // the exact logic for this can be based off of the logic inside the ScorchUnitCard class,
        // but will need alterations as this class doesn't behave exactly the same. 
        // finally call game.playTurn()


        // possible implementation
        //
        // For each row find the highest 'scorchable' cards on that row, and keep references to the
        // cards themselves, as well as the actual score of those cards.
        //
        // Once this has been done for each row, just compare the result from each row - the one with  
        // the highest score, or multiple rows if the highest score is shared between multiple rows, 
        // will be the row that needs scorching.
        //
        // We already have references to the cards on those rows that need to be scorched, so just 'scorch'
        // those cards by removing them from the row and moving them into their respective owners graveyards.
        //
        const game = this.gameRef;
        const struct = {
            score: 0,
            rows: []
        };

        const rowLeaders = game.board.rows.map(row => {
            return this.findRowLeaders(row);
        });
        for (let row of rowLeaders) {
            if (row.score > struct.score) {
                struct.score = row.score;
                struct.rows = [row];
            } else if (row.score === struct.score) {
                struct.rows.push(row);
            }
        }
        for (let rowObject of struct.rows) {
            for (let card of rowObject.cards) {
                let cardOwner = game.getPlayerById(card.ownerId);
                rowObject.row.removeUnit(card);
                card.killCard(cardOwner);
            }
        }
        game.playTurn();
    }

    /** 
     * Given a particular row, find the cards with the highest currentScore in that row
     * @param {Object} row - the row on which to operate on
     * @return {Object} - an object containing the highest score found on the row, and
     * all of the cards that had that score.
    */
    findRowLeaders(row) {
        let struct = {
            score: 0,
            row: row,
            cards: []
        };

        const filteredCards = row.units.filter(card => card instanceof UnitCard && !card.isHero);
        for (let card of filteredCards) {
            if (card.currentScore > struct.score) {
                struct.score = card.currentScore;
                struct.cards = [card];
            } else if (card.currentScore === struct.score) {
                struct.cards.push(card);
            }
        } 
        return struct;
    }
}

class DecoyCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    playCard() {
        // remove the card from the players hand
        // swap it with an elligible card from the players side of the board:
        // move that card from its row back into the players hand and - 
        // move the decoy card onto the row that the card was occupying
        // call game.playTurn()


        //
        // implementation
        // this will benefit from having unique ids for every card.
        // 
        // when this card is played it attaches an event listener to the window - listening for clicks. 
        // click must be on a card on the active players side of the board. 
        //
        // when a card has been clicked, the rest of the logic is carried out. The card is removed from its
        // row and placed back into the players hand. The decoy is moved from the players hand into the row
        // that the card was occupying.  
        //
        // Then the game.playTurn() method is called. Keep in mind no rendering has taken place until the call
        // to game.playTurn() happens, so this is when the user will get visual feedback that the cards have
        // swapped.
        //
        // After the call to game.playTurn() the eventlistener will unset itself, since we don't want redundant
        // event listeners.
        //
        // A final thought - I don't think this will stop the user from being able to click on other cards/things 
        // like that to progress the game even though they shouldn't be able to since they're midmove at this 
        // point. It may be worth introducing something like a frozen property on the game object, that while true
        // will prevent certain actions from being allowed. This could be useful not only for this particular
        // method but in other situations as well.
        //
        //
        const game = this.gameRef;
        const self = this;
        const thisId = this.id;
        function handleClick(e) {
            const el = e.target;
            if (el.classList.contains('card-image') && el.parentElement.dataset.cardId !== thisId) {
                const cardId = el.parentElement.dataset.cardId;
                const playersRows = game.board.getPlayersRows(game.activePlayer);
                let parentRow = null;
                let cardObject = null;
                // determine whether the card clicked is in one of active players rows, if it is
                // then grab references to both the cardObject itself, and the row that the card
                // is on.
                for (let row of playersRows) {
                    cardObject = row.units.find(card => card.id === cardId);
                    if (cardObject) {
                        parentRow = row;
                        break;
                    }
                }
                // if we haven't found a valid card object by this point, then just return and skip the
                // rest of the function. An invalid card includes not finding a cardObject at all, or finding
                // one that is either a hero card or some type of non unit card.
                if (!cardObject || cardObject.isHero || !(cardObject instanceof UnitCard)) {
                    return;
                }
                // if we reach this point then cardObject is valid
                // remove cardObject from parentRow and insert it into the players hand
                parentRow.removeUnit(cardObject);
                game.activePlayer.hand.push(cardObject);
                // remove the decoy card from the players hand and insert it into parentRow
                game.activePlayer.removeFromHand(self);
                parentRow.addUnit(self);
                // call the game.playTurn() method.
                game.playTurn();
                //console.log(parentRow, cardObject);
                window.removeEventListener('click', handleClick);
            }
            
        }
        window.addEventListener('click', handleClick);
    }

}

class CommandersHornCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    playCard() {
        // remove the card from the players hand
        // move the card into the players graveyard
        // for a row specified by the player, on the players side of the board only,
        // set the commandersHorn property on that row to true

        //
        // implementation
        //
        // when clicked it will add an event listener to the window, similarl to the approach used in the
        // decoy implementation. This event listener will listen for clicks on the rows, specifically the
        // rows for the current player, ie activePlayer. 
        //
        // when a row has been selected, we will set the commandersHorn property on that row to true, then
        // move this card from the players hand into the players graveyard, then call game.playTurn(), and
        // finally we will unset the event listener that we added.
        //
        //
        const self = this;
        const game = this.gameRef;
        function handleClick(e) {
            // check that either the target element, or a parent of the target element, is a row,
            // and store reference in rowNode if true
            const path = e.path;
            let rowNode = null;
            for (let node of path) {
                if (node.classList && node.classList.contains('row')) {
                    rowNode = node;
                    break;
                }
            }
            // If no row node found just return early from the function
            if (!rowNode) {
                return;
            }

            // determine the owner of the row from data-player-id attribute
            const rowOwner = parseInt(rowNode.dataset.playerId);
            // verify that the owner is the current player
            const isOwner = rowOwner === game.activePlayer.id;
            if (isOwner) {
                const rowType = rowNode.dataset.unitType;
                const rowObject = game.board.getPlayersRows(game.activePlayer)
                                .find(row => row.type === rowType);
                rowObject.commandersHorn = true;
                game.activePlayer.removeFromHand(self);
                game.activePlayer.graveyard.push(self);
                game.playTurn();
                window.removeEventListener('click', handleClick);
            }

        }
        window.addEventListener('click', handleClick);
    }

}