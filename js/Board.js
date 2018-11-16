/*

External interface:

Properties:
rows - an array of Row objects representing the rows of the board.

Methods:
getPlayersRows() - returns an array of all of the row objects owned by a specific player.
renderPlayersRows() - calls the render() method on all rows owned by a specific player.
renderSwapPlayersScreen() - renders the transition screen for between player turns.
renderEndOfRoundScreen() - renders the transition screen for between game rounds. 
renderBoardSkeleton() - renders the main markup for the board, but not the details such
as cards on rows, scores etc.

*/

class Board {
    constructor(playerOne, playerTwo) {
        this.rows = this._createRows(playerOne, playerTwo);
    }

    /** 
    * Creates the rows on the board
    * @return  {array}   Array of Row objects
    */
    _createRows(playerOne, playerTwo) {
        return [
            new Row(playerOne, 'siege'),
            new Row(playerOne, 'ranged'),
            new Row(playerOne, 'infantry'),
            new Row(playerTwo, 'siege'),
            new Row(playerTwo, 'ranged'),
            new Row(playerTwo, 'infantry')
        ];
    }

    /** 
    * Gets the rows for a particular player
    * @param   {Object}    playerObject to retrieve the rows for
    * @return  {array}   An array of the rows for that player
    */
    getPlayersRows(playerObject) {
        return this.rows.filter(row => row.owner.id === playerObject.id);
    }

    /** 
    * Renders the rows for a particular player
    * @param   {Object}    playerObject to render the rows for
    */
    renderPlayersRows(playerObject) {
        const playersRows = this.getPlayersRows(playerObject);
        for (let row of playersRows) {
            row.render();
        }
    }

    /**
     * Renders the transition screen between each players turn
     * @param {function} callback - the function to call once the next player clicks to 
     * start their turn.
     */
    renderSwapPlayersScreen(callback) {
        const docFrag = document.createDocumentFragment();
        const modal = document.createElement('div');
        const text = document.createElement('p');
        const button = document.createElement('button');
        modal.classList.add('swap-players-modal');
        text.classList.add('swap-players-modal__text');
        text.textContent = `Next turn: ${game.inactivePlayer.name}`;
        button.classList.add('swap-players-modal__button');
        button.textContent = 'Start Turn';
        button.addEventListener('click', () => {
            callback();
            document.body.removeChild(modal);
        });
        modal.appendChild(text);
        modal.appendChild(button);
        docFrag.appendChild(modal);
        
        setTimeout(function() {
            document.body.appendChild(docFrag);
        }, 1000);
    }

    /**
     * Renders the transition screen between rounds.
     * @param {string} winner - the name of the player that won.
     * @param {function} callback - the function to be called once the next player clicks to being 
     * their turn. 
     */
    renderEndOfRoundScreen(winner, callback) {
        const docFrag = document.createDocumentFragment();
        const modal = document.createElement('div');
        const text = document.createElement('p');
        const button = document.createElement('button');
        modal.classList.add('end-of-round-modal');
        text.classList.add('end-of-round-modal__text');
        button.classList.add('end-of-round-modal__button');
        text.textContent = `${winner} won the round!`;
        button.textContent = 'Continue';
        button.addEventListener('click', () => {
            callback();
            document.body.removeChild(modal);
        });

        modal.appendChild(text);
        modal.appendChild(button);
        docFrag.appendChild(modal);
        setTimeout(function() {
            document.body.appendChild(docFrag);
        }, 1000);
    } 

    /**
     * Renders the 'skeleton' markup for the board, the layout for all of the individual
     * rows to be rendered into. 
     */
    renderBoardSkeleton() {
        const nodeToRenderTo = document.querySelector('.container');
        const boardHTML = createHTML({
            templateId: 'boardTemplate'
        });
        nodeToRenderTo.innerHTML = boardHTML;
    }
    
}