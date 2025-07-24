const startBtn = document.querySelector("#start");
const screens = document.querySelectorAll(".screen");
const timeList = document.querySelector("#time-list");
const timeEl = document.querySelector("#time");
const board = document.querySelector("#board");
let skull = document.querySelector("#skull");

let time = 20;
let points = 0;

let { width, height } = board.getBoundingClientRect();

let skullWidth = skull.getBoundingClientRect().width;
let skullHeight = skull.getBoundingClientRect().height;
let skullX = (width - skullWidth) / 2;
let skullY = (height - skullHeight) / 2;
let skullSpeedX = 5;
let skullSpeedY = 5;

let music = new Audio();
music.loop = true;
let sound = new Audio();
let sound2 = new Audio();
let sound3 = new Audio();

music.src = "https://brainfixer-hobby.github.io/SandBoxesSnippets/music.mp3";
sound.src = "https://brainfixer-hobby.github.io/SandBoxesSnippets/sound.mp3";
sound2.src = "https://brainfixer-hobby.github.io/SandBoxesSnippets/sound2.mp3";
sound3.src = "https://brainfixer-hobby.github.io/SandBoxesSnippets/sound3.mp3";

board.addEventListener("click", (e) => {
  const el = e.target;
  if (el.classList.contains("circle")) {
    sound.play();
    points++;

    changeSkullDirection(parseInt(el.style.left, 10), parseInt(el.style.top, 10));

    el.remove();
    createRandomCircle();
  }

  // Код для Виктора :).
  else if (el.classList.contains("board")) {
    if (board.querySelector(".circle")) {
      board.querySelector(".circle").remove();
    }
    createRandomCircle();
  }
  // Конец кода для Виктора :).
});

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  screens[0].classList.add("up");
});

timeList.addEventListener("click", (e) => {
  const el = e.target;
  if (el.classList.contains("time-btn")) {
    time = +el.getAttribute("data-time");
    screens[1].classList.add("up");
    startGame();
  }
});

let timer;
let beginTime;

let skullTimer;

function startGame() {
  points = 0;
  timeEl.parentNode.classList.remove("hide");
  skullX = (width - skullWidth) / 2;
  skullY = (height - skullHeight) / 2;
  skullSpeedX = 5;
  skullSpeedY = 5;
  board.innerHTML = `<div class="skull" id="skull">
          <img
            src="https://brainfixer.github.io/CodePenSnippets/skull.png"
            alt=""
          />
        </div>`;
  skull = document.querySelector("#skull");
  skull.addEventListener("mouseenter", () => {
    sound3.play();
    points = 0;
    // skullSpeedX *= -1.1;
    // skullSpeedY *= -1.1;
    // mirrorSkull();
  });
  showTime();
  timer = setInterval(decreaseTime, 1000);
  skullTimer = setInterval(drawSkull, 50);
  beginTime = time;
  createRandomCircle();
  music.playbackRate = ((beginTime - time) / beginTime) * 2 + 1;
  music.play();
  skull.style.transform = "scale(-1, 1)";
}

function finishGame() {
  board.innerHTML = `<h1>Cчет: <span class="primary">${points}</span></h1>`;
  timeEl.parentNode.classList.add("hide");
  clearInterval(timer);
  clearInterval(skullTimer);
  music.pause();
  sound2.play();
  board.childNodes[0].addEventListener("click", () => {
    screens[1].classList.remove("up");
  });
}

function decreaseTime() {
  if (time === 0) {
    finishGame();
  } else {
    time--;
    showTime();
    music.playbackRate = ((beginTime - time) / beginTime) * 2 + 1;
    skullSpeedX = Math.sign(skullSpeedX) * (((beginTime - time) / beginTime) * 5 + 5);
    console.log(skullSpeedX);
    skullSpeedY = Math.sign(skullSpeedY) * (((beginTime - time) / beginTime) * 5 + 5);
  }
}

function showTime() {
  let mins = Math.floor(time / 60);
  let secs = time % 60;
  timeEl.innerText = `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function createRandomCircle() {
  const circle = document.createElement("div");
  let size = getRandomNumber(10, 50);
  let x = getRandomNumber(size, +width - size);
  let y = getRandomNumber(size, +height - size);
  // x = skullX;
  // y = skullY;
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.classList.add("circle");
  circle.style.top = `${y}px`;
  circle.style.left = `${x}px`;
  circle.style.backgroundColor = getRandomColor();
  board.append(circle);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomColor() {
  return `rgb(${getRandomNumber(50, 255)},
              ${getRandomNumber(50, 255)},
              ${getRandomNumber(50, 255)})`;
}

function drawSkull() {
  skull.style.zIndex = "10";
  skull.style.left = `${skullX}px`;
  skull.style.top = `${skullY}px`;
  skullX += skullSpeedX;
  skullY += skullSpeedY;
  if (skullX < 0) {
    skullSpeedX *= -1;
    skull.style.transform = "scale(-1, 1)";
  }
  if (skullX > width - skullWidth) {
    skullSpeedX *= -1;
    skull.style.transform = "scale(1, 1)";
  }
  if (skullY < 0 || skullY > height - skullHeight) {
    skullSpeedY *= -1;
  }
}

function changeSkullDirection(circleX, circleY) {
  const sign = Math.sign((circleX - skullX) * skullSpeedX);
  skullSpeedX *= sign;
  if (sign == -1) {
    mirrorSkull();
  }
  skullSpeedY *= Math.sign((circleY - skullY) * skullSpeedY);
}

function mirrorSkull() {
  if (skull.style.transform == "scale(1, 1)") {
    skull.style.transform = "scale(-1, 1)";
  } else {
    skull.style.transform = "scale(1, 1)";
  }
}
