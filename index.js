// Caching elements
const choices = document.querySelectorAll(".choice");
const userScore = document.querySelector("#user-score");
const computerScore = document.querySelector("#computer-score");
const result = document.querySelector(".result > p");
const btnRules = document.querySelector(".rules-btn");
const btnReset = document.querySelector(".reset-btn");
const btnClose = document.querySelector(".close-modal");
const modalRules = document.querySelector(".modal");
const btnTest = document.querySelector(".test-btn");

// Setting initial scores
let userScoreValue = localStorage.getItem("userScore") || 0;
let computerScoreValue = localStorage.getItem("computerScore") || 0;

userScore.textContent = userScoreValue;
computerScore.textContent = computerScoreValue;

// Function to generate computer choice
function getComputerChoice() {
  const computerChoices = ["r", "p", "sc", "sp", "l"];
  const randomNumber = Math.floor(Math.random() * 4);
  return computerChoices[randomNumber];
}

// Function to convert choice to text
function convertToWord(letter) {
  if (letter === "r") return "rock";
  if (letter === "p") return "paper";
  if (letter === "sc") return "scissors";
  if (letter === "sp") return "spock";
  if (letter === "l") return "lizard";
}

function updateScoreAndResult(userChoice, computerChoice) {
  const userChoiceWord = convertToWord(userChoice);
  const computerChoiceWord = convertToWord(computerChoice);
  const userChoiceContainer = document.querySelector(".user-result");
  const computerChoiceContainer = document.querySelector(".computer-result");

  userChoiceContainer.querySelector("img").src = `assets/${userChoiceWord}.png`;
  computerChoiceContainer.querySelector("img").src = `assets/${computerChoiceWord}.png`;

  const labels = document.querySelectorAll(".result-label");
  labels.forEach((label) => (label.style.display = "none"));

  switch (userChoice + computerChoice) {
    // Checking for win
    case "scp":
    case "pr":
    case "rl":
    case "lsp":
    case "spsc":
    case "scl":
    case "lp":
    case "psp":
    case "spr":
    case "rsc":
      const winLabel = document.querySelector("#win-result-label");
      showMobileLabel("win");
      winLabel.style.display = "block";
      userScoreValue++;
      userScore.textContent = userScoreValue;
      localStorage.setItem("userScore", userScoreValue);
      showScreen("win");
      break;

    // Checking for tie
    case "rr":
    case "pp":
    case "scsc":
    case "spsp":
      const tieLabel = document.querySelector("#tie-result-label");
      tieLabel.style.display = "block";
      showMobileLabel("tie");
      showScreen("tie");
      break;

    // Otherwise, user loses
    default:
      const loseLabel = document.querySelector("#lose-result-label");
      loseLabel.style.display = "block";
      showMobileLabel("lose");
      computerScoreValue++;
      computerScore.textContent = computerScoreValue;
      localStorage.setItem("computerScore", computerScoreValue);
      showScreen("lose");
      break;
  }
}

function showMobileLabel(label) {
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  if (!mediaQuery.matches) return;
  const mobileLabels = document.querySelectorAll(".mobile-result-label");
  mobileLabels.forEach((label) => (label.style.display = "none"));
  switch (label) {
    case "win":
      const winLabel = document.querySelector("#mobile-win-result-label");
      winLabel.style.display = "block";
      break;
    case "tie":
      const tieLabel = document.querySelector("#mobile-tie-result-label");
      tieLabel.style.display = "block";
      break;
    default:
      const loseLabel = document.querySelector("#mobile-lose-result-label");
      loseLabel.style.display = "block";
  }
}

// Function to handle user choice
function handleUserChoice(event) {
  const userChoice = event.target.closest(".choice").id;
  const computerChoice = getComputerChoice();
  updateScoreAndResult(userChoice, computerChoice);

  const button = document.querySelector(".play-again");
  button.addEventListener("click", handlePlayAgain);
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  if (mediaQuery.matches) {
    const button = document.querySelector(".play-again-mobile");
    button.addEventListener("click", handlePlayAgain);
  }
}

function handlePlayAgain() {
  showScreen("main");
}

function handleReset() {
  userScore.textContent = 0;
  computerScore.textContent = 0;
  userScoreValue = 0;
  computerScoreValue = 0;
  localStorage.removeItem("userScore");
  localStorage.removeItem("computerScore");
}

//
async function getData() {
  const response = await fetch("https://catfact.ninja/fact");
  const data = await response.json();
  return data;
}

const throttle = (fn, limit) => {
  let flag = true;
  return function () {
    console.log("throttle hit");
    if (flag) {
      fn.apply(this, arguments).then((data) => {
        setTimeout(() => {
          console.log(data);
        }, 5000);
      });
      flag = false;
      setTimeout(() => {
        flag = true;
      }, limit);
    }
  };
};

btnTest.addEventListener("click", throttle(getData, 5000));

// Adding event listeners to choices and buttons
choices.forEach((choice) => choice.addEventListener("click", handleUserChoice));
btnRules.addEventListener("click", () => modalRules.classList.toggle("show-modal"));
btnClose.addEventListener("click", () => modalRules.classList.toggle("show-modal"));
btnReset.addEventListener("click", () => handleReset());

// Function to show a screen based on result
function showScreen(result) {
  switch (result) {
    case "win":
    case "lose":
    case "tie": {
      const screen = document.querySelector(".main-screen");
      screen.style.display = "none";
      const screenToShow = document.querySelector(".result-screen");
      screenToShow.style.display = "flex";
      break;
    }
    case "main": {
      const screen = document.querySelector(".result-screen");
      screen.style.display = "none";
      const screenToShow = document.querySelector(".main-screen");
      screenToShow.style.display = "block";
    }
  }
}
