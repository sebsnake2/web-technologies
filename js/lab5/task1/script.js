const lamp = document.getElementById("lamp");
const toggleBtn = document.getElementById("toggleBtn");
const lampType = document.getElementById("lampType");
const brightness = document.getElementById("brightness");
const setBrightnessBtn = document.getElementById("setBrightnessBtn");
const statusText = document.getElementById("statusText");

let inactivityTimer;
const AUTO_OFF_TIME = 60000;

function updateStatus() {
    if (lamp.classList.contains("on")) {
        statusText.textContent = "Стан: увімкнено";
    } else {
        statusText.textContent = "Стан: вимкнено";
    }
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(() => {
        lamp.classList.remove("on");
        lamp.classList.add("off");
        updateStatus();
        alert("Лампочка автоматично вимкнулася через бездіяльність.");
    }, AUTO_OFF_TIME);
}

toggleBtn.addEventListener("click", () => {
    if (lamp.className.includes("off")) {
        lamp.className = `lamp on ${lampType.value}`;
    } else {
        lamp.className = `lamp off ${lampType.value}`;
    }

    updateStatus();
    resetInactivityTimer();
});

lampType.addEventListener("change", () => {
    lamp.classList.remove("incandescent", "eco", "led");
    lamp.classList.add(lampType.value);
    resetInactivityTimer();
});

setBrightnessBtn.addEventListener("click", () => {
    lamp.style.opacity = brightness.value / 100;

    if (!lamp.classList.contains("on")) {
        lamp.style.opacity = 0.4;
    }

    resetInactivityTimer();
});

document.addEventListener("click", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);

updateStatus();
resetInactivityTimer();
