class Player {
    constructor(name, faction, id, active, gameRef) {
        this.name = name;
        this.faction = faction;
        this.id = id;
        this.currentScore = 0;
        this.roundsWon = 0;
        this.continueRound = true;
        this.deck = this.createDeck(
            this._setDeckSource(faction), 
            gameRef
        );
        for (let card of this.deck) {
            gameRef.cardBank[card.id] = card;
        }
        this.hand = this.createHand();
        this.graveyard = [];
        this.active = active;
        this.image = this._setImage(faction);
        this._prevHandState = {
            cards: [],
            isActivePlayer: false
        };
    }

    _setImage(faction) {
        switch (faction) {
            case factions.northernRealms:
                return 'foltest_the_steel_forged.jpg';

            case factions.nilfgaard:
                return 'emhyr_his_imperial_majesty.jpg';
        }
    }

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
    createDeck(deckSource, gameRef) {
        const playerId = this.id;
        return deckSource.map(function(card, index) {
            let id = generateId(12); 
            
            switch(card.cardType) {
                
                case cardTypes.unitCard:
                    return new UnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero
                    );

                case cardTypes.scorchUnitCard:
                    return new ScorchUnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero
                    );

                case cardTypes.summonUnitCard:
                    return new SummonUnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero
                    );

                case cardTypes.spyUnitCard:
                    return new SpyUnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero
                    );

                case cardTypes.healUnitCard:
                    return new HealUnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero
                    );

                case cardTypes.tightBondUnitCard:
                    return new TightBondUnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero,
                        card.bondGroup
                    );

                case cardTypes.moraleBoostUnitCard:
                    return new MoraleBoostUnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero
                    );

                case cardTypes.commandersHornUnitCard:
                    return new CommandersHornUnitCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type,
                        card.baseScore,
                        card.isHero
                    );

                case cardTypes.weatherCard:
                    return new WeatherCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef,
                        card.type
                    );

                case cardTypes.clearWeatherCard:
                    return new ClearWeatherCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef
                    );

                case cardTypes.scorchCard:
                    return new ScorchCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef
                    );

                case cardTypes.decoyCard:
                    return new DecoyCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef
                    );

                case cardTypes.commandersHornCard:
                    return new CommandersHornCard(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef
                    );

                default:
                    return new Card(
                        card.name,
                        id,
                        card.image,
                        playerId,
                        gameRef
                    );
            }
        });
    }

    /** 
    * Creates a hand of 10 random cards from the players deck
    * @return  {array}   An array of Card objects
    */
    createHand() {
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
    * Picks a random revivable card from the players graveyard and plays it onto the board. 
    */
    __noLongerUsed__playFromGraveyard() {
        // filter out hero cards which can't be revived
        const revivableCards = this.graveyard.filter(card => !card.isHero);
        // just play turn if no revivable cards
        if (revivableCards.length === 0) {
            game.playTurn();
            return;
        };
        // select a random card from the pool of elligible cards
        const randomIndex = Math.floor(Math.random() * revivableCards.length);
        const cardToRevive = revivableCards[randomIndex];
        // locate that card within the original unfiltered graveyard and remove it
        const indexInGraveyard = this.graveyard.findIndex(card => {
            return card.id === cardToRevive.id && card.ownerId === cardToRevive.ownerId;
        });
        this.graveyard.splice(indexInGraveyard, 1);
        // play the card onto the board
        cardToRevive.playCard();
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
        // const toGraveyard = this._hand.filter(card => card.inPlay);
        // const toHand = this._hand.filter(card => !card.inPlay);
        // this.graveyard = [...this.graveyard, ...toGraveyard];
        // this._hand = [...toHand];

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

    renderHand() {
        if (this._determineIfStateChanged()) {
            this._renderHandIfChanged();
        }
    }

    _getCurrentState() {
        return {
            cards: this.hand.map(card => card.id),
            isActivePlayer: this.active
        };
    }

    _determineIfStateChanged() {
        const currentState = this._getCurrentState();
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
    * Removes a card from the players hand. 
    */
    removeFromHand(cardObject) {
        this.hand = this.hand.filter(card => card.id !== cardObject.id);
        return cardObject;
    }

    /** 
    * Render the info panel for this player
    */
    _renderInfoPanel() {
        // grab the info panel for this player
        const targetInfoPanel = document.querySelector(`.player-info[data-player-id="${this.id}"]`);
        targetInfoPanel.querySelector('.player-info__name').textContent = this.name;
        targetInfoPanel.querySelector('.player-info__faction').textContent = this.faction;
        targetInfoPanel.querySelector('.player-info__image').src = `images/${this.image}`;
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

}