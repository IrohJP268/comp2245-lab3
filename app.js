// Jonathan Payne 500003038 comp2245 lab 3


const fruits = [
{ name: "apple", symbol: "🍎" },
{ name: "banana", symbol: "🍌" },
{ name: "cherry", symbol: "🍒" },
{ name: "coconut", symbol: "🥥" },
{ name: "grapes", symbol: "🍇" },
{ name: "mango", symbol: "🥭" },
{ name: "pineapple", symbol: "🍍" },
{ name: "watermelon", symbol: "🍉" },
];

function shuffle(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
return array;
}

// State of the game
let deck = []; // the shuffled fruits
let flippedCards = []; // the cards that are face up in this move 
let moves = 0;
let matchedPairs = 0;
let waiting = false; // true while two cards wait to turn back over
let timerId = null; // identifies the setTimeout so New game can cancel it

// Element references
const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const statusMessage = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");

// build a shuffled board
function buildBoard() {
  deck = shuffle([...fruits, ...fruits]);

  for (let i = 0; i < deck.length; i++) {
    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("card");
    card.setAttribute("aria-label", `Card ${i + 1}, face down`);
    card.dataset.index = i;
    board.appendChild(card);
  }
}

// turn a card over and back
function flipCard(card) {
  const index = Number(card.dataset.index);
  const fruit = deck[index];

  card.textContent = fruit.symbol;
  card.classList.add("flipped");
  card.setAttribute("aria-label", `Card ${index + 1}, ${fruit.name}`);
}

function unflipCard(card) {
  const index = Number(card.dataset.index);

  card.textContent = "";
  card.classList.remove("flipped");
  card.setAttribute("aria-label", `Card ${index + 1}, face down`);
}

// Event delegation
board.addEventListener("click", (event) => {
  const card = event.target;

  // Ignore a card that is already face up
  if (card.classList.contains("flipped")) {
    return;
  }

  // Ignore clicks that are not on a card and clicks during the 1 second wait
  if (!card.classList.contains("card") || waiting) {
    return;
  }


  flipCard(card);
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
});


// Check if the two flipped cards match
function checkForMatch() {
  moves++;
  movesDisplay.textContent = moves;

  const [first, second] = flippedCards;
  const firstFruit = deck[Number(first.dataset.index)];
  const secondFruit = deck[Number(second.dataset.index)];

  if (firstFruit.name === secondFruit.name) {
    // A pair
    first.classList.add("matched");
    second.classList.add("matched");
    first.disabled = true;
    second.disabled = true;
    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === fruits.length) {
      // The game is over
      statusMessage.textContent = `You found all the pairs in ${moves} moves!`;
      statusMessage.classList.add("you-won");
    } else {
      statusMessage.textContent = "That's a pair!";
    }
  } else {
    // Not a pair
    statusMessage.textContent = "Not a pair. Try again.";
    waiting = true;

    timerId = setTimeout(() => {
      unflipCard(first);
      unflipCard(second);
      flippedCards = [];
      waiting = false;
      timerId = null;
    }, 1000);
  }
}

// Creating a new game
function newGame() {
  // Cancel a pending timer so it can't touch the new game
  clearTimeout(timerId);
  timerId = null;
  waiting = false;

  board.replaceChildren();
  flippedCards = [];
  moves = 0;
  matchedPairs = 0;

  movesDisplay.textContent = moves;
  statusMessage.textContent = "Turn over two cards to find a matching pair.";
  statusMessage.classList.remove("you-won");

  buildBoard();
}

newGameButton.addEventListener("click", newGame);

// Start the first game when the page loads
buildBoard();
