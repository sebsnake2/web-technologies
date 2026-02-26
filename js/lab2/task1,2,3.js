function task1_minMax() {
    const arr = [3, -5, 10, 7];
    let min = arr[0];
    let max = arr[0];

    for (let i = 1; i <= arr.length; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }

    document.getElementById("out1").textContent =
        "Min: " + min + ", Max: " + max;
}

function task1_compareObjects() {
    const a = { x: 5, y: 10 };
    const b = { x: 5, y: 10 };

    const result =
        a.x === b.x && a.y === b.y ? "Об'єкти рівні" : "Об'єкти різні";
    document.getElementById("out1").textContent = result;
}

function task2_inRange() {
    const num = 7;
    const result = num >= 5 && num <= 10;

    document.getElementById("out2").textContent =
        "Число в діапазоні: " + result;
}

function task2_toggle() {
    let state = true;
    state != state;

    document.getElementById("out2").textContent =
        "Значення після NOT: " + state;
}

function task3_gradeIf() {
    const grade = 85;
    let text;

    if (grade >= 90) text = "Відмінно";
    else if (grade >= 75) text = "Добре";
    else if (grade >= 60) text = "Задовільно";
    else text = "Незадовільно";

    document.getElementById("out3").textContent = text;
}

function task3_gradeTernary() {
    const grade = 85;

    const text =
        grade >= 90
            ? "Відмінно"
            : grade >= 75
              ? "Добре"
              : grade >= 60
                ? "Задовільно"
                : "Незадовільно";

    document.getElementById("out3").textContent = text;
}

function task3_season() {
    const month = 4;
    let season;

    if (month === 12 || month <= 2) season = "Зима";
    else if (month <= 5) season = "Весна";
    else if (month <= 8) season = "Літо";
    else season = "Осінь";

    document.getElementById("out3").textContent = season;
}
