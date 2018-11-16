/*

External interface:

Properties:
name - {string} - the name of this card.
id - {string} - the id of this card.
image - {string} - url for the image for this card.
ownerId - {number} - the id for the player that currently owns this card.
gameRef - {object} - a reference to the main Game object.
type - {string} - the type of unit this card is.

Methods:
render() - renders this card.
renderCardBack() - renders the back of this card. 
renderJumbo() - renders a larger version of this card in a modal.
playCard() - plays the card from the players hand onto the board, plus any additional logic. 

*/

class WeatherCard extends Card {
    constructor(name, id, image, ownerId, gameRef, type) {
        super(name, id, image, ownerId, gameRef);
        this.type = type;
    }

    playCard() {
        const game = this.gameRef;
        // remove the card from the players hand
        game.activePlayer.removeFromHand(this);
        // move it into the players graveyard
        game.activePlayer.graveyard.push(this);
        // find the rows that correspond with this cards type property
        // set the weatherEffect property on those rows to true
        game.board.rows.filter(row => row.type === this.type)
                       .forEach(row => row.weatherEffect = true);
        // call game.playTurn()
        game.playTurn();
    }
}