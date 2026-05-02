let cards = [
    {
        id: 1,
        title: "JavaScript",
        description: "веб / скрипти",
        icon: "🟧",
        color: "#fff0dc",
    },
    {
        id: 2,
        title: "Python",
        description: "дані / AI",
        icon: "🐍",
        color: "#e9f7dc",
    },
    {
        id: 3,
        title: "Java",
        description: "бекенд / ентерпрайз",
        icon: "☕",
        color: "#fde9e4",
    },
    {
        id: 4,
        title: "TypeScript",
        description: "типізований JS",
        icon: "🔷",
        color: "#e5f3ff",
    },
    {
        id: 5,
        title: "Rust",
        description: "системи / швидкість",
        icon: "🦀",
        color: "#ffe8f0",
    },
    {
        id: 6,
        title: "Go",
        description: "хмара / мікросервіси",
        icon: "🐹",
        color: "#dff8ef",
    },
    {
        id: 7,
        title: "Kotlin",
        description: "Android / JVM",
        icon: "💜",
        color: "#efebff",
    },
    {
        id: 8,
        title: "Swift",
        description: "iOS / macOS",
        icon: "🍎",
        color: "#ffe9f2",
    },
    {
        id: 9,
        title: "C++",
        description: "ігри / системи",
        icon: "⚡",
        color: "#e5f3ff",
    },
    {
        id: 10,
        title: "PHP",
        description: "веб / сервер",
        icon: "🐘",
        color: "#f0eee9",
    },
];

let isEditMode = false;
let draggedCardId = null;

const cardsGrid = document.getElementById("cardsGrid");
const editBtn = document.getElementById("editBtn");
const hintText = document.getElementById("hintText");

const renderCards = () => {
    cardsGrid.innerHTML = "";

    cards.forEach((card) => {
        const cardElement = document.createElement("article");
        cardElement.className = "card";
        cardElement.dataset.id = card.id;
        cardElement.draggable = isEditMode;

        cardElement.innerHTML = `
      <button class="delete-btn" aria-label="Delete card">×</button>

      <div class="card-content">
        <div class="icon-box" style="background: ${card.color}">
          ${card.icon}
        </div>

        <h3 class="card-title">${card.title}</h3>
        <p class="card-description">${card.description}</p>
      </div>
    `;

        const deleteBtn = cardElement.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteCard(card.id);
        });

        cardElement.addEventListener("dragstart", handleDragStart);
        cardElement.addEventListener("dragover", handleDragOver);
        cardElement.addEventListener("drop", handleDrop);
        cardElement.addEventListener("dragend", handleDragEnd);

        cardsGrid.appendChild(cardElement);
    });

    cardsGrid.classList.toggle("edit-mode", isEditMode);
};

const toggleEditMode = () => {
    isEditMode = !isEditMode;

    editBtn.textContent = isEditMode ? "Готово" : "Редагувати";
    editBtn.classList.toggle("done", isEditMode);

    hintText.textContent = isEditMode
        ? "Перетягуйте картки або натискайте × щоб видалити"
        : "Натисніть «Редагувати» для керування картками";

    renderCards();
};

const deleteCard = (cardId) => {
    if (!isEditMode) {
        return;
    }

    cards = cards.filter((card) => card.id !== cardId);
    renderCards();
};

const handleDragStart = (event) => {
    if (!isEditMode) {
        event.preventDefault();
        return;
    }

    draggedCardId = Number(event.currentTarget.dataset.id);
    event.currentTarget.classList.add("dragging");

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(draggedCardId));
};

const handleDragOver = (event) => {
    if (!isEditMode) {
        return;
    }

    event.preventDefault();
};

const handleDrop = (event) => {
    if (!isEditMode) {
        return;
    }

    event.preventDefault();

    const targetCardId = Number(event.currentTarget.dataset.id);

    if (draggedCardId === targetCardId) {
        return;
    }

    reorderCards(draggedCardId, targetCardId);
    renderCards();
};

const handleDragEnd = (event) => {
    event.currentTarget.classList.remove("dragging");
    draggedCardId = null;
};

const reorderCards = (draggedId, targetId) => {
    const draggedIndex = cards.findIndex((card) => card.id === draggedId);
    const targetIndex = cards.findIndex((card) => card.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
        return;
    }

    const updatedCards = [...cards];
    const [draggedCard] = updatedCards.splice(draggedIndex, 1);

    updatedCards.splice(targetIndex, 0, draggedCard);

    cards = updatedCards;
};

editBtn.addEventListener("click", toggleEditMode);

renderCards();
