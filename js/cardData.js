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




const cardData = [
    {
        name: 'geralt',
        baseScore: 15,
        type: 'infantry',
        isHero: true,
        behaviours: [],
        image: 'geralt.jpg'
    },
    {
        name: 'ciri',
        baseScore: 15,
        type: 'infantry',
        isHero: true,
        behaviours: [],
        image: 'ciri.jpg'
    },
    {
        name: 'yennefer',
        baseScore: 7,
        type: 'ranged',
        isHero: true,
        behaviours: ['heal'],
        image: 'yennefer.jpg'
    },
    {
        name: 'dandelion',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        behaviours: ['commanders horn'],
        image: 'dandelion.jpg'
    },
    {
        name: 'dijkstra',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        behaviours: ['spy'],
        image: 'dijkstra.jpg'
    },
    {
        name: 'villentretenmerth',
        baseScore: 7,
        type: 'infantry',
        isHero: false,
        behaviours: ['scorch'],
        image: 'villentretenmerth.jpg'
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        behaviours: ['tight bond'],
        image: 'blue_stripes_commando.jpg'
    },
    {
        name: 'blue stripes commando',
        baseScore: 4,
        type: 'infantry',
        isHero: false,
        behaviours: ['tight bond'],
        image: 'blue_stripes_commando.jpg'
    },
    {
        name: 'crinfrid reaver',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        behaviours: ['tight bond'],
        image: 'crinfrid_reaver.jpg'
    },
    {
        name: 'crinfrid reaver',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        behaviours: ['tight bond'],
        image: 'crinfrid_reaver.jpg'
    },
    {
        name: 'trebuchet',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        behaviours: [],
        image: 'trebuchet.jpg'
    },
    {
        name: 'kaedweni siege expert',
        baseScore: 1,
        type: 'siege',
        isHero: false,
        behaviours: ['morale boost'],
        image: 'kaedweni_siege_expert_1.jpg'
    },
    {
        name: 'dethmold',
        baseScore: 6,
        type: 'ranged',
        isHero: false,
        behaviours: [],
        image: 'dethmold.jpg'
    },
    {
        name: 'siegfried',
        baseScore: 5,
        type: 'infantry',
        isHero: false,
        behaviours: [],
        image: 'siegfried.jpg'
    },
    {
        name: 'yarpen zigrin',
        baseScore: 2,
        type: 'infantry',
        isHero: false,
        behaviours: [],
        image: 'yarpen_zigrin.jpg'
    },
    {
        name: 'sabrina',
        baseScore: 4,
        type: 'ranged',
        isHero: false,
        behaviours: [],
        image: 'sabrina.jpg'
    },
    {
        name: 'sile',
        baseScore: 5,
        type: 'ranged',
        isHero: false,
        behaviours: [],
        image: 'sile.jpg'
    },
    {
        name: 'triss',
        baseScore: 7,
        type: 'infantry',
        isHero: true,
        behaviours: [],
        image: 'triss.jpg'
    },
    {
        name: 'trebuchet',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        behaviours: [],
        image: 'trebuchet_alt.jpg'
    },
    {
        name: 'dun banner medic',
        baseScore: 5,
        type: 'siege',
        isHero: false,
        behaviours: ['heal'],
        image: 'dun_banner_medic.jpg'
    },
    {
        name: 'ballista',
        baseScore: 6,
        type: 'siege',
        isHero: false,
        behaviours: [],
        image: 'ballista.jpg'
    },
    {
        name: 'catapult',
        baseScore: 8,
        type: 'siege',
        isHero: false,
        behaviours: ['tight bond'],
        image: 'catapult.jpg'
    },
    {
        name: 'catapult',
        baseScore: 8,
        type: 'siege',
        isHero: false,
        behaviours: ['tight bond'],
        image: 'catapult.jpg'
    }
];