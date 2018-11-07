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
    // calculateScore() {
    //     // This is just a simple implementation and will need to change once the more complex
    //     // card behaviours are introduced.
    //     const computedScore = this.units.reduce(function(acc, curr, index) {
    //         return acc + curr.baseScore;
    //     }, 0);
    //     //return computedScore;
    //     this.score = computedScore;

    //     // more advanced implementation
    // }
    calculateScore() {
        this.ooComputeScore();
        this.setScore();
    }

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

    ooComputeScore() {
        const regCards = this.units.filter(card => !card.isHero);
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
        const bondCards = regCards.filter(card => card instanceof TightBondCard);
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
                card.currentScore = card.baseScore * bondGroups[card.bondGroup];
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
            const commandersHornCards = regCards.filter(card => card instanceof CommandersHornCard);
            // if there is one commanders horn card, double the currentScore of every non hero card
            // on the row except for the commanders horn card itself. 
            if (commandersHornCards.length === 1) {

                for (let card of regCards) {
                    if (!(card instanceof CommandersHornCard)) {
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
            const moraleBoostCards = regCards.filter(card => card instanceof MoraleBoostCard);
            // if exactly one morale boost card is present, add 1 to the currentScore of every
            // non hero card on row besides the morale boost card itslf. 
            if (moraleBoostCards.length === 1) {
                for (let card of regCards) {
                    if (!(card instanceof MoraleBoostCard)) {
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

    setScore() {
        const newScore = this.units.reduce((acc, nextCard, index) => {
            return acc + nextCard.currentScore;
        }, 0);
        this.score = newScore;
    }
}