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

    playTurn() {
        const activePlayer = this.activePlayer;
        const otherPlayer = this.players.find(function(player) {
            return player !== activePlayer;
        });
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
        
        // as long as activePlayer is still playing, play their current card
        if (activePlayer.continueRound) {
            activePlayer.playCurrentCard();
            activePlayer.renderHand();
            this.board.renderPlayersRows(activePlayer);
        }
        // always update both players score on every turn
        activePlayer.updatePlayerScore();
        otherPlayer.updatePlayerScore();
        // if otherPlayer is still playing, switch to them
        if (otherPlayer.continueRound) {
            this.switchActivePlayer();
            // for this block to executr both players must have finished so end round
        } else if (!activePlayer.continueRound) {
            // end round logic
            const activePlayerScore = activePlayer.currentScore;
            const otherPlayerScore = otherPlayer.currentScore;
            if (activePlayerScore > otherPlayerScore) {
                activePlayer.roundsWon += 1;
            } else if (otherPlayerScore > activePlayerScore) {
                otherPlayer.roundsWon += 1;
            }
            activePlayer.preRoundCleanUp();
            otherPlayer.preRoundCleanUp();
        }
    }

    init() {
        for (let player of this.players) {
            player.renderHand();
            document.querySelector(`.end-round-button[data-player-id="${player.id}"]`)
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