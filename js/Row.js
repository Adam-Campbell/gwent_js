class Row {
    constructor(owner, type) {
        this.owner = owner;
        this.type = type;
        this.units = [];
        this.score = 0;
    }

    /** 
    * Adds a unit to this row 
    * @param   {Object}    unit to be added to the row .
    */
    addUnit(unit) {
        this.units.push(unit);
    }

    /** 
    * Computes the score for a particular row
    * @return  {number}   score for the row
    */
    calculateScore() {
        // This is just a simple implementation and will need to change once the more complex
        // card behaviours are introduced.
        const computedScore = this.units.reduce(function(acc, curr, index) {
            return acc + curr.baseScore;
        }, 0);
        //return computedScore;
        this.score = computedScore;
    }

    render() {
        const targetElement = document.querySelector(`.row[data-player-id="${this.owner.id}"][data-unit-type="${this.type}"]`);
        const frag = document.createDocumentFragment();
        if (this.units.length) {
            for (let card of this.units) {
                frag.appendChild(card.render());
            }
        }
        targetElement.innerHTML = "";
        targetElement.appendChild(frag);
    }
}