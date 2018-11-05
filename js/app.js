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

const game = new Game();
game.init();

document.querySelector('.modal__button').addEventListener('click', function() {
    document.querySelector('.modal__overlay').classList.remove('modal__overlay--show');
    document.querySelector('.jumbo-card__image').src = "";
});
