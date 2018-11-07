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
    * Gets the currently inactive player
    * @return  {Object}  Player object that is currently inactive 
    */
    get inactivePlayer() {
        return this.players.find(player => !player.active);
    }

    /** 
    * Contains all the logic for playing a turn
    */
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

    /** 
    * Performs necessary work to initialise the game.
    */
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

    /** 
    * This is merely a convenience function used in development. Prints a string to the console
    * showing each players current score and number of rounds won. 
    */
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