/*

External interface:

Properties:
name - {string} - the name of this player.
faction - {string} - the faction of this player.
id - {number} - the id of this player.
currentScore - {number} - the current score of this player.
roundsWon - {number} - the number of rounds won by this player.
continueRound - {boolean} - true if this player is still participating in round, else false. 
deck - array of Card objects representing the cards in this players deck. 
hand - array of Card object representing the cards in this players hand.
graveyard - array of Card objects representing the cards in this players graveyard.
active - {boolean} - true if this player is the currently active player, else false. 
image - {string} - the url for this players image. 


Methods:
drawFromDeck() - draws a specified amount of cards from this players deck and places them 
into their hand.
addCardToDeck() - adds a specific card to this players deck.
removeCardFromDeck() - removes a specific card from this players deck.
addCardToGraveyard() - adds a specific card to this players graveyard.
removeCardFromGraveyard() - removes a specific card from this players graveyard. 
addCardToHand() - adds a specific card to this players hand.
removeFromHand() - removes a specific card from this players hand. 
updatePlayerScore() - updates the current score for this player.
preRoundsCleanUp() - resets certain properties on this Player object so that it is ready for
the next round.
renderHand() - render this players hand.
renderInfoPanel() - perform the initial render of the info panel for this player.
refreshInfoPanel() -  rerender the elements within this players info panel that are subject to change
from one turn to the next. 
renderGraveyard() - render this players graveyard. 


*/

class Player {
    constructor(name, faction, id, active, gameRef) {
        this.name = name;
        this.faction = faction;
        this.id = id;
        this.currentScore = 0;
        this.roundsWon = 0;
        this.continueRound = true;
        this.deck = this._createDeck(
            this._setDeckSource(faction), 
            gameRef
        );
        for (let card of this.deck) {
            gameRef.cardBank[card.id] = card;
        }
        this.hand = this._createHand();
        this.graveyard = [];
        this.active = active;
        this.image = this._setImage(faction);
        this._prevHandState = {
            cards: [],
            isActivePlayer: false
        };
    }

    /**
     * Set this players image based on their faction.
     * @param {string} faction - the players faction. 
     */
    _setImage(faction) {
        switch (faction) {
            case factions.northernRealms:
                return 'foltest_the_steel_forged.jpg';

            case factions.nilfgaard:
                return 'emhyr_his_imperial_majesty.jpg';
        }
    }

    /**
     * Set the source for this players deck based on their faction.
     * @param {string} faction - the players faction. 
     */
    _setDeckSource(faction) {
        switch (faction) {
            case factions.northernRealms:
                return northernRealmsCards;

            case factions.nilfgaard:
                return nilfgardCards;
        }
    }

    /** 
    * Factory function for the Card class and the various sub classes. Uses the raw card
    * data to determine arguments to pass in.
    * @return  {array}   An array of Card objects
    */
    _createDeck(deckSource, gameRef) {
        const playerId = this.id;
        const cardFactory = new CardFactory();
        return deckSource.map(card => cardFactory.createCard({
            cardData: card,
            ownerId: playerId,
            gameRef: gameRef
        }));
    }

    /** 
    * Creates a hand of 10 random cards from the players deck
    * @return  {array}   An array of Card objects
    */
    _createHand() {
        const hand = [];
        for (let i = 0; i < 10; i++) {
            const cardToDraw = Math.floor(Math.random() * this.deck.length);
            const removedCard = this.deck.splice(cardToDraw, 1)[0];
            hand.push(removedCard);
        }
        return hand;
    }

    /** 
    * Draws a specified amount of random cards from the deck and places them into
    * the players hand.
    * @param   {num}    amountToDraw - the amount of random cards to draw
    */
    drawFromDeck(amountToDraw) {
        for (let i = 0; i < amountToDraw; i++) {
            const cardToDraw = Math.floor(Math.random() * this.deck.length);
            const drawnCard = this.deck.splice(cardToDraw, 1)[0];
            this.hand.push(drawnCard);
        }
        this.renderHand();
    }

    /**
     * Add a specific card into the players deck
     * @param {Object} cardObject - the card to add
     */
    addCardToDeck(cardObject) {
        this.deck.push(cardObject);
    }

    /**
     * Remove a specific card from the players deck
     * @param {Object} cardObject - the card to remove
     */
    removeCardFromDeck(cardObject) {
        this.deck = this.deck.filter(card => card.id !== cardObject.id);
    }

    /**
     * Add a specific card into the players graveyard
     * @param {Object} cardObject - the card to add
     */
    addCardToGraveyard(cardObject) {
        this.graveyard.push(cardObject);
    }

    /**
     * Remove a specific card from the players graveyard
     * @param {Object} cardObject - the card to remove
     */
    removeCardFromGraveyard(cardObject) {
        this.graveyard = this.graveyard.filter(card => card.id !== cardObject.id)
    }

    /**
     * Add a specific card into the players hand
     * @param {Object} cardObject - the card to add
     */
    addCardToHand(cardObject) {
        this.hand.push(cardObject);
    }

