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

const neutralCards = [
    {
        name: 'geralt',
        baseScore: 15,
        type: 'infantry',
        isHero: true,
        image: 'geralt.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'ciri',
        baseScore: 15,
        type: 'infantry',
        isHero: true,
        image: 'ciri.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'yennefer',
        baseScore: 7,
        type: 'ranged',
        isHero: true,
        image: 'yennefer.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'dandelion',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        image: 'dandelion.jpg',
        cardType: cardTypes.commandersHornUnitCard
    },
    {
        name: 'villentretenmerth',
        baseScore: 7,
        type: 'infantry',
        isHero: false,
        image: 'villentretenmerth.jpg',
        cardType: cardTypes.scorchUnitCard
    },
    {
        name: 'triss',
        baseScore: 7,
        type: 'infantry',
        isHero: true,
        image: 'triss.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: "avallac'h",
        baseScore: 0,
        type: 'infantry',
        isHero: true,
        image: 'avallach.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'vesemir',
        baseScore: 6,
        type: 'infantry',
        isHero: false,
        image: 'vesemir.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'zoltan',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        image: 'zoltan.jpg',
        cardType: cardTypes.unitCard
    }
];

const specialCards = [
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

const northernRealmsCards = [
    ...neutralCards,
    ...specialCards,
    {
        name: 'esterad thyssen',
        baseScore: 10,
        type: 'infantry',
        isHero: true,
        image: 'esterad_thyssen.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'john natalis',
        baseScore: 10,
        type: 'infantry',
        isHero: true,
        image: 'john_natalis.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'vernon roche',
        baseScore: 10,
        type: 'infantry',
        isHero: true,
        image: 'vernon_roche.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'ves',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        image: 'ves.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'keira metz',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        image: 'keira_metz.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'pfi',
        baseScore: 1,
        type: 'infantry',
        isHero: false,
        image: 'pfi.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.northernRealms.pfi
    },
    {
        name: 'pfi',
        baseScore: 1,
        type: 'infantry',
        isHero: false,
        image: 'pfi.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.northernRealms.pfi
    },
    {
        name: 'pfi',
        baseScore: 1,
        type: 'infantry',
        isHero: false,
        image: 'pfi.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.northernRealms.pfi
    },
    {
        name: 'philippa eilhart',
        baseScore: 10,
        type: 'ranged',
        isHero: true,
        image: 'philippa_eilhart.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'redanian foot soldier',
        baseScore: 1,
        type: 'infantry',
        isHero: false,
        image: 'redanian_foot_soldier.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'redanian foot soldier',
        baseScore: 1,
        type: 'infantry',
        isHero: false,
        image: 'redanian_foot_soldier_alt.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'sheldon skaggs',
        baseScore: 4,
        type: 'ranged',
        isHero: false,
        image: 'sheldon_skaggs.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'dijkstra',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        image: 'dijkstra.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'stennis',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        image: 'stennis.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'thaler',
        baseScore: 1,
        type: 'siege',
        isHero: false,
        image: 'thaler.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        bondGroup: bondGroups.northernRealms.blueStripe,
        image: 'blue_stripes_commando.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        bondGroup: bondGroups.northernRealms.blueStripe,
        image: 'blue_stripes_commando.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        bondGroup: bondGroups.northernRealms.blueStripe,
        image: 'blue_stripes_commando.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        bondGroup: bondGroups.northernRealms.blueStripe,
        image: 'blue_stripes_commando.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'crinfrid reaver',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        bondGroup: bondGroups.northernRealms.crinfridReaver,
        image: 'crinfrid_reaver.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'crinfrid reaver',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        bondGroup: bondGroups.northernRealms.crinfridReaver,
        image: 'crinfrid_reaver.jpg',
        cardType: cardTypes.tightBondUnitCard
    },
    {
        name: 'kaedweni siege expert',
        baseScore: 1,
        type: 'siege',
        isHero: false,
        image: 'kaedweni_siege_expert_1.jpg',
        cardType: cardTypes.moraleBoostUnitCard
    },
    {
        name: 'kaedweni siege expert',
        baseScore: 1,
        type: 'siege',
        isHero: false,
        image: 'kaedweni_siege_expert_2.jpg',
        cardType: cardTypes.moraleBoostUnitCard
    },
    {
        name: 'kaedweni siege expert',
        baseScore: 1,
        type: 'siege',
        isHero: false,
        image: 'kaedweni_siege_expert_3.jpg',
        cardType: cardTypes.moraleBoostUnitCard
    },
    {
        name: 'dethmold',
        baseScore: 6,
        type: 'ranged',
        isHero: false,
        image: 'dethmold.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'siegfried',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        image: 'siegfried.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'yarpen zigrin',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        image: 'yarpen_zigrin.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'sabrina',
        baseScore: 4,
        type: 'ranged',
        isHero: false,
        image: 'sabrina.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'sile',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        image: 'sile.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'trebuchet',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        image: 'trebuchet.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'trebuchet',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        image: 'trebuchet_alt.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'dun banner medic',
        baseScore: 5,
        type: 'siege',
        isHero: false,
        image: 'dun_banner_medic.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'ballista',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        image: 'ballista.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'ballista',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        image: 'ballista_alt.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'catapult',
        baseScore: 8,
        type: 'siege',
        isHero: false,
        bondGroup: bondGroups.northernRealms.catapult,
        image: 'catapult.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'catapult',
        baseScore: 8,
        type: 'siege',
        isHero: false,
        bondGroup: bondGroups.northernRealms.catapult,
        image: 'catapult.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'siege tower',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        image: 'siege_tower.jpg',
        cardType: cardTypes.unitCard
    }
];

const nilfgardCards = [
    ...neutralCards,
    ...specialCards,
    {
        name: 'albrich',
        baseScore: 2,
        type: 'ranged',
        isHero: false,
        image: 'albrich.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'assire var anahid',
        baseScore: 6,
        type: 'ranged',
        isHero: false,
        image: 'assire_var_anahid.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'black infantry archer',
        baseScore: 10,
        type: 'ranged',
        isHero: false,
        image: 'black_infantry_archer.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'black infantry archer',
        baseScore: 10,
        type: 'ranged',
        isHero: false,
        image: 'black_infantry_archer_alt.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'cahir',
        baseScore: 6,
        type: 'infantry',
        isHero: false,
        image: 'cahir.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'cynthia',
        baseScore: 4,
        type: 'ranged',
        isHero: false,
        image: 'cynthia.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'etolian auxiliary archers',
        baseScore: 1,
        type: 'ranged',
        isHero: false,
        image: 'etolian_auxiliary_archers.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'etolian auxiliary archers',
        baseScore: 1,
        type: 'ranged',
        isHero: false,
        image: 'etolian_auxiliary_archers_alt.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'fringilla vigo',
        baseScore: 6,
        type: 'ranged',
        isHero: false,
        image: 'fringilla_vigo.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'heavy zerrikanian fire scorpion',
        baseScore: 10,
        type: 'siege',
        isHero: false,
        image: 'heavy_zerrikanian_fire_scorpion.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'impera brigade guard',
        baseScore: 3,
        type: 'infantry',
        isHero: false,
        image: 'impera_brigade_guard.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.nilfgaard.imperaBrigade
    },
    {
        name: 'impera brigade guard',
        baseScore: 3,
        type: 'infantry',
        isHero: false,
        image: 'impera_brigade_guard.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.nilfgaard.imperaBrigade
    },
    {
        name: 'letho of gulet',
        baseScore: 10,
        type: 'infantry',
        isHero: true,
        image: 'letho_of_gulet.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'menno coehoorn',
        baseScore: 10,
        type: 'infantry',
        isHero: true,
        image: 'menno_coehoorn.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'morteisen',
        baseScore: 3,
        type: 'infantry',
        isHero: false,
        image: 'morteisen.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'morvran voorhis',
        baseScore: 10,
        type: 'siege',
        isHero: true,
        image: 'morvran_voorhis.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'nausicaa cavalry rider',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        image: 'nausicaa_cavalry_rider.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.nilfgaard.nausicaaCavalry
    },
    {
        name: 'nausicaa cavalry rider',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        image: 'nausicaa_cavalry_rider.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.nilfgaard.nausicaaCavalry
    },
    {
        name: 'puttkammer',
        baseScore: 3,
        type: 'ranged',
        isHero: false,
        image: 'puttkammer.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'rainfarn',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        image: 'rainfarn.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'renauld aep matsen',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        image: 'renuald_aep_matsen.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'rotten mangonel',
        baseScore: 3,
        type: 'siege',
        isHero: false,
        image: 'rotten_mangonel.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'shilard fitz-oesterlen',
        baseScore: 7,
        type: 'infantry',
        isHero: false,
        image: 'shilard_fitz_oesterlen.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'siege engineer',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        image: 'siege_engineer.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'siege technician',
        baseScore: 0,
        type: 'siege',
        isHero: false,
        image: 'siege_technician.jpg',
        cardType: cardTypes.healUnitCard
    },
    {
        name: 'stefan skellen',
        baseScore: 9,
        type: 'infantry',
        isHero: false,
        image: 'stefan_skellen.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'sweers',
        baseScore: 2,
        type: 'ranged',
        isHero: false,
        image: 'sweers.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'tibor eggebracht',
        baseScore: 10,
        type: 'ranged',
        isHero: true,
        image: 'tibor_eggebracht.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'vanhemar',
        baseScore: 4,
        type: 'ranged',
        isHero: false,
        image: 'vanhemar.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'vattier de rideaux',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        image: 'vattier_de_rideaux.jpg',
        cardType: cardTypes.spyUnitCard
    },
    {
        name: 'vreemde',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        image: 'vreemde.jpg',
        cardType: cardTypes.unitCard
    },
    {
        name: 'young emissary',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        image: 'young_emissary.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.nilfgaard.youngEmissary
    },
    {
        name: 'young emissary',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        image: 'young_emissary_alt.jpg',
        cardType: cardTypes.tightBondUnitCard,
        bondGroup: bondGroups.nilfgaard.youngEmissary
    },
    {
        name: 'zerrikanian fire scorpion',
        baseScore: 5,
        type: 'siege',
        isHero: false,
        image: 'zerrikanian_fire_scorpion.jpg',
        cardType: cardTypes.unitCard
    },
];