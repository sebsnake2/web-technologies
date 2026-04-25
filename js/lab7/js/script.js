"use strict";

// DOM
const startBtn = document.querySelector(".button-start-game");
const restartBtn = document.querySelector(".button-restart");
const gunman = document.querySelector(".gunman");
const message = document.querySelector(".message");
const wrapper = document.querySelector(".wrapper");
const gameScreen = document.querySelector(".game-screen");
const gameMenu = document.querySelector(".game-menu");

const timeYou = document.querySelector(".time-panel__you");
const timeGunman = document.querySelector(".time-panel__gunman");

// sounds
const fireSound = new Audio("sfx/fire.m4a");
const shotSound = new Audio("sfx/shot.m4a");
const winSound = new Audio("sfx/win.m4a");
const deathSound = new Audio("sfx/death.m4a");
const waitSound = new Audio("sfx/wait.m4a");

let startTime = 0;
let reactionTime = 0;
let gunmanTime = 0;
let canShoot = false;

// START GAME
function setGunmanState(stateClass) {
    gunman.classList.remove(
        "gunman-level-1",
        "gunman-level-1__standing",
        "gunman-level-1__ready",
        "gunman-level-1__shooting",
        "gunman-level-1__death",
    );

    gunman.classList.add(stateClass);
}
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
gunman.addEventListener("click", playerShootsGunman);

function startGame() {
    gameMenu.style.display = "none";
    wrapper.style.display = "block";
    gameScreen.style.display = "block";

    document.querySelector(".game-panels").style.display = "block";

    moveGunman();
}

// MOVE TO CENTER
function moveGunman() {
    setGunmanState("gunman-level-1");

    gunman.classList.remove("standing", "moving");
    gunman.style.left = "760px";

    waitSound.play();

    setTimeout(() => {
        gunman.style.left = "355px";
        gunman.classList.add("moving");
    }, 50);

    setTimeout(() => {
        gunman.classList.remove("moving");
        gunman.classList.add("standing");

        setGunmanState("gunman-level-1__standing");

        prepareForDuel();
    }, 5050);
}
// PREPARE
function prepareForDuel() {
    const delay = Math.random() * 2000 + 1000;

    setTimeout(() => {
        showFire();
    }, delay);
}

// FIRE!!!
function showFire() {
    message.classList.add("message--fire");
    fireSound.play();

    canShoot = true;
    startTime = Date.now();

    gunmanTime = Math.random() * 0.5 + 0.3;

    setTimeout(() => {
        if (canShoot) {
            gunmanShootsPlayer();
        }
    }, gunmanTime * 1000);
}

// PLAYER SHOOT
function playerShootsGunman() {
    if (!canShoot) return;

    canShoot = false;

    reactionTime = (Date.now() - startTime) / 1000;
    timeYou.textContent = reactionTime.toFixed(2);

    shotSound.play();

    if (reactionTime < gunmanTime) {
        win();
    } else {
        lose();
    }
}

// GUNMAN SHOOT
function gunmanShootsPlayer() {
    canShoot = false;

    timeGunman.textContent = gunmanTime.toFixed(2);

    setGunmanState("gunman-level-1__shooting");
    deathSound.play();

    gameScreen.classList.add("game-screen--death");

    showMessage("YOU LOSE", "dead");
    restartBtn.style.display = "block";
}

// WIN
function win() {
    timeGunman.textContent = gunmanTime.toFixed(2);

    setGunmanState("gunman-level-1__death");
    winSound.play();

    showMessage("YOU WIN", "win");
    restartBtn.style.display = "block";
}

// LOSE
function lose() {
    gunmanShootsPlayer();
}

// MESSAGE
function showMessage(text, type) {
    message.className = "message";
    message.textContent = text;

    if (type === "win") {
        message.classList.add("message--win");
    } else {
        message.classList.add("message--dead");
    }
}

// RESTART
function restartGame() {
    location.reload();
}
