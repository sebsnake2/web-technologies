function sumEvenNumbers(arr) {
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) {
            sum += arr[i];
        }
    }

    return sum;
}

function runTask4() {
    const input = document.getElementById("arrayInput").value.trim();
    const output = document.getElementById("result4");

    if (input === "") {
        output.textContent = "Будь ласка, введіть числа.";
        console.log("Завдання 4: порожній ввід");
        return;
    }

    const arr = input.split(",").map((item) => Number(item.trim()));

    if (arr.some((item) => Number.isNaN(item))) {
        output.textContent = "Введіть коректні числа через кому.";
        console.log("Завдання 4: некоректний масив");
        return;
    }

    const result = sumEvenNumbers(arr);

    output.textContent = "Сума парних чисел: " + result;
    console.log("Завдання 4:", result);
}
