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
playCard() - plays the card from the players hand onto the board, plus any additional logic.
killCard() - resets the cards current score to its base score and adds to the players graveyard. 

*/

class SummonUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
    }

    /** 
    * All of the base playCard logic, plus the summon functionality.
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

        // search activePlayers deck and hand for all corresponding summon cards
        // add all of these cards to the board as well

        // call the main game.playTurn method
        game.playTurn();
    }

}