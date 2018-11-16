console.log('it works!');

// const cardArray = cardData.map((card, index) => {
//     return new Card(
//         card.name,
//         index,
//         card.baseScore,
//         card.type,
//         card.isHero,
//         'tbc',
//         card.behaviours,
//         'Player 1'
//     );
// });



//const game = new Game('Geralt of Rivia', 'Leo Bonhart');
//game.init();

let playerOneName = 'Geralt';
let playerOneFaction = factions.northernRealms;
const playerOneNameInput = document.getElementById('player-one-name');
const playerOneFactionSelect = document.getElementById('player-one-faction');

playerOneNameInput.addEventListener('keyup', (e) => {
    playerOneName = e.target.value;
});

playerOneFactionSelect.addEventListener('change', (e) => {
    playerOneFaction = e.target.value;
});

let playerTwoName = 'Ciri';
let playerTwoFaction = factions.nilfgaard;
const playerTwoNameInput = document.getElementById('player-two-name');
const playerTwoFactionSelect = document.getElementById('player-two-faction');

playerTwoNameInput.addEventListener('keyup', (e) => {
    playerTwoName = e.target.value;
});

playerTwoFactionSelect.addEventListener('change', (e) => {
    playerTwoFaction = e.target.value;
});

document.querySelector('.start-button').addEventListener('click', () => {
    const game = new Game(
        playerOneName,
        playerOneFaction,
        playerTwoName,
        playerTwoFaction
    );
    window.game = game;
    game.init();
});

// document.querySelector('.modal__button').addEventListener('click', function() {
//     document.querySelector('.modal__overlay').classList.remove('modal__overlay--show');
//     document.querySelector('.jumbo-card__image').src = "";
// });
