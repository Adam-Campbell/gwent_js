/*

External interface:

Properties:
name - {string} - the name of this card.
id - {string} - the id of this card.
image - {string} - url for the image for this card.
ownerId - {number} - the id for the player that currently owns this card.
gameRef - {object} - a reference to the main Game object.
type - {string} - the type of unit this card is.
baseScore - {number} - the base score for this card.
isHero - {boolean} - true if this is a hero card, else false. 
currentScore - {number} - the current score for this card, derived property. 

Methods:
render() - renders this card.
renderCardBack() - renders the back of this card. 
renderJumbo() - renders a larger version of this card in a modal.
playCard() - plays the card from the players hand onto the board. 
killCard() - resets the cards current score to its base score and adds to the players graveyard. 

*/

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
        rowForCard.addCard(this);
        // call the main game.playTurn method
        game.playTurn();
    }

    /** 
    * Adds this card to the players graveyard and resets the cards currentScore to its baseScore
    * @param   {Object}    playerObject - the player whose graveyard card should be added to.
    */
    killCard(playerObject) {
        this._resetScore();
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
    _resetScore() {
        this._currentScore = this.baseScore;
    }
}