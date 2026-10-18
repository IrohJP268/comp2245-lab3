const fruits = [
{ name: "apple", symbol: "🍎 " },
{ name: "banana", symbol: "🍌 " },
{ name: "cherry", symbol: "🍒 " },
{ name: "coconut", symbol: "🥥 " },
{ name: "grapes", symbol: "🍇 " },
{ name: "mango", symbol: "🥭 " },
{ name: "pineapple", symbol: "🍍 " },
{ name: "watermelon", symbol: "🍉 " },
];

function shuffle(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
return array;
}

// State of the game
let deck = []; // the shuffled fruits; deck[0] is the first card on the board
let flippedCards = []; // the cards that are face up in this move (0, 1 or 2)
let moves = 0;
let matchedPairs = 0;
let waiting = false; // true while two cards wait to turn back over
let timerId = null; // identifies the setTimeout so New game can cancel it


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