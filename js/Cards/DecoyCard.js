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

class DecoyCard extends Card {
    constructor(name, id, image, ownerId, gameRef) {
        super(name, id, image, ownerId, gameRef);
    }

    playCard() {
        // remove the card from the players hand
        // swap it with an elligible card from the players side of the board:
        // move that card from its row back into the players hand and - 
        // move the decoy card onto the row that the card was occupying
        // call game.playTurn()


        //
        // implementation
        // this will benefit from having unique ids for every card.
        // 
        // when this card is played it attaches an event listener to the window - listening for clicks. 
        // click must be on a card on the active players side of the board. 
        //
        // when a card has been clicked, the rest of the logic is carried out. The card is removed from its
        // row and placed back into the players hand. The decoy is moved from the players hand into the row
        // that the card was occupying.  
        //
        // Then the game.playTurn() method is called. Keep in mind no rendering has taken place until the call
        // to game.playTurn() happens, so this is when the user will get visual feedback that the cards have
        // swapped.
        //
        // After the call to game.playTurn() the eventlistener will unset itself, since we don't want redundant
        // event listeners.
        //
        // A final thought - I don't think this will stop the user from being able to click on other cards/things 
        // like that to progress the game even though they shouldn't be able to since they're midmove at this 
        // point. It may be worth introducing something like a frozen property on the game object, that while true
        // will prevent certain actions from being allowed. This could be useful not only for this particular
        // method but in other situations as well.
        //
        //
        const game = this.gameRef;
        const self = this;
        const thisId = this.id;
        function handleClick(e) {
            const el = e.target;
            if (el.classList.contains('card-image') && el.parentElement.dataset.cardId !== thisId) {
                const cardId = el.parentElement.dataset.cardId;
                const playersRows = game.board.getPlayersRows(game.activePlayer);
                let parentRow = null;
                let cardObject = null;
                // determine whether the card clicked is in one of active players rows, if it is
                // then grab references to both the cardObject itself, and the row that the card
                // is on.
                for (let row of playersRows) {
                    cardObject = row.units.find(card => card.id === cardId);
                    if (cardObject) {
                        parentRow = row;
                        break;
                    }
                }
                // if we haven't found a valid card object by this point, then just return and skip the
                // rest of the function. An invalid card includes not finding a cardObject at all, or finding
                // one that is either a hero card or some type of non unit card.
                if (!cardObject || cardObject.isHero || !(cardObject instanceof UnitCard)) {
                    return;
                }
                // if we reach this point then cardObject is valid
                // remove cardObject from parentRow and insert it into the players hand
                parentRow.removeCard(cardObject);
                game.activePlayer.hand.push(cardObject);
                // remove the decoy card from the players hand and insert it into parentRow
                game.activePlayer.removeFromHand(self);
                parentRow.addCard(self);
                // call the game.playTurn() method.
                game.playTurn();
                //console.log(parentRow, cardObject);
                window.removeEventListener('click', handleClick);
            }
            
        }
        window.addEventListener('click', handleClick);
    }

}