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

    /** 
    * Removes a unit from this row 
    * @param   {Object}    cardObject to be removed from the row.
    */
    removeUnit(cardObject) {
        this.units = this.units.filter(unit => unit.id !== cardObject.id);
    }

    /** 
    * Render this particular row.
    */
    render() {
        const targetRow = document.querySelector(`.row[data-player-id="${this.owner.id}"][data-unit-type="${this.type}"]`);
        const cardContainer = targetRow.querySelector('.row__inner');
        const rowScore = targetRow.querySelector('.row__score-text'); 
        const frag = document.createDocumentFragment();
        if (this.units.length) {
            for (let card of this.units) {
                frag.appendChild(card.render(true));
            }
        }
        cardContainer.innerHTML = "";
        cardContainer.appendChild(frag);
        rowScore.textContent = this.score;
    }

    /** 
    * Reset this row to its original, 'blank' state.
    * Used to reset the row between rounds.
    */
    reset() {
        this.owner.graveyard = [...this.owner.graveyard, ...this.units];
        this.units = [];
        this.score = 0;
        this.weatherEffect = false;
        this.commandersHorn = false;
        this.render();
    }

    /** 
    * Combines the computeScore and setScore methods. Other objects call this method rather
    * than directly calling the other two methods so that the internal workings can be freely changed
    * without affecting the objects 'contract' with other parts of the program.  
    */
    calculateScore() {
        this.computeScore();
        this.setScore();
    }

    /** 
    * Updates the currentScore property for each of the cards currently on this row, according to the
    * current state of the row. All logic involved in score modifiers etc is in this method.
    */
    computeScore() {
        const regCards = this.units.filter(card => card instanceof UnitCard && !card.isHero);
        if (regCards.length === 0) return;
        // to begin with reset everything back to the base score
        for (let card of regCards) {
            card.currentScore = card.baseScore;
        }
        // first deal with weather effects
        if (this.weatherEffect) {
            for (let card of regCards) {
                card.currentScore = 1;
            }
        }

        // then we deal with tight bond cards
        const bondGroups = {};
        const bondCards = regCards.filter(card => card instanceof TightBondUnitCard);
        if (bondCards.length) {
            // first determine which tight bond groups are present, and how many units from
            // each group are present. 
            for (let card of bondCards) {
                if (!bondGroups[card.bondGroup]) {
                    bondGroups[card.bondGroup] = 1;
                } else {
                    bondGroups[card.bondGroup] += 1;
                }
            }
            // now we go over all of them again and apply the appropriate modifiers, with
            // full knowledge of how many units from each bondGroup are present.
            for (let card of bondCards) {
                card.currentScore = card.currentScore * bondGroups[card.bondGroup];
            }
        }
        

        // then we deal with row-level commanders horns
        if (this.commandersHorn) {
            for (let card of regCards) {
                card.currentScore *= 2;
            }
            // if and only if commanders horn not present on row, deal with any cards that 
            // have the commanders horn ability.
        } else {
            const commandersHornCards = regCards.filter(card => card instanceof CommandersHornUnitCard);
            // if there is one commanders horn card, double the currentScore of every non hero card
            // on the row except for the commanders horn card itself. 
            if (commandersHornCards.length === 1) {

                for (let card of regCards) {
                    if (!(card instanceof CommandersHornUnitCard)) {
                        card.currentScore *= 2;
                    }
                }
                // if there are multiple commanders horn cards on the row, then double the currentScore
                // of every non hero card on the row including the commanders horn cards.
            } else if (commandersHornCards.length > 1) {
                for (let card of regCards) {
                    card.currentScore *= 2;
                }
            }

            // then we deal with morale boost cards
            const moraleBoostCards = regCards.filter(card => card instanceof MoraleBoostUnitCard);
            // if exactly one morale boost card is present, add 1 to the currentScore of every
            // non hero card on row besides the morale boost card itslf. 
            if (moraleBoostCards.length === 1) {
                for (let card of regCards) {
                    if (!(card instanceof MoraleBoostUnitCard)) {
                        card.currentScore += 1;
                    }
                }
                // if there are multiple morale boost cards in the row, then just add 1 to the
                // current score of every non hero card on row
            } else if (moraleBoostCards.length > 1) {
                for (let card of regCards) {
                    card.currentScore += 1;
                }
            }
        }
    }

    /** 
    * Retrieves the currentScore value for each card on this row and sums them then sets this rows
    * score property to that value.
    */
    setScore() {
        const onlyUnitCards = this.units.filter(card => card instanceof UnitCard);
        const newScore = onlyUnitCards.reduce((acc, nextCard, index) => {
            return acc + nextCard.currentScore;
        }, 0);
        this.score = newScore;
    }
    
}