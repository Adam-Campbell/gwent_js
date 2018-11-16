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

*/

class ScorchCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    /**
     * Play the card and perform the scorching logic.
     */
    playCard() {
        // remove the card from the players hand
        // move it into the players graveyard
        // find the highest value non-hero unit card(s) across both players
        // remove those cards from their rows and move them into their respective owners graveyards
        // the exact logic for this can be based off of the logic inside the ScorchUnitCard class,
        // but will need alterations as this class doesn't behave exactly the same. 
        // finally call game.playTurn()


        // possible implementation
        //
        // For each row find the highest 'scorchable' cards on that row, and keep references to the
        // cards themselves, as well as the actual score of those cards.
        //
        // Once this has been done for each row, just compare the result from each row - the one with  
        // the highest score, or multiple rows if the highest score is shared between multiple rows, 
        // will be the row that needs scorching.
        //
        // We already have references to the cards on those rows that need to be scorched, so just 'scorch'
        // those cards by removing them from the row and moving them into their respective owners graveyards.
        //
        const game = this.gameRef;
        const struct = {
            score: 0,
            rows: []
        };

        const rowLeaders = game.board.rows.map(row => {
            return this._findRowLeaders(row);
        });
        for (let row of rowLeaders) {
            if (row.score > struct.score) {
                struct.score = row.score;
                struct.rows = [row];
            } else if (row.score === struct.score) {
                struct.rows.push(row);
            }
        }
        for (let rowObject of struct.rows) {
            for (let card of rowObject.cards) {
                let cardOwner = game.getPlayerById(card.ownerId);
                rowObject.row.removeCard(card);
                card.killCard(cardOwner);
            }
        }
        game.playTurn();
    }

    /** 
     * Given a particular row, find the cards with the highest currentScore in that row
     * @param {Object} row - the row on which to operate on
     * @return {Object} - an object containing the highest score found on the row, and
     * all of the cards that had that score.
    */
    _findRowLeaders(row) {
        let struct = {
            score: 0,
            row: row,
            cards: []
        };

        const filteredCards = row.units.filter(card => card instanceof UnitCard && !card.isHero);
        for (let card of filteredCards) {
            if (card.currentScore > struct.score) {
                struct.score = card.currentScore;
                struct.cards = [card];
            } else if (card.currentScore === struct.score) {
                struct.cards.push(card);
            }
        } 
        return struct;
    }
}