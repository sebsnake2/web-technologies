function CalculateIceCreamPrice(): void {
    const size = prompt("Оберіть розмір морозива: small або large");

    let totalPrice: number;
    if (size === "small") {
        totalPrice = 10;
    } else if (size === "large") {
        totalPrice = 25;
    } else {
        alert("невірно обраний розмір");
        return;
    }

    const toppingsInput = prompt(
        "Оберіть начинку: chocolate, caramel або berries. Можна декілька через кому.",
    );

    if (!toppingsInput) {
        alert("Потрібно обрати хоча б одну начинку");
        return;
    }

    const toppings: string[] = toppingsInput
        .split(",")
        .map((topping) => topping.trim().toLocaleLowerCase());

    if (toppings.includes("chocolate")) {
        totalPrice += 5;
    }
    if (toppings.includes("caramel")) {
        totalPrice += 6;
    }
    if (toppings.includes("berries")) {
        totalPrice += 10;
    }

    const marshmallow = prompt("Додати маршмелоу за 5 грн? yes або no");

    if (marshmallow === "yes") {
        totalPrice += 5;
    }

    console.log(`Загальна вартість морозива: ${totalPrice} грн`);
}

CalculateIceCreamPrice();
