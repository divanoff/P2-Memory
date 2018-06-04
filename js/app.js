window.onload = loadGame;

/**
 * Fisher-Yates shuffle function from https://bost.ocks.org/mike/shuffle/
 * Modified to use ES2015 constructs
 */
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
 * My list actually holds the unique class name for each card
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
    restart = document.querySelector('.restart'),
    openCards = [], // store the open card(s) after each click
    remainingPairs = 8, // keep track of remaining unmatched pairs
    moves = 0,
    startTime,
    endTime,
    timerStarted = false,
    timer;

deck.addEventListener('click', function (e) {
    // It will only fire if user clicks on an unopened card and there is less than 2 open cards
    if (e.target.classList.contains('show') ||
        e.target.classList.contains('open') ||
        openCards.length > 1 ||
        e.target.tagName == 'UL') {
        return;
    }

    if (!timerStarted) {
        startTimer();
    }

    turnOver(e.target);
    addToOpen(e.target);
});

restart.addEventListener('click', reloadGame);

function turnOver(element) {
    element.classList.add('open');
}

function addToOpen(element) {
    openCards.push(element);
    if (openCards.length > 1) {
        setTimeout(compareCards, 1000);
    }
}

/*
 * Compare cards.
 * - If they match - keep them open, decrement remaining pairs
 * - If they were the last pair - end the game
 * - If they don't match - close them
 * - Empty the open cards array and update the move counter
 */
function compareCards() {
    updateCounter();
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
        for (let card of openCards) {
            card.classList.toggle('match');
        }
        remainingPairs--;
        if (remainingPairs === 0) {
            stopTimer();
            gameOver();
        }
    }

    for (let card of openCards) {
        card.classList.remove('open');
    }
    openCards = [];
}

// Update the move counter and the star rating
function updateCounter() {
    moves++;
    document.querySelector('.moves').textContent = moves;

    /**
     * up to 10 moves - 5 stars
     * 11-12 moves - 4 stars
     * 13-15 moves - 3 stars
     * 16-20 moves - 2 stars
     * 21+ moves - 1 star
     */
    if ([11, 13, 16, 21].includes(moves)) {
        document.querySelector('.stars').firstElementChild.remove();
    }
}

/*
 * End the game
 * Build the modal and display it
 * popup - semi-transparent overlay
 * popMsg - modal
 * If player selects "Yes" to play again the board, star rating, moves, and timer are all reset
 * If player selects "No" the modal is removed and everything stays unchanged
 */
function gameOver() {
    let popup = document.createElement('div'),
        popMsg = document.createElement('div');

    popup.classList.add('modal');
    popMsg.classList.add('modal-message');
    popMsg.innerHTML = `<h2>Congratulations!!!</h2>`;
    popMsg.innerHTML += `<p>You won in ${moves} moves.</p>`;
    popMsg.innerHTML += `<p>It took you ${Math.floor((endTime - startTime) / 60000)} minute(s) and ${Math.floor(((endTime - startTime) / 1000) % 60)} second(s).</p>`
    popMsg.innerHTML += `<p>Your rating is ${document.querySelector('.stars').children.length} star(s).</p>`;
    popMsg.innerHTML += `<h3>Do you want to play again?</h3>`;
    popMsg.innerHTML += `<button class="modal-button yes">Yes</button>`;
    popMsg.innerHTML += `<button class="modal-button no">No</button>`;

    popup.appendChild(popMsg);
    document.querySelector('.container').appendChild(popup);

    document.querySelector('.yes').addEventListener('click', function () {
        popup.remove();
        reloadGame();
    });

    document.querySelector('.no').addEventListener('click', function () {
        popup.remove();
    });
}

function startTimer() {
    if (!timerStarted) {
        timerStarted = true;
        startTime = Date.now();
        timer = setInterval(function () {
            let minutes = Math.floor((Date.now() - startTime) / 60000),
                seconds = Math.floor(((Date.now() - startTime) / 1000) % 60);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            document.querySelector('.timer').innerHTML = `${minutes}:${seconds}`;
        }, 1000)
    } else {
        console.log('Timer already started');
    }
}

function stopTimer() {
    if (timerStarted) {
        timerStarted = false;
        endTime = Date.now();
        clearInterval(timer);
    } else {
        console.log('Timer has not been started yet.');
    }
}

function resetTimer() {
    stopTimer();
    document.querySelector('.timer').innerHTML = '00:00';
}

function reloadGame() {
    deck.innerHTML = '';
    moves = 0;
    remainingPairs = 8;
    document.querySelector('.moves').textContent = moves;
    document.querySelector('.stars').innerHTML = '';
    for (let i = 0; i < 5; i++) {
        document.querySelector('.stars').innerHTML += '<li>\n<i class="fa fa-star"></i>\n</li>';
    }
    resetTimer();
    loadGame();
}