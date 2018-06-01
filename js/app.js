window.onload = loadGame;

// Fisher-Yates shuffle function from https://bost.ocks.org/mike/shuffle/. Modified to use ES2015.
function shuffle(array) {
    let curr = array.length,
        temp, rand;

    while (curr !== 0) {
        rand = Math.floor(Math.random() * curr--);
        [array[curr], array[rand]] = [array[rand], array[curr]];
    }

    return array;
}

/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function loadGame() {
    cards = shuffle(cards);
    let cardFrag = document.createDocumentFragment();
    for (let i = 0; i < cards.length; i++) {
        let card = document.createElement('li');
        card.setAttribute('class', 'card');
        card.innerHTML = `<i class="fa ${cards[i]}"></i>`;
        cardFrag.appendChild(card);
    }
    document.querySelector('ul.deck').appendChild(cardFrag);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let deck = document.querySelector('ul.deck'),
    openCards = [],
    remainingCards = 16,
    moves = 0;

deck.addEventListener('click', function (e) {
    // console.log(e.target.innerHTML);
    if (e.target.classList.contains('show') ||
        e.target.classList.contains('open') ||
        openCards.length > 1 ||
        e.target.tagName == 'UL') {
        return;
    }
    turnOver(e.target);
    addToOpen(e.target);
});

document.querySelector('.restart').addEventListener('click', function () {
    deck.innerHTML = '';
    moves = 0;
    document.querySelector('.moves').textContent = moves;
    document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
    loadGame();
});

function turnOver(element) {
    element.classList.add('open');
}

function addToOpen(element) {
    openCards.push(element);
    if (openCards.length > 1) {
        setTimeout(compareCards, 1000);
    }
}

function compareCards() {
    setTimeout(function () {
        if (openCards[0].innerHTML === openCards[1].innerHTML) {
            for (let card of openCards) {
                card.classList.toggle('match');
            }
            remainingCards -= 2;
            if (remainingCards === 0) {
                gameOver();
            }
        } else {
            for (let card of openCards) {
                card.classList.add('no-match');
            }
        }
    }, 1000);

    for (let card of openCards) {
        card.classList.remove('open', 'no-match');
    }
    openCards = [];
    updateCounter();
}

function updateCounter() {
    moves++;
    document.querySelector('.moves').textContent = moves;

    if ([1, 2, 3, 4].includes(moves)) {
        document.querySelector('.stars').firstElementChild.remove();
    }
}

function gameOver() {

}