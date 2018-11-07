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
    }

    /** 
    * Factory function for the Card class and the various sub classes. Uses the raw card
    * data to determine arguments to pass in.
    * @return  {array}   An array of Card objects
    */
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
    playFromGraveyard() {
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
    }

    /** 
    * Render the card dock containing the players current hand 
    */
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


