const categories = ["Електроніка", "Одяг", "Книги"];

const initialProducts = [
    {
        id: 1,
        name: "Ноутбук Lenovo",
        price: 25000,
        category: "Електроніка",
        image: "img/lenovo-laptop.jpg",
        createdAt: "2026-03-20T11:00:00",
        updatedAt: "2026-03-20T11:30:00",
    },
    {
        id: 2,
        name: "Футболка Oversize",
        price: 1200,
        category: "Одяг",
        image: "img/tshirt.jpg",
        createdAt: "2026-03-21T12:00:00",
        updatedAt: "2026-03-21T12:30:00",
    },
    {
        id: 3,
        name: "Книга JavaScript для початківців",
        price: 650,
        category: "Книги",
        image: "img/book.jpg",
        createdAt: "2026-03-22T15:00:00",
        updatedAt: "2026-03-22T15:30:00",
    },
];

let state = {
    products: initialProducts,
    selectedCategory: "all",
    selectedSort: null,
    editingProductId: null,
};

const productsList = document.getElementById("productsList");
const emptyMessage = document.getElementById("emptyMessage");
const totalPriceElement = document.getElementById("totalPrice");

const filterButtonsContainer = document.getElementById("filterButtons");
const sortButtonsContainer = document.getElementById("sortButtons");
const resetSortBtn = document.getElementById("resetSortBtn");

