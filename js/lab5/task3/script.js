const currentDateTime = document.getElementById("currentDateTime");

const eventDateInput = document.getElementById("eventDate");
const calculateEventBtn = document.getElementById("calculateEventBtn");
const eventResult = document.getElementById("eventResult");

const calendarHeader = document.getElementById("calendarHeader");
const calendarTableBody = document.querySelector("#calendarTable tbody");

const birthdayInput = document.getElementById("birthday");
const calculateBirthdayBtn = document.getElementById("calculateBirthdayBtn");
const birthdayResult = document.getElementById("birthdayResult");

let eventTimerInterval = null;

function updateCurrentDateTime() {
    const now = new Date();
    currentDateTime.textContent = `Поточна дата і час: ${now.toLocaleString("uk-UA")}`;
}

function startEventTimer() {
    const eventValue = eventDateInput.value;

    if (!eventValue) {
        eventResult.textContent = "Будь ласка, оберіть дату та час події.";
        return;
    }

    const eventDate = new Date(eventValue);

    clearInterval(eventTimerInterval);

    function updateEventCountdown() {
        const now = new Date();
        const diff = eventDate - now;

        if (diff <= 0) {
            eventResult.textContent = "Подія вже настала.";
            clearInterval(eventTimerInterval);
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;

        eventResult.textContent = `До події залишилось: ${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
    }

    updateEventCountdown();
    eventTimerInterval = setInterval(updateEventCountdown, 1000);
}

function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const monthNames = [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень",
    ];

    calendarHeader.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7;

    const daysInMonth = lastDay.getDate();

    calendarTableBody.innerHTML = "";

    let row = document.createElement("tr");

    for (let i = 1; i < startDay; i++) {
        const emptyCell = document.createElement("td");
        row.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("td");
        cell.textContent = day;

        if (
            day === now.getDate() &&
            month === now.getMonth() &&
            year === now.getFullYear()
        ) {
            cell.classList.add("today");
        }

        row.appendChild(cell);

        if ((startDay - 1 + day) % 7 === 0) {
            calendarTableBody.appendChild(row);
            row = document.createElement("tr");
        }
    }

    if (row.children.length > 0) {
        while (row.children.length < 7) {
            const emptyCell = document.createElement("td");
            row.appendChild(emptyCell);
        }
        calendarTableBody.appendChild(row);
    }
}

function calculateDaysToBirthday() {
    const birthdayValue = birthdayInput.value;

    if (!birthdayValue) {
        birthdayResult.textContent = "Будь ласка, оберіть дату народження.";
        return;
    }

    const now = new Date();
    const birthday = new Date(birthdayValue);

    let nextBirthday = new Date(
        now.getFullYear(),
        birthday.getMonth(),
        birthday.getDate(),
    );

    if (nextBirthday < now) {
        nextBirthday = new Date(
            now.getFullYear() + 1,
            birthday.getMonth(),
            birthday.getDate(),
        );
    }

    const diff = nextBirthday - now;
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    birthdayResult.textContent = `До наступного дня народження залишилось: ${daysLeft} дн.`;
}

setInterval(updateCurrentDateTime, 1000);

calculateEventBtn.addEventListener("click", startEventTimer);
calculateBirthdayBtn.addEventListener("click", calculateDaysToBirthday);

updateCurrentDateTime();
renderCalendar();
