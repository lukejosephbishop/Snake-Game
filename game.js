//grid
function makeGrid() {
  let x = 0;
  let y = 0;

  for (let index = 0; index < 400; index = index + 1) {
    $(".board").append($(`<div class ='cell' id = '${x}-${y}' > </div>`));
    $(`#${x}-${y}`).css(`background-color`, `rgb(54, 122, 42)`);
    x++;
    if (x > 19) {
      x = 0;
      y++;
    }
  }
}

makeGrid();

// state
let clickButton;
let initialState;
let interval;
let score = 0;
let highscore = 0;
let appleflip = 0;
const START_BUTTON = $(`.start-game`);
let speed = 7;

//snake

let snake = {
  body: [[10, 5]],
  nextDirection: [0, 1],
};

let segments;

let gameState = {
  intervalId: null,
  apple: [
    Math.floor(Math.random() * 10 + 5),
    Math.floor(Math.random() * 10 + 5),
  ],
  snake: snake, // from above
};

function startButton() {
  $(".start-game").remove();
  $("header").css("margin-bottom", "96px");
  buildInitialState();
  interval = setInterval(tick, 1000 / speed);
  score = 0;
}

function buildInitialState() {
  let snakeHead = snake.body[0];
  let x = snakeHead[0];
  let y = snakeHead[1];
  $(`#${x}-${y}`).css("background-color", "rgb(255, 255, 255)");

  newApple();
}

// render
function renderState() {
  let oldSnakeHead = snake.body[0];
  let newSnakeHeadx = oldSnakeHead[0] + snake.nextDirection[0];
  let newSnakeHeady = oldSnakeHead[1] + snake.nextDirection[1];
  let newSnakeHead = [newSnakeHeadx, newSnakeHeady];
  snake.body.unshift(newSnakeHead);

  let x = gameState.apple[0];
  let y = gameState.apple[1];

  if (x === newSnakeHeadx && y === newSnakeHeady) {
    let grow = oldSnakeHead;
    snake.body.unshift(grow);
    updateScore();
    newApple();
  }

  updateSnake();
}

//score

function updateScore() {
  score++;
  $(`#score`).text(`Score: ${score}`);
  updateHighScore();
}

function updateHighScore() {
  if (highscore < score) {
    highscore = score;
    $(`#highscore`).text(`High Score: ${highscore}`);
  }
}

//snake

function updateSnake() {
  let snakeHead = snake.body[0];
  let x = snakeHead[0];
  let y = snakeHead[1];

  $(`#${x}-${y}`).css("background-color", "rgb(255, 255, 255)");
  let snakePop = snake.body.pop();
  x = snakePop[0];
  y = snakePop[1];
  $(`#${x}-${y}`).css("background-color", "rgb(54, 122, 42)");
}

function snakeBodyReset() {
  let bodyScan = snake.body;
  for (let i = 0; i < bodyScan.length; i++) {
    let x = bodyScan[i][0];
    let y = bodyScan[i][1];
    $(`#${x}-${y}`).css("background-color", "rgb(54, 122, 42)");
  }
}

//apple

function newApple() {
  gameState.apple = [
    Math.floor(Math.random() * 10 + 5),
    Math.floor(Math.random() * 10 + 5),
  ];
  let x = gameState.apple[0];
  let y = gameState.apple[1];
  let backgroundTile = `#${x}-${y}`;

  console.log($(backgroundTile).css("background-color"));

  while ($(backgroundTile).css("background-color") !== "rgb(54, 122, 42)") {
    gameState.apple = [
      Math.floor(Math.random() * 10 + 5),
      Math.floor(Math.random() * 10 + 5),
    ];
    x = gameState.apple[0];
    y = gameState.apple[1];
    backgroundTile = `#${x}-${y}`;
  }
  console.log("AFTER WHILE LOOP");

  $(`#${x}-${y}`).css("background-color", "red");
  return;
}

function noApple() {
  let apple = gameState.apple;
  let x = apple[0];
  let y = apple[1];
  $(`#${x}-${y}`).css("background-color", "rgb(54, 122, 42)");
}

//player movement//

document.addEventListener("keydown", function (e) {
  switch (e.keyCode) {
    case 37:
      if (snake.nextDirection[0] !== 0) break;
      snake.nextDirection = [-1, 0];
      break;
    case 38:
      if (snake.nextDirection[1] !== 0) break;
      snake.nextDirection = [0, -1];
      break;
    case 39:
      if (snake.nextDirection[0] !== 0) break;
      snake.nextDirection = [1, 0];
      break;
    case 40:
      if (snake.nextDirection[1] !== 0) break;
      snake.nextDirection = [0, 1];
      break;
  }
});

//endgame///

function endgame() {
  let snakeHead = snake.body[0];
  let x = snakeHead[0];
  let y = snakeHead[1];

  if (
    $(`#${x + snake.nextDirection[0]}-${y + snake.nextDirection[1]}`).css(
      "background-color"
    ) === "rgb(255, 255, 255)"
  ) {
    snakeBodyReset();
    endGameConfirm();
  }

  if (x === -1 && snake.nextDirection) {
    snakeBodyReset();
    endGameConfirm();
  }
  if (x === 20 && snake.nextDirection) {
    snakeBodyReset();
    endGameConfirm();
  }
  if (y === -1 && snake.nextDirection) {
    snakeBodyReset();
    endGameConfirm();
  }
  if (y === 20 && snake.nextDirection) {
    snakeBodyReset();
    endGameConfirm();
  }
}

function endGameConfirm() {
  alert("Game Over. Try again!");
  clearInterval(interval);
  $(`body`).append(START_BUTTON);
  $(`header`).css(`margin`, `0`);
  $(`.start-game button`).click(startButton);
  $(`#score`).text(`Score:`);
  snake.body = [
    [Math.floor(Math.random() * 10 + 5), Math.floor(Math.random() * 10 + 5)],
  ];
  noApple();
}

// listeners
function onBoardClick() {
  renderState();
}

$(".board").on("click", onBoardClick);

function tick() {
  renderState();
  endgame();
}
