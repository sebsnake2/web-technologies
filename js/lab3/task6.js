function power(base, exponent) {
    return base ** exponent;
}

function runTask6() {
    const base = Number(document.getElementById("base").value);
    const exponent = Number(document.getElementById("exponent").value);
    const output = document.getElementById("result6");

    if (Number.isNaN(base) || Number.isNaN(exponent)) {
        output.textContent = "Будь ласка, введіть два числа.";
        console.log("Завдання 6: некоректні дані");
        return;
    }

    const result = power(base, exponent);

    output.textContent = `${base}^${exponent} = ${result}`;
    console.log("Завдання 6:", result);
}
