/*

External interface:

Properties:
cardBank - a dictionary of every single card present in the game, with the cards unique id 
used as a key.
players - an array of Player objects representing the players of the game. 
board - the Board object representing the game board. 
activePlayer - the Player object for the currently active player.
inactivePlayer - the Player object for the currently inactive player.

Methods:
getPlayerById() - returns the Player object with a specific id.
playTurn() - contains all the logic to play the next turn of the game.
init() - initializes the game. 


Methods:


*/

class Game {
    constructor(playerOneName, playerOneFaction, playerTwoName, playerTwoFaction) {
        this.cardBank = {};
        this.players = this._createPlayers(playerOneName, playerOneFaction, playerTwoName, playerTwoFaction);
        this.board = new Board(this.players[0], this.players[1]);
    }

    /** 
    * Creates two Player objects
    * @return  {array}   Array containing the Player objects
    */
    _createPlayers(playerOneName, playerOneFaction, playerTwoName, playerTwoFaction) {
        return [
            new Player(playerOneName, playerOneFaction, 0, true, this),
            new Player(playerTwoName, playerTwoFaction, 1, false, this)
        ];
    }

    /** 
    * Switches the active player
    * No params or return value
    */
    _switchActivePlayer() {
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
     * Get the Player object with a specific id
     * @param {number} id - the id for the player 
     * @returns {Object} - the Player object with the specified id.
     */
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
            this.board.renderSwapPlayersScreen(() => {
                this._switchActivePlayer();
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
            this.board.renderEndOfRoundScreen(winner, () => {
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

}