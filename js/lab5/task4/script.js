const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productQuantityInput = document.getElementById("productQuantity");
const productCategoryInput = document.getElementById("productCategory");

const deleteProductIdInput = document.getElementById("deleteProductId");

const updateProductIdInput = document.getElementById("updateProductId");
const updateProductPriceInput = document.getElementById("updateProductPrice");
const updateProductQuantityInput = document.getElementById(
    "updateProductQuantity",
);

const searchProductNameInput = document.getElementById("searchProductName");
const searchOutput = document.getElementById("searchOutput");

const orderProductIdInput = document.getElementById("orderProductId");
const orderQuantityInput = document.getElementById("orderQuantity");

const productsOutput = document.getElementById("productsOutput");
const categoriesOutput = document.getElementById("categoriesOutput");
const ordersOutput = document.getElementById("ordersOutput");

const addProductBtn = document.getElementById("addProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");
const updateProductBtn = document.getElementById("updateProductBtn");
const searchProductBtn = document.getElementById("searchProductBtn");
const orderBtn = document.getElementById("orderBtn");
const showProductsBtn = document.getElementById("showProductsBtn");
const showCategoriesBtn = document.getElementById("showCategoriesBtn");
const showOrdersBtn = document.getElementById("showOrdersBtn");

// Map зберігання товарів за ID
const productsMap = new Map();

// Set унікальні категорії
const categoriesSet = new Set();

// Map історія замовлень
const ordersMap = new Map();

// WeakMap додаткова інформація про об’єкт товару
const productHistoryWeakMap = new WeakMap();

// WeakSet товари, які були замовлені хоча б один раз
const orderedProductsWeakSet = new WeakSet();

let orderCounter = 1;

function addProduct() {
    const id = productIdInput.value.trim();
    const name = productNameInput.value.trim();
    const price = Number(productPriceInput.value);
    const quantity = Number(productQuantityInput.value);
    const category = productCategoryInput.value.trim();

    if (!id || !name || price < 0 || quantity < 0 || !category) {
        alert("Заповніть усі поля коректно.");
        return;
    }

    if (productsMap.has(id)) {
        alert("Товар з таким ID вже існує.");
        return;
    }

    const product = {
        id,
        name,
        price,
        quantity,
        category,
    };

    productsMap.set(id, product);
    categoriesSet.add(category);

    productHistoryWeakMap.set(product, {
        createdAt: new Date().toLocaleString("uk-UA"),
        changes: ["Товар створено"],
    });

    clearAddInputs();
    alert("Товар успішно додано.");
}

function deleteProduct() {
    const id = deleteProductIdInput.value.trim();

    if (!productsMap.has(id)) {
        alert("Товар з таким ID не знайдено.");
        return;
    }

    productsMap.delete(id);
    deleteProductIdInput.value = "";

    rebuildCategories();
    alert("Товар видалено.");
    showProducts();
}

function updateProduct() {
    const id = updateProductIdInput.value.trim();
    const newPrice = updateProductPriceInput.value;
    const newQuantity = updateProductQuantityInput.value;

    if (!productsMap.has(id)) {
        alert("Товар з таким ID не знайдено.");
        return;
    }

    const product = productsMap.get(id);

    if (newPrice !== "") {
        product.price = Number(newPrice);
    }

    if (newQuantity !== "") {
        product.quantity = Number(newQuantity);
    }

    const history = productHistoryWeakMap.get(product);
    history.changes.push(
        `Оновлено товар: ${new Date().toLocaleString("uk-UA")}`,
    );

    productsMap.set(id, product);

    updateProductIdInput.value = "";
    updateProductPriceInput.value = "";
    updateProductQuantityInput.value = "";

    alert("Інформацію про товар оновлено.");
    showProducts();
}

function searchProduct() {
    const searchName = searchProductNameInput.value.trim().toLowerCase();

    if (!searchName) {
        searchOutput.innerHTML = "Введіть назву товару для пошуку.";
        return;
    }

    let found = null;

    for (const product of productsMap.values()) {
        if (product.name.toLowerCase().includes(searchName)) {
            found = product;
            break;
        }
    }

    if (!found) {
        searchOutput.innerHTML = '<p class="error">Товар не знайдено.</p>';
        return;
    }

    const history = productHistoryWeakMap.get(found);

    searchOutput.innerHTML = `
    <div class="product-card">
      <strong>ID:</strong> ${found.id}<br>
      <strong>Назва:</strong> ${found.name}<br>
      <strong>Ціна:</strong> ${found.price} грн<br>
      <strong>Кількість:</strong> ${found.quantity}<br>
      <strong>Категорія:</strong> ${found.category}<br>
      <strong>Створено:</strong> ${history.createdAt}<br>
      <strong>Був у WeakSet як замовлений:</strong> ${orderedProductsWeakSet.has(found) ? "Так" : "Ні"}
    </div>
  `;
}

