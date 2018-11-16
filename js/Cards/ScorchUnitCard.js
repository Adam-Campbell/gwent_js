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

class ScorchUnitCard extends UnitCard {
    constructor(name, id, image, ownerId, gameRef, type, baseScore, isHero) {
        super(name, id, image, ownerId, gameRef, type, baseScore, isHero);
    }

    /** 
    * All of the base playCard logic, plus the scorch functionality.
    * No return value
    */
    playCard() {
        const game = this.gameRef;
        const activePlayer = game.activePlayer;
        const inactivePlayer = game.inactivePlayer;
        // remove this card from the players hand
        activePlayer.removeFromHand(this);
        // add it to the relevant row on the board
        const activePlayersRows = game.board.getPlayersRows(activePlayer);
        const rowForCard = activePlayersRows.filter(row => row.type === this.type)[0];
        rowForCard.addCard(this);

        // if inactivePlayers infantry row has a score >= 10, the find the strongest
        // non-hero card(s), remove them from the row and place them into 
        const rowToScorch = game.board.getPlayersRows(inactivePlayer)
                                      .find(row => row.type === unitTypes.infantry);
        if (rowToScorch.score >= 10) {
            //const cardsToScorch = this.determineCardsToScorch(rowToScorch);
            this._determineCardsToScorch(rowToScorch).forEach(card => {
                rowToScorch.removeCard(card);
                card.killCard(inactivePlayer);
            });
        }

        // call the main game.playTurn method
        game.playTurn();
    }

    /** 
    * Given a row, it finds the non-hero card(s) with the highest score
    * and returns the cardObjects for those cards. 
    * @return {Array}  An array of 0 or more cardObjects
    */
    _determineCardsToScorch(row) {
        const heroesFilteredOut = row.units.filter(card => card.isHero === false);
        let highestScore = 0;
        for (let card of heroesFilteredOut) {
            if (card.baseScore > highestScore) {
                highestScore = card.baseScore;
            }
        } 
        const cardsToScorch = heroesFilteredOut.filter(card => card.baseScore === highestScore);
        return cardsToScorch;
    }   

}