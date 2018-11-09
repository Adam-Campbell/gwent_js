/*
card schema:
{
    name: name of card,
    baseScore: base score of card
    type: type of unit - string value of 'infantry', 'ranged', 'siege' or 'mixed'
    image: url for image of card
    isHero: boolean, true if card is hero
    behaviours: an array of any special behaviours the card possesses, possible values: [
                    'scorch',
                    'commanders horn',
                    'summon',
                    'spy',
                    'tight bond',
                    'heal',
                    'morale boost'
                ]
}
*/


/*
the schema for each card will have to be updated to have a cardType property, with the following
possible values:

unit card
scorch unit card
summon unit card
spy unit card
heal unit card
tight bond unit card
morale boost unit card
commanders horn unit card
weather card
clear weather card
scorch card
decoy card
commanders horn card

*/


const cardData = [
    {
        name: 'geralt',
        baseScore: 15,
        type: 'infantry',
        isHero: true,
        ability: cardAbilities.standard,
        image: 'geralt.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'ciri',
        baseScore: 15,
        type: 'infantry',
        isHero: true,
        ability: cardAbilities.standard,
        image: 'ciri.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'yennefer',
        baseScore: 7,
        type: 'ranged',
        isHero: true,
        ability: cardAbilities.heal,
        image: 'yennefer.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'dandelion',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        ability: cardAbilities.commandersHornUnit,
        image: 'dandelion.jpg',
        cardType: cardTypes.commandersHornUnitCard
    },
    {
        name: 'dijkstra',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        ability: cardAbilities.spy,
        image: 'dijkstra.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'villentretenmerth',
        baseScore: 7,
        type: 'infantry',
        isHero: false,
        ability: cardAbilities.scorchUnit,
        image: 'villentretenmerth.jpg',
        cardType: cardTypes.scorchUnitCard
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        ability: cardAbilities.tightBond,
        bondGroup: bondGroups.northernRealms.blueStripe,
        image: 'blue_stripes_commando.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        ability: cardAbilities.tightBond,
        bondGroup: bondGroups.northernRealms.blueStripe,
        image: 'blue_stripes_commando.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'crinfrid reaver',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        ability: cardAbilities.tightBond,
        bondGroup: bondGroups.northernRealms.crinfridReaver,
        image: 'crinfrid_reaver.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'crinfrid reaver',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        ability: cardAbilities.tightBond,
        bondGroup: bondGroups.northernRealms.crinfridReaver,
        image: 'crinfrid_reaver.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'trebuchet',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'trebuchet.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'kaedweni siege expert',
        baseScore: 1,
        type: 'siege',
        isHero: false,
        ability: cardAbilities.moraleBoost,
        image: 'kaedweni_siege_expert_1.jpg',
        cardType: cardTypes.moraleBoostUnitCard
    },
    {
        name: 'dethmold',
        baseScore: 6,
        type: 'ranged',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'dethmold.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'siegfried',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'siegfried.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'yarpen zigrin',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'yarpen_zigrin.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'sabrina',
        baseScore: 4,
        type: 'ranged',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'sabrina.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'sile',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'sile.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'triss',
        baseScore: 7,
        type: 'infantry',
        isHero: true,
        ability: cardAbilities.standard,
        image: 'triss.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'trebuchet',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'trebuchet_alt.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'dun banner medic',
        baseScore: 5,
        type: 'siege',
        isHero: false,
        ability: cardAbilities.heal,
        image: 'dun_banner_medic.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'ballista',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        ability: cardAbilities.standard,
        image: 'ballista.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'catapult',
        baseScore: 8,
        type: 'siege',
        isHero: false,
        ability: cardAbilities.tightBond,
        bondGroup: bondGroups.northernRealms.catapult,
        image: 'catapult.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'catapult',
        baseScore: 8,
        type: 'siege',
        isHero: false,
        ability: cardAbilities.tightBond,
        bondGroup: bondGroups.northernRealms.catapult,
        image: 'catapult.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'decoy',
        image: 'decoy.jpg',
        cardType: cardTypes.decoyCard
    },
    {
        name: 'commanders horn',
        image: 'commanders_horn.jpg',
        cardType: cardTypes.commandersHornCard
    },
    {
        name: 'scorch',
        image: 'scorch.jpg',
        cardType: cardTypes.scorchCard
    },
    {
        name: 'biting frost',
        image: 'biting_frost.jpg',
        type: 'infantry',
        cardType: cardTypes.weatherCard
    },
    {
        name: 'impenetrable fog',
        image: 'impenetrable_fog.jpg',
        type: 'ranged',
        cardType: cardTypes.weatherCard
    },
    {
        name: 'torrential rain',
        image: 'torrential_rain.jpg',
        type: 'siege',
        cardType: cardTypes.weatherCard
    },
    {
        name: 'clear weather',
        image: 'clear_weather.jpg',
        cardType: cardTypes.clearWeatherCard
    }
];