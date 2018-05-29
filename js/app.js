// Fisher-Yates shuffle function from https://bost.ocks.org/mike/shuffle/. Modified to use ES2015.
function shuffle(array) {
    let curr = array.length, temp, rand;

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
cards = shuffle(cards);
console.log(cards);
let cardFrag = document.createDocumentFragment();
for (let i = 0; i < cards.length; i++) {
    let card = document.createElement('li');
    card.setAttribute('class', 'card');
    card.innerHTML = `<i class="fa ${cards[i]}"></i>`;
    cardFrag.appendChild(card);
}
document.querySelector('ul.deck').appendChild(cardFrag);

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
