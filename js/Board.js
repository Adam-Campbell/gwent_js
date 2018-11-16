class Board {
    constructor(playerOne, playerTwo) {
        this.rows = this.createRows(playerOne, playerTwo);
    }

    /** 
    * Creates the rows on the board
    * @return  {array}   Array of Row objects
    */
    createRows(playerOne, playerTwo) {
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
    
    renderModal(contentToRender, withButton=false) {
        const docFrag = document.createDocumentFragment();
        const modalOverlay = document.createElement('div');
        const modalContentContainer = document.createElement('div');
        modalOverlay.classList.add('modal__overlay');
        modalContentContainer.classList.add('modal__content');
        modalContentContainer.appendChild(contentToRender);
        modalOverlay.appendChild(modalContentContainer);
        if (withButton) {
            const modalButton = document.createElement('button');
            modalButton.classList.add('modal__button');
            modalButton.textContent = 'X';
            modalButton.addEventListener('click', function() {
                document.body.removeChild(modalOverlay);
            });
            modalOverlay.appendChild(modalButton);
        }
        docFrag.appendChild(modalOverlay);
        document.body.appendChild(docFrag);
    }

    renderSwapPlayersModal(callback) {
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
            // these would be good to extract into a callback function that can be 
            // passed into this rendering function
            // game.switchActivePlayer();
            // game.activePlayer.renderHand();
            // game.activePlayer.refreshInfoPanel();
            // game.inactivePlayer.renderHand();
            // game.inactivePlayer.refreshInfoPanel();
            callback();
            // this stays here though
            document.body.removeChild(modal);
        });
        modal.appendChild(text);
        modal.appendChild(button);
        docFrag.appendChild(modal);
        
        setTimeout(function() {
            document.body.appendChild(docFrag);
        }, 1000);
    }

    renderEndOfRoundModal(winner, callback) {
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
            // these would be good to extract into a callback function that can be 
            // passed into this rendering function
            // game.activePlayer.preRoundCleanUp();
            // game.inactivePlayer.preRoundCleanUp();
            callback();
            // this stays here though
            document.body.removeChild(modal);
        });

        modal.appendChild(text);
        modal.appendChild(button);
        docFrag.appendChild(modal);
        setTimeout(function() {
            document.body.appendChild(docFrag);
        }, 1000);
    } 

    renderBoardSkeleton() {
        console.log('renderBoardSkeleton was called!!');
        const nodeToRenderTo = document.querySelector('.container');
        const boardHTML = createHTML({
            templateId: 'boardTemplate'
        });
        nodeToRenderTo.innerHTML = boardHTML;
    }
}