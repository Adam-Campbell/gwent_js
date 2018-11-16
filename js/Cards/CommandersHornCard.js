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

class CommandersHornCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    playCard() {
        // remove the card from the players hand
        // move the card into the players graveyard
        // for a row specified by the player, on the players side of the board only,
        // set the commandersHorn property on that row to true

        //
        // implementation
        //
        // when clicked it will add an event listener to the window, similarl to the approach used in the
        // decoy implementation. This event listener will listen for clicks on the rows, specifically the
        // rows for the current player, ie activePlayer. 
        //
        // when a row has been selected, we will set the commandersHorn property on that row to true, then
        // move this card from the players hand into the players graveyard, then call game.playTurn(), and
        // finally we will unset the event listener that we added.
        //
        //
        const self = this;
        const game = this.gameRef;
        function handleClick(e) {
            // check that either the target element, or a parent of the target element, is a row,
            // and store reference in rowNode if true
            const path = e.path;
            let rowNode = null;
            for (let node of path) {
                if (node.classList && node.classList.contains('row')) {
                    rowNode = node;
                    break;
                }
            }
            // If no row node found just return early from the function
            if (!rowNode) {
                return;
            }

            // determine the owner of the row from data-player-id attribute
            const rowOwner = parseInt(rowNode.dataset.playerId);
            // verify that the owner is the current player
            const isOwner = rowOwner === game.activePlayer.id;
            if (isOwner) {
                const rowType = rowNode.dataset.unitType;
                const rowObject = game.board.getPlayersRows(game.activePlayer)
                                .find(row => row.type === rowType);
                rowObject.commandersHorn = true;
                game.activePlayer.removeFromHand(self);
                game.activePlayer.graveyard.push(self);
                game.playTurn();
                window.removeEventListener('click', handleClick);
            }

        }
        window.addEventListener('click', handleClick);
    }

}