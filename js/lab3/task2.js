function factorial(n) {
    let result = 1;

    for (let i = 1; i <= n; i++) {
        result *= i;
    }

    return result;
}

function runTask2() {
    const value = Number(document.getElementById("number").value);
    const output = document.getElementById("result2");

    if (!Number.isInteger(value) || value < 0) {
        output.textContent = "Будь ласка, введіть ціле невід’ємне число.";
        console.log("Завдання 2: некоректне значення");
        return;
    }

    const result = factorial(value);

    output.textContent = `Факторіал числа ${value}: ${result}`;
    console.log("Завдання 2:", result);
}
