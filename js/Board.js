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
    
}