function createOrder() {
    const id = orderProductIdInput.value.trim();
    const orderQuantity = Number(orderQuantityInput.value);

    if (!productsMap.has(id)) {
        alert("Товар з таким ID не знайдено.");
        return;
    }

    if (orderQuantity <= 0) {
        alert("Кількість для замовлення має бути більшою за 0.");
        return;
    }

    const product = productsMap.get(id);

    if (product.quantity < orderQuantity) {
        alert("Недостатньо товару на складі.");
        return;
    }

    product.quantity -= orderQuantity;
    productsMap.set(id, product);

    orderedProductsWeakSet.add(product);

    const history = productHistoryWeakMap.get(product);
    history.changes.push(
        `Оформлено замовлення: -${orderQuantity} шт. (${new Date().toLocaleString("uk-UA")})`,
    );

    ordersMap.set(orderCounter, {
        orderId: orderCounter,
        productId: product.id,
        productName: product.name,
        quantity: orderQuantity,
        date: new Date().toLocaleString("uk-UA"),
    });

    orderCounter++;

    orderProductIdInput.value = "";
    orderQuantityInput.value = "";

    alert("Замовлення оформлено успішно.");
    showProducts();
}

function showProducts() {
    if (productsMap.size === 0) {
        productsOutput.innerHTML = "Товарів ще немає.";
        return;
    }

    productsOutput.innerHTML = "";

    for (const product of productsMap.values()) {
        const history = productHistoryWeakMap.get(product);

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
      <strong>ID:</strong> ${product.id}<br>
      <strong>Назва:</strong> ${product.name}<br>
      <strong>Ціна:</strong> ${product.price} грн<br>
      <strong>Кількість:</strong> ${product.quantity}<br>
      <strong>Категорія:</strong> ${product.category}<br>
      <strong>Створено:</strong> ${history.createdAt}<br>
      <strong>Історія змін:</strong> ${history.changes.join(" | ")}<br>
      <strong>Був замовлений:</strong> ${orderedProductsWeakSet.has(product) ? "Так" : "Ні"}
    `;

        productsOutput.appendChild(card);
    }
}

function showCategories() {
    if (categoriesSet.size === 0) {
        categoriesOutput.innerHTML = "Категорій ще немає.";
        return;
    }

    categoriesOutput.innerHTML = "";

    categoriesSet.forEach((category) => {
        const p = document.createElement("p");
        p.textContent = category;
        categoriesOutput.appendChild(p);
    });
}

function showOrders() {
    if (ordersMap.size === 0) {
        ordersOutput.innerHTML = "Замовлень ще немає.";
        return;
    }

    ordersOutput.innerHTML = "";

    for (const order of ordersMap.values()) {
        const card = document.createElement("div");
        card.className = "order-card";

        card.innerHTML = `
      <strong>Номер замовлення:</strong> ${order.orderId}<br>
      <strong>ID товару:</strong> ${order.productId}<br>
      <strong>Назва товару:</strong> ${order.productName}<br>
      <strong>Кількість:</strong> ${order.quantity}<br>
      <strong>Дата:</strong> ${order.date}
    `;

        ordersOutput.appendChild(card);
    }
}

function rebuildCategories() {
    categoriesSet.clear();

    for (const product of productsMap.values()) {
        categoriesSet.add(product.category);
    }
}

function clearAddInputs() {
    productIdInput.value = "";
    productNameInput.value = "";
    productPriceInput.value = "";
    productQuantityInput.value = "";
    productCategoryInput.value = "";
}

addProductBtn.addEventListener("click", addProduct);
deleteProductBtn.addEventListener("click", deleteProduct);
updateProductBtn.addEventListener("click", updateProduct);
searchProductBtn.addEventListener("click", searchProduct);
orderBtn.addEventListener("click", createOrder);
showProductsBtn.addEventListener("click", showProducts);
showCategoriesBtn.addEventListener("click", showCategories);
showOrdersBtn.addEventListener("click", showOrders);
