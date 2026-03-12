function task1() {
    let sum = 0;
    let i = 1;

    while (i <= 50) {
        sum += i;
        i++;
    }

    return sum;
}

function runTask1() {
    const result = task1();

    document.getElementById("result1").textContent =
        "Сума перших 50 натуральних чисел: " + result;

    console.log("Завдання 1:", result);
}
