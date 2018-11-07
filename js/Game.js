class Game {
    constructor() {
        this.players = this.createPlayers();
        this.board = new Board(this.players[0], this.players[1]);
    }

    /** 
    * Creates two Player objects
    * @return  {array}   Array containing the Player objects
    */
    createPlayers() {
        return [
            new Player('Player One', 0, true),
            new Player('Player Two', 1, false)
        ];
    }

    /** 
    * Switches the active player
    * No params or return value
    */
    switchActivePlayer() {
        for (let player of this.players) {
            player.active = !player.active;
        }
    }

    /** 
    * Gets the currently active player
    * @return  {Object}  Player object that is currently active 
    */
    get activePlayer() {
        return this.players.find(player => player.active);
    }

    get inactivePlayer() {
        return this.players.find(player => !player.active);
    }
    
    /** 
    * Contains all the logic for playing a turn.
    * @param   {...}    ...
    * @return  {...}   ...
    */
    // playTurn() {
    //     // get active player, active players rows, and active players next card to play
    //     const activePlayer = this.activePlayer;
    //     const activePlayersRows = this.board.getPlayersRows(activePlayer);
    //     const cardToPlay = activePlayer.cardToPlay;
    //     // play the card
    //     cardToPlay.playCard();
    //     activePlayersRows.find(row => row.type === cardToPlay.type).addUnit(cardToPlay);
    //     activePlayer.cardToPlay = null;
    //     // recalculate scores
    //     for (let row of activePlayersRows) {
    //         row.calculateScore();
    //     }
    //     const newScore = activePlayersRows.reduce(function(acc, currentRow, index) {
    //         return acc + currentRow.score;
    //     }, 0);
    //     activePlayer.currentScore = newScore;
    //     // switch active players
    //     this.switchActivePlayer();
    // }

    oldplayTurn() {
        const activePlayer = this.activePlayer;
        const inactivePlayer = this.inactivePlayer;
        // current player is still playing round
        // if (activePlayer.continueRound) {
        //     console.log('the current player is still playing this round');
        //     activePlayer.playCurrentCard();
        //     activePlayer.updatePlayerScore();
        //     otherPlayer.updatePlayerScore();
        //     if (otherPlayer.continueRound) {
        //         this.switchActivePlayer();
        //     }
        //     // current player isn't playing round, but other player still is
        // } else if (otherPlayer.continueRound) {
        //     console.log("the current player finished but the other player is still playing")
        //     this.switchActivePlayer();
        //     // neither players are still playing round, so finish round
        // } else {
        //     console.log('both players have finished playing this round');
        //     // end round
        // }
        
        // always update both players score on every turn
        activePlayer.updatePlayerScore();
        inactivePlayer.updatePlayerScore();
        // as long as activePlayer is still playing, play their current card
        if (activePlayer.continueRound) {
            //activePlayer.playCurrentCard();
            activePlayer.renderHand();
            this.board.renderPlayersRows(activePlayer);
            this.board.renderPlayersRows(inactivePlayer);
            activePlayer.renderInfoPanel();
        }
        // // always update both players score on every turn
        // activePlayer.updatePlayerScore();
        // inactivePlayer.updatePlayerScore();
        // if otherPlayer is still playing, switch to them
        if (inactivePlayer.continueRound) {
            this.switchActivePlayer();
            this.activePlayer.renderInfoPanel();
            this.inactivePlayer.renderInfoPanel();
            // for this block to executr both players must have finished so end round
        } else if (!activePlayer.continueRound) {
            // end round logic
            const activePlayerScore = activePlayer.currentScore;
            const inactivePlayerScore = inactivePlayer.currentScore;
            if (activePlayerScore > inactivePlayerScore) {
                activePlayer.roundsWon += 1;
            } else if (inactivePlayerScore > activePlayerScore) {
                inactivePlayer.roundsWon += 1;
            }
            this.switchActivePlayer();
            activePlayer.preRoundCleanUp();
            inactivePlayer.preRoundCleanUp();
            this.activePlayer.renderInfoPanel();
            this.inactivePlayer.renderInfoPanel();
        }
    }

    playTurn() {
        const activePlayer = this.activePlayer;
        const inactivePlayer = this.inactivePlayer;
        // update the scores for each player
        activePlayer.updatePlayerScore();
        inactivePlayer.updatePlayerScore();
        // deal with player switching / end of round work
        if (inactivePlayer.continueRound) {
            this.switchActivePlayer();
        } else if (!activePlayer.continueRound) {
            const activePlayerScore = activePlayer.currentScore;
            const inactivePlayerScore = inactivePlayer.currentScore;
            if (activePlayerScore > inactivePlayerScore) {
                activePlayer.roundsWon += 1;
            } else if (inactivePlayerScore > activePlayerScore) {
                inactivePlayer.roundsWon += 1;
            }
            this.switchActivePlayer();
            activePlayer.preRoundCleanUp();
            inactivePlayer.preRoundCleanUp();
        }
        // rerender everything
        activePlayer.renderHand();
        this.board.renderPlayersRows(activePlayer);
        activePlayer.renderInfoPanel();
        inactivePlayer.renderHand();
        this.board.renderPlayersRows(inactivePlayer);
        inactivePlayer.renderInfoPanel();
    }

    init() {
        for (let player of this.players) {
            player.renderHand();
            player.renderInfoPanel();
            const playerInfoPanel = document.querySelector(`.player-info[data-player-id="${player.id}"]`);
            playerInfoPanel.querySelector('.player-info__end-round')
                           .addEventListener('click', () => {
                               player.finishRound();
                               game.playTurn();
                           });
        }
    }

    logStats() {
        const statsString = `
            Player One current score: ${this.players[0].currentScore}
            Player One rounds won: ${this.players[0].roundsWon}
            Player Two current score: ${this.players[1].currentScore}
            Player Two rounds won: ${this.players[1].roundsWon} 
        `;
        console.log(statsString);
    }

}