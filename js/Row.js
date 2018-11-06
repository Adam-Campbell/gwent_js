class Row {
    constructor(owner, type) {
        this.owner = owner;
        this.type = type;
        this.units = [];
        this.score = 0;
        this.weatherEffect = false;
        this.commandersHorn = false;
    }

    /** 
    * Adds a unit to this row 
    * @param   {Object}    cardObject to be added to the row .
    */
    addUnit(cardObject) {
        this.units.push(cardObject);
    }

    removeUnit(cardObject) {
        this.units = this.units.filter(unit => unit.id !== cardObject.id);
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

        // more advanced implementation



    }

    render() {
        const targetElement = document.querySelector(`.row[data-player-id="${this.owner.id}"][data-unit-type="${this.type}"]`);
        const frag = document.createDocumentFragment();
        if (this.units.length) {
            for (let card of this.units) {
                frag.appendChild(card.render(true));
            }
        }
        targetElement.innerHTML = "";
        targetElement.appendChild(frag);
    }

    reset() {
        this.owner.graveyard = [...this.owner.graveyard, ...this.units];
        this.units = [];
        this.score = 0;
        this.weatherEffect = false;
        this.commandersHorn = false;
        this.render();
    }

    functionallyComputeScore() {
        // seperate the hero cards and regular cards
        const heroCards = this.units.filter(card => card.isHero);
        const regCards = this.units.filter(card => !card.isHero);
        // calculate seperate total scores for regular and hero cards
        let hTot = heroCards.reduce((acc, nextCard, index) => {
            return acc + nextCard.baseScore;
        }, 0);
        let rTot = regCards.reduce((acc, nextCard, index) => {
            return acc + nextCard.baseScore;
        }, 0);

        // if weather effect is present then every regular card just has a score of 1
        if (this.weatherEffect) {
            rTot = regCards.length;
        }

        if (!this.weatherEffect) {
            let visitedGroups = {};
            for (let card of regCards) {
                if (!visitedGroups[card.bondGroup]) {
                    visitedGroups[card.bondGroup] = 1;
                } else {
                    visitedGroups[card.bondGroup] += 1;
                }
            }
            for (let card of regCards) {
                if (card instanceof TightBondCard && visitedGroups[card.bondGroup] > 1) {
                    rTot += card.baseScore * visitedGroups[card.bondGroup];
                }
            }
        }
        
        // if commanders horn present then every regular card is doubled, or in other words
        // rTot is doubled. 
        if (this.commandersHorn) {
            rTot *= 2;
        } else {
            // if there is no commanders horn on the row, but there is a card with the commanders horn
            // property, use that instead
            const commandersHornCard = regCards.find(card => card instanceof CommandersHornCard);
            if (commandersHornCard) {
                rTot = (rTot * 2) - commandersHornCard.baseScore;
            }
        }

        const moraleBoostCard = regCards.find(card => card instanceof MoraleBoostCard);
        if (moraleBoostCard) {
            rTot += regCards.length - 1;
        }

        return rTot + hTot;

    }
}