    /**
     * Removes a specific card from the players hand
     * @param {Object} cardObject - the card to remove 
     */
    removeFromHand(cardObject) {
        this.hand = this.hand.filter(card => card.id !== cardObject.id);
    }


    /** 
    * Update the score for each individual row for this player and aggregate the results
    * No parameters or return value    
    */
    updatePlayerScore() {
        // Is there a way to avoid referencing the game object here?
        const playersRows = game.board.getPlayersRows(this);
        for (let row of playersRows) {
            row.calculateScore();
        }
        const playersScore = playersRows.reduce(function(acc, curr, index) {
            return acc + curr.score;
        }, 0);
        this.currentScore = playersScore;
    }

    /** 
    * Signal finish of round by setting continueRound prop to false
    * No parameters or return value    
    */
    finishRound() {
        this.continueRound = false;
    }

    /** 
    * Perform necessary housekeeping to begin next round
    * No parameters or return value    
    */
    preRoundCleanUp() {
        this.currentScore = 0;
        this.continueRound = true;
        const playersRows = game.board.getPlayersRows(this);
        for (let row of playersRows) {
            row.reset();
        }
        game.board.renderPlayersRows(this);
        this.renderHand();
        this.refreshInfoPanel();
    }

    /** 
    * Render the card dock containing the players current hand
    */
    _renderHandIfChanged() {
        const targetElement = document.querySelector(`.card-dock[data-player-id="${this.id}"]`);
        const frag = document.createDocumentFragment();
        const currentHand = this.hand;
        if (this.active) {
            for (let card of currentHand) {
                frag.appendChild(card.render());
            }
        } else {
            for (let card of currentHand) {
                frag.appendChild(card.renderCardBack());
            }
        }
        targetElement.innerHTML = "";
        targetElement.appendChild(frag);
    }

    /**
     * Render the players hand only if the state of their hand has changed since the last render. 
     */
    renderHand() {
        if (this._determineIfHandStateChanged()) {
            this._renderHandIfChanged();
        }
    }


    _getCurrentHandState() {
        return {
            cards: this.hand.map(card => card.id),
            isActivePlayer: this.active
        };
    }

    _determineIfHandStateChanged() {
        const currentState = this._getCurrentHandState();
        const prevState = this._prevHandState;
        let hasChanged = false;
        // if cards arrays haves different lengths or isActivePlayer is different then set 
        // hasChanged to true
        if (
            prevState.cards.length !== currentState.cards.length ||
            prevState.isActivePlayer !== currentState.isActivePlayer
        ) {
            hasChanged = true;
        } else {
            // if first two tests are passed, compare each element of the cards arrays to ensure 
            // they are the same
            for (let i = 0; i < currentState.cards.length; i++) {
                if (prevState.cards[i] !== currentState.cards[i]) {
                    hasChanged = true;
                }
            }
        }
        // if hasChanged is true, set _prevState to currentState, and return true, else return false
        if (hasChanged) {
            this._prevHandState = currentState;
            return true;
        } else {
            return false; 
        }
    }

    /**
     * Renders the initial info panel for this player. Only called at the start of the match, 
     * subsequent rerenders to adjust things like score utilise the refreshInfoPanel method.
     */
    renderInfoPanel() {
        const nodeToRenderTo = document.querySelector(`.player-info[data-player-id="${this.id}"]`);
        const infoPanelHTML = createHTML({
            templateId: 'playerInfoPanelTemplate',
            dataSource: this
        });
        nodeToRenderTo.innerHTML = infoPanelHTML;
        nodeToRenderTo.querySelector('.player-info__end-round')
                           .addEventListener('click', () => {
                               this.finishRound();
                               game.playTurn();
                           });
    }
    /**
     * Doesn't rerender the entire info panel, but hooks into the specific elements whose values
     * change over time and updates their values in the DOM. 
     */
    refreshInfoPanel() {
        // grab the info panel for this player
        const targetInfoPanel = document.querySelector(`.player-info[data-player-id="${this.id}"]`);
        // set rounds won to this.roundsWon
        targetInfoPanel.querySelector('.player-info__rounds-won').textContent = `${this.roundsWon} rounds won`;
        // set # cards in hand to this.hand.length
        targetInfoPanel.querySelector('.player-info__hand').textContent = `${this.hand.length} cards in hand`;
        // set current score to this.currentScore
        targetInfoPanel.querySelector('.player-info__current-score').textContent = `Current Score: ${this.currentScore}`;
        // adjust the now playing status
        const playingStatus = targetInfoPanel.querySelector('.player-info__playing-status');
        if (game.activePlayer.id === this.id) {
            playingStatus.textContent = 'Now playing...';
        } else {
            playingStatus.textContent = '';
        }
    }

    renderGraveyard() {
        const docFrag = document.createDocumentFragment();
        for (let card of this.graveyard) {
            const jumboImage = document.createElement('img');
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('jumbo-card__container');
            jumboImage.classList.add('jumbo-card__image');
            jumboImage.src = `images/${card.image}`;
            imageContainer.appendChild(jumboImage);
            docFrag.appendChild(imageContainer);
        }
        renderInModal({
            contentToRender: docFrag,
            withButton: true
        });
    }

}