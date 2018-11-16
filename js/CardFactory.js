class CardFactory {

    /**
     * Method to create a Card object from raw card data, the exact card subclass
     * used depends on the input data given. 
     * @param {Object} optionsObject, accepts the options:
     *     cardData - {object} - the object holding the card data
     *     ownerId - {number} - the id for the player who will own this card
     *     gameRef - {object} - a reference to the main game object
     * @returns {Object} a card object
     */
    createCard(optionsObject) {
        const { cardData, ownerId, gameRef } = optionsObject;
        const cardId = generateId(12);

        switch(cardData.cardType) {
                
            case cardTypes.unitCard:
                return new UnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero
                );

            case cardTypes.scorchUnitCard:
                return new ScorchUnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero
                );

            case cardTypes.summonUnitCard:
                return new SummonUnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero
                );

            case cardTypes.spyUnitCard:
                return new SpyUnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero
                );

            case cardTypes.healUnitCard:
                return new HealUnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero
                );

            case cardTypes.tightBondUnitCard:
                return new TightBondUnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero,
                    cardData.bondGroup
                );

            case cardTypes.moraleBoostUnitCard:
                return new MoraleBoostUnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero
                );

            case cardTypes.commandersHornUnitCard:
                return new CommandersHornUnitCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type,
                    cardData.baseScore,
                    cardData.isHero
                );

            case cardTypes.weatherCard:
                return new WeatherCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef,
                    cardData.type
                );

            case cardTypes.clearWeatherCard:
                return new ClearWeatherCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef
                );

            case cardTypes.scorchCard:
                return new ScorchCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef
                );

            case cardTypes.decoyCard:
                return new DecoyCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef
                );

            case cardTypes.commandersHornCard:
                return new CommandersHornCard(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef
                );

            default:
                return new Card(
                    cardData.name,
                    cardId,
                    cardData.image,
                    ownerId,
                    gameRef
                );
        }
    }
}