class Game {
    constructor(playerOneName, playerOneFaction, playerTwoName, playerTwoFaction) {
        this.cardBank = {};
        this.players = this.createPlayers(playerOneName, playerOneFaction, playerTwoName, playerTwoFaction);
        this.board = new Board(this.players[0], this.players[1]);
    }

    /** 
    * Creates two Player objects
    * @return  {array}   Array containing the Player objects
    */
    createPlayers(playerOneName, playerOneFaction, playerTwoName, playerTwoFaction) {
        return [
            new Player(playerOneName, playerOneFaction, 0, true, this),
            new Player(playerTwoName, playerTwoFaction, 1, false, this)
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

    getPlayerById(id) {
        return this.players.find(player => player.id === id);
    }

    /** 
    * Contains all the logic for playing a turn
    */
    playTurn() {
        // grab references to the active and inactive players
        const activePlayer = this.activePlayer;
        const inactivePlayer = this.inactivePlayer;

        // update the 'state' of the board:
        activePlayer.updatePlayerScore();
        inactivePlayer.updatePlayerScore();

        // call all the render functions to update the view with the new state.
        // any extraneous rerenders will be dealt with by the respective render functions.
        activePlayer.renderHand();
        this.board.renderPlayersRows(activePlayer);
        activePlayer.refreshInfoPanel();
        inactivePlayer.renderHand();
        this.board.renderPlayersRows(inactivePlayer);
        inactivePlayer.refreshInfoPanel();

        if (inactivePlayer.continueRound) {
            this.board.renderSwapPlayersModal(() => {
                this.switchActivePlayer();
                this.activePlayer.renderHand();
                this.activePlayer.refreshInfoPanel();
                this.inactivePlayer.renderHand();
                this.inactivePlayer.refreshInfoPanel();
            });
        } else if (!activePlayer.continueRound) {
            let winner = '';
            const activePlayerScore = activePlayer.currentScore;
            const inactivePlayerScore = inactivePlayer.currentScore;
            if (activePlayerScore > inactivePlayerScore) {
                activePlayer.roundsWon += 1;
                winner = activePlayer.name;
            } else if (inactivePlayerScore > activePlayerScore) {
                inactivePlayer.roundsWon += 1;
                winner = inactivePlayer.name;
            }
            this.board.renderEndOfRoundModal(winner, () => {
                this.activePlayer.preRoundCleanUp();
                this.inactivePlayer.preRoundCleanUp();
            });
        }

    }

    /** 
    * Performs necessary work to initialise the game.
    */
    init() {
        this.board.renderBoardSkeleton();
        for (let player of this.players) {
            player.renderHand();
            player.renderInfoPanel();
        }
        // const startScreenElement = document.querySelector('.player-select');
        // document.body.removeChild(startScreenElement);
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