class Player {
    constructor(name, id, active) {
        this.name = name;
        this.id = id;
        this.currentScore = 0;
        this.roundsWon = 0;
        this.continueRound = true;
        this.deck = this.createDeck();
        this.hand = this.createHand();
        this.graveyard = [];
        this.active = active;
        this._cardToPlay = null;
    }

    /** 
    * Creates a deck of Card objects from the raw card data
    * @return  {array}   An array of Card objects
    */
    // createDeck() {
    //     //const player = this;
    //     return cardData.map(function(card, index) {
    //         return new Card(
    //             card.name,
    //             index,
    //             card.baseScore,
    //             card.type,
    //             card.isHero,
    //             card.image,
    //             card.behaviours,
    //             null
    //         );
    //     });
    // }
    createDeck() {
        const playerId = this.id;
        return cardData.map(function(card, index) {
            
            switch (card.ability) {
                case cardAbilities.standard:
                    return new Card(
                        card.name, 
                        index, 
                        card.baseScore, 
                        card.type, 
                        card.isHero, 
                        card.image, 
                        playerId
                    );

                case cardAbilities.scorch:
                    return new ScorchCard(
                        card.name,
                        index,
                        card.baseScore,
                        card.type,
                        card.isHero,
                        card.image,
                        playerId
                    );

                case cardAbilities.summon:
                    return new SummonCard(
                        card.name,
                        index,
                        card.baseScore,
                        card.type,
                        card.isHero,
                        card.image,
                        playerId
                    );

                case cardAbilities.spy:
                    return new SpyCard(
                        card.name,
                        index,
                        card.baseScore,
                        card.type,
                        card.isHero,
                        card.image,
                        playerId
                    );

                case cardAbilities.heal:
                    return new HealCard(
                        card.name,
                        index,
                        card.baseScore,
                        card.type,
                        card.isHero,
                        card.image,
                        playerId  
                    );

                case cardAbilities.tightBond:
                    return new TightBondCard(
                        card.name,
                        index,
                        card.baseScore,
                        card.type,
                        card.isHero,
                        card.image,
                        playerId,
                        card.bondGroup 
                    );

                case cardAbilities.moraleBoost:
                    return new MoraleBoostCard(
                        card.name,
                        index,
                        card.baseScore,
                        card.type,
                        card.isHero,
                        card.image,
                        playerId 
                    );

                case cardAbilities.commandersHorn:
                    return new CommandersHornCard(
                        card.name,
                        index,
                        card.baseScore,
                        card.type,
                        card.isHero,
                        card.image,
                        playerId 
                    );

                default:
                    return new Card(
                        card.name, 
                        index, 
                        card.baseScore, 
                        card.type, 
                        card.isHero, 
                        card.image, 
                        playerId
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

    drawFromDeck(amountToDraw) {
        for (let i = 0; i < amountToDraw; i++) {
            const cardToDraw = Math.floor(Math.random() * this.deck.length);
            const drawnCard = this.deck.splice(cardToDraw, 1)[0];
            this.hand.push(drawnCard);
        }
        this.renderHand();
    }

    playFromGraveyard() {
        const revivableCards = this.graveyard.filter(card => !card.isHero);
        if (revivableCards.length === 0) {
            game.playTurn();
            return;
        };
        const randomIndex = Math.floor(Math.random() * revivableCards.length);
        const cardToRevive = revivableCards[randomIndex];
        //this.graveyard[randomNum].playCard();
        const indexInGraveyard = this.graveyard.findIndex(card => {
            return card.id === cardToRevive.id && card.ownerId === cardToRevive.ownerId;
        });
        this.graveyard.splice(indexInGraveyard, 1);
        cardToRevive.playCard();
    }


    /** 
    * Get the card that has been set as the next to be played.
    * @return  {object} Card object     
    */
    get cardToPlay() {
        return this._cardToPlay;
    }

    /** 
    * Set the next card to be played
    * @param   {Object}    Card object to be played
    */
    set cardToPlay(cardId) {
        if (cardId === null) {
            this._cardToPlay = null;
        } else {
            const card = this.hand.find(card => card.id === cardId);
            this._cardToPlay = card;
        }
    }

    /** 
    * Get the cards in players hand that haven't been played yet
    * @return  {Array} Array of card objects     
    */
    // get hand() {
    //     return this._hand.filter(card => !card.inPlay);
    // }

    /** 
    * Update the score for each individual row for this player and aggregate the results
    * No parameters or return value    
    */
    updatePlayerScore() {
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
    * Play the current card
    * No parameters or return value    
    */
    playCurrentCard() {
        this.cardToPlay.playCard();
        const playersRows = game.board.getPlayersRows(this);
        const rowToPlayTo = playersRows.find(row => row.type === this.cardToPlay.type);
        rowToPlayTo.addUnit(this.cardToPlay);
        this.cardToPlay = null;
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
    }

    renderHand() {
        const targetElement = document.querySelector(`.card-dock[data-player-id="${this.id}"]`);
        const frag = document.createDocumentFragment();
        const currentHand = this.hand;
        for (let card of currentHand) {
            frag.appendChild(card.render());
        }
        targetElement.innerHTML = "";
        targetElement.appendChild(frag);
    }

    removeFromHand(cardObject) {
        this.hand = this.hand.filter(card => card.id !== cardObject.id);
        return cardObject;
    }

    renderInfoPanel() {
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