const openCreateModalBtn = document.getElementById("openCreateModalBtn");
const productModalBackdrop = document.getElementById("productModalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const submitBtn = document.getElementById("submitBtn");

const productIdInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");

const toast = document.getElementById("toast");

const formatPrice = (price) => `${Number(price).toFixed(2)} ₴`;

const getTotalPrice = (products) =>
    products.reduce((sum, product) => sum + Number(product.price), 0);

const filterProducts = (products, category) =>
    category === "all"
        ? [...products]
        : products.filter((product) => product.category === category);

const sortProducts = (products, sortType) => {
    const copiedProducts = [...products];

    if (!sortType) {
        return copiedProducts;
    }

    if (sortType === "price") {
        return copiedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortType === "createdAt") {
        return copiedProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }

    if (sortType === "updatedAt") {
        return copiedProducts.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
    }

    return copiedProducts;
};

const getVisibleProducts = (currentState) =>
    sortProducts(
        filterProducts(currentState.products, currentState.selectedCategory),
        currentState.selectedSort,
    );

const generateId = (products) =>
    products.length
        ? Math.max(...products.map((product) => product.id)) + 1
        : 1;

const createProduct = ({ products, name, price, category, image }) => {
    const now = new Date().toISOString();

    return {
        id: generateId(products),
        name,
        price: Number(price),
        category,
        image,
        createdAt: now,
        updatedAt: now,
    };
};

const updateProductData = (product, newData) => ({
    ...product,
    name: newData.name,
    price: Number(newData.price),
    category: newData.category,
    image: newData.image,
    updatedAt: new Date().toISOString(),
});

const getFormData = () => ({
    name: nameInput.value.trim(),
    price: priceInput.value.trim(),
    category: categoryInput.value,
    image: imageInput.value.trim(),
});

const showToast = (message) => {
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(showToast.timeoutId);

    showToast.timeoutId = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
};

const openModal = () => {
    productModalBackdrop.classList.remove("hidden");
};

const closeModal = () => {
    productModalBackdrop.classList.add("hidden");
    productForm.reset();
    productIdInput.value = "";
    state = { ...state, editingProductId: null };
};

const openCreateModal = () => {
    modalTitle.textContent = "Додати товар";
    submitBtn.textContent = "Зберегти";
    productForm.reset();
    productIdInput.value = "";
    state = { ...state, editingProductId: null };
    openModal();
};

const openEditModal = (id) => {
    const product = state.products.find((item) => item.id === id);

    if (!product) {
        return;
    }

    modalTitle.textContent = "Редагувати товар";
    submitBtn.textContent = "Оновити";

    productIdInput.value = product.id;
    nameInput.value = product.name;
    priceInput.value = product.price;
    categoryInput.value = product.category;
    imageInput.value = product.image;

    state = { ...state, editingProductId: id };
    openModal();
};

const updateTotalPrice = () => {
    totalPriceElement.textContent = formatPrice(getTotalPrice(state.products));
};

const createProductCard = (product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = String(product.id);

    const image = document.createElement("img");
    image.className = "product-card__image";
    image.src = product.image;
    image.alt = product.name;

    const body = document.createElement("div");
    body.className = "product-card__body";

    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.name;

    const idText = document.createElement("p");
    idText.className = "product-card__text";
    idText.textContent = `ID: ${product.id}`;

    const priceText = document.createElement("p");
    priceText.className = "product-card__text";
    priceText.textContent = `Ціна: ${formatPrice(product.price)}`;

    const categoryText = document.createElement("p");
    categoryText.className = "product-card__text";
    categoryText.textContent = `Категорія: ${product.category}`;

    const createdText = document.createElement("p");
    createdText.className = "product-card__text";
    createdText.textContent = `Створено: ${new Date(product.createdAt).toLocaleString("uk-UA")}`;

    const updatedText = document.createElement("p");
    updatedText.className = "product-card__text";
    updatedText.textContent = `Оновлено: ${new Date(product.updatedAt).toLocaleString("uk-UA")}`;

    const actions = document.createElement("div");
    actions.className = "product-card__actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn--secondary";
    editBtn.textContent = "Редагувати";
    editBtn.addEventListener("click", () => openEditModal(product.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn--danger";
    deleteBtn.textContent = "Видалити";
    deleteBtn.addEventListener("click", () => deleteProduct(product.id));

    actions.append(editBtn, deleteBtn);

    body.append(
        title,
        idText,
        priceText,
        categoryText,
        createdText,
        updatedText,
        actions,
    );
    card.append(image, body);

    return card;
};

const renderProducts = () => {
    const visibleProducts = getVisibleProducts(state);

    productsList.innerHTML = "";

    if (visibleProducts.length === 1) {
        productsList.classList.add("products-grid--single");
    } else {
        productsList.classList.remove("products-grid--single");
    }

    if (visibleProducts.length === 0) {
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");

        visibleProducts.forEach((product) => {
            productsList.append(createProductCard(product));
        });
    }

    updateTotalPrice();
};

const createFilterButton = (label, categoryValue) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn--secondary";

    if (state.selectedCategory === categoryValue) {
        button.classList.add("btn--active");
    }

    button.textContent = label;

    button.addEventListener("click", () => {
        state = { ...state, selectedCategory: categoryValue };
        renderFilterButtons();
        renderProducts();
    });

    return button;
};

const renderFilterButtons = () => {
    filterButtonsContainer.innerHTML = "";

    filterButtonsContainer.append(createFilterButton("Усі", "all"));

    categories.forEach((category) => {
        filterButtonsContainer.append(createFilterButton(category, category));
    });

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "btn btn--reset";
    resetButton.textContent = "Скинути фільтрацію";

    resetButton.addEventListener("click", () => {
        state = { ...state, selectedCategory: "all" };
        renderFilterButtons();
        renderProducts();
    });

    filterButtonsContainer.append(resetButton);
};

const updateSortButtonsState = () => {
    const sortButtons = sortButtonsContainer.querySelectorAll("[data-sort]");

    sortButtons.forEach((button) => {
        if (button.dataset.sort === state.selectedSort) {
            button.classList.add("btn--active");
        } else {
            button.classList.remove("btn--active");
        }
    });
};

const addProduct = (formData) => {
    const newProduct = createProduct({
        products: state.products,
        ...formData,
    });

    state = {
        ...state,
        products: [...state.products, newProduct],
    };

    renderProducts();
    closeModal();
    showToast(`Товар "${newProduct.name}" успішно додано.`);
};

const editProduct = (formData) => {
    state = {
        ...state,
        products: state.products.map((product) =>
            product.id === state.editingProductId
                ? updateProductData(product, formData)
                : product,
        ),
    };

    const updatedProduct = state.products.find(
        (product) => product.id === state.editingProductId,
    );

    renderProducts();
    closeModal();
    showToast(
        `Товар ID: ${updatedProduct.id}, "${updatedProduct.name}" успішно оновлено.`,
    );
};

const deleteProduct = (id) => {
    const card = document.querySelector(`[data-id="${id}"]`);
    const product = state.products.find((item) => item.id === id);

    if (!product) {
        return;
    }

    if (card) {
        card.classList.add("removing");

        setTimeout(() => {
            state = {
                ...state,
                products: state.products.filter((item) => item.id !== id),
            };

            renderProducts();
            showToast(`Товар "${product.name}" успішно видалено.`);
        }, 300);
    }
};

productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!productForm.checkValidity()) {
        productForm.reportValidity();
        return;
    }

    const formData = getFormData();

    if (state.editingProductId) {
        editProduct(formData);
    } else {
        addProduct(formData);
    }
});

openCreateModalBtn.addEventListener("click", openCreateModal);
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

productModalBackdrop.addEventListener("click", (event) => {
    if (event.target === productModalBackdrop) {
        closeModal();
    }
});

sortButtonsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sort]");

    if (!button) {
        return;
    }

    state = { ...state, selectedSort: button.dataset.sort };
    updateSortButtonsState();
    renderProducts();
});

resetSortBtn.addEventListener("click", () => {
    state = { ...state, selectedSort: null };
    updateSortButtonsState();
    renderProducts();
});

renderFilterButtons();
updateSortButtonsState();
renderProducts();
