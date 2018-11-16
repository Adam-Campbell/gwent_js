/*

External interface:

Properties:
name - {string} - the name of this card.
id - {string} - the id of this card.
image - {string} - url for the image for this card.
ownerId - {number} - the id for the player that currently owns this card.
gameRef - {object} - a reference to the main Game object.

Methods:
render() - renders this card.
renderCardBack() - renders the back of this card. 
renderJumbo() - renders a larger version of this card in a modal.
playCard() - plays the card from the players hand onto the board, plus any additional logic. 
killCard() - resets the cards current score to its base score and adds to the players graveyard. 

*/

class ClearWeatherCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    playCard() {
        const game = this.gameRef;
        // remove the card from the players hand
        game.activePlayer.removeFromHand(this);
        // move it into the players graveyard
        game.activePlayer.graveyard.push(this);
        // loop over every row on the board and set the weatherEffect boolean
        // to false for every row
        game.board.rows.forEach(row => row.weatherEffect = false);
        // call game.playTurn()
        game.playTurn();
    }

}