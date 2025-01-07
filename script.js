import "core-js";
import "regenerator-runtime";

const diceImages = [
  new URL("./static/dice-1.png", import.meta.url),
  new URL("./static/dice-2.png", import.meta.url),
  new URL("./static/dice-3.png", import.meta.url),
  new URL("./static/dice-4.png", import.meta.url),
  new URL("./static/dice-5.png", import.meta.url),
  new URL("./static/dice-6.png", import.meta.url),
];

let state = {
  Score0: 0,
  Score1: 0,
  currScore: 0,
  currPlayer: 0,
  gameOver: false,
};

// -----------------------------------------------------------------------------------------------------
// HELPERS

const generateDiceNumber = function () {
  return Math.trunc(Math.random() * 6 + 1);
};

const checkGameOff = function () {
  return state[`Score${state.currPlayer}`] >= 30;
};

const changePlayer = function (held = false) {
  if (held) {
    // change total score in state
    state[`Score${state.currPlayer}`] += state.currScore;
    //   reflect score-change on page
    document.querySelector(`#score--${state.currPlayer}`).textContent =
      state[`Score${state.currPlayer}`];
    // updategameOver in state
    state.gameOver = checkGameOff();
  }
  // make current score 0 in state
  state.currScore = 0;
  // reflect curr score  on page
  document.querySelector(`#current--${state.currPlayer}`).textContent = 0;

  if (state.gameOver) {
    document
      .querySelector(`.player--${state.currPlayer}`)
      .classList.toggle("player--winner");
    return;
  }
  // reflect active-player-change on page
  document.querySelector(`.player--0`).classList.toggle("player--active");
  document.querySelector(`.player--1`).classList.toggle("player--active");
  //  change the current player in state
  state.currPlayer = +!state.currPlayer;
};

// -----------------------------------------------------------------------------------------------------
// HANDLERS

const formSubmitHandler = function () {
  const playerName1 = document.querySelector("#player1-name").value;
  const playerName2 = document.querySelector("#player2-name").value;
  document.querySelector("#name--0").textContent = playerName1;
  document.querySelector("#name--1").textContent = playerName2;
  document.querySelector(".overlay").classList.add("hidden-content");
};

const rollHandler = function () {
  if (state.gameOver) return;
  const diceNumber = generateDiceNumber();
  //   reflect the dice-img-change on screen
  document.querySelector(".dice").src = diceImages[diceNumber - 1].href;
  if (diceNumber !== 6) {
    state.currScore += diceNumber;
    document.querySelector(`#current--${state.currPlayer}`).textContent =
      state.currScore;
  } else {
    changePlayer();
  }
};

const holdHandler = function () {
  if (state.gameOver) return;
  changePlayer(true);
};

const resetHandler = function () {
  document.querySelector("#score--0").textContent = 0;
  document.querySelector("#score--1").textContent = 0;
  document.querySelector("#current--0").textContent = 0;
  document.querySelector("#current--1").textContent = 0;
  document
    .querySelector(`.player--${state.currPlayer}`)
    .classList.remove("player--winner");
  document.querySelector(`.player--0`).classList.add("player--active");
  document.querySelector(`.player--1`).classList.remove("player--active");
  state = {
    Score0: 0,
    Score1: 0,
    currScore: 0,
    currPlayer: 0,
    gameOver: false,
  };
};

// -----------------------------------------------------------------------------------------------------
// ATTATCHERS
function attatchRollDice() {
  const rollDiceButton = document.querySelector(".dice");
  rollDiceButton.addEventListener("click", rollHandler);
}

function attatchHoldHandler() {
  const holdButton = document.querySelector(".btn--hold");
  holdButton.addEventListener("click", holdHandler);
}

function attatchResetHandler() {
  const resetButton = document.querySelector(".btn--new");
  resetButton.addEventListener("click", resetHandler);
}

function attatchFormSubmitHandler() {
  const form = document.querySelector(".modal-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formSubmitHandler();
  });
}

attatchFormSubmitHandler();
attatchRollDice();
attatchHoldHandler();
attatchResetHandler();
