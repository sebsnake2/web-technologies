const initialTasks = [
    {
        id: 1,
        text: "Підготувати лабораторну роботу",
        completed: false,
        createdAt: "2026-03-29T10:00:00",
        updatedAt: "2026-03-29T11:00:00",
    },
    {
        id: 2,
        text: "Перевірити HTML та CSS",
        completed: true,
        createdAt: "2026-03-28T15:30:00",
        updatedAt: "2026-03-29T09:00:00",
    },
];

let state = {
    tasks: initialTasks,
    selectedSort: null,
    editingTaskId: null,
};

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasksList");
const emptyMessage = document.getElementById("emptyMessage");
const sortButtonsContainer = document.getElementById("sortButtons");
const resetSortBtn = document.getElementById("resetSortBtn");
const toast = document.getElementById("toast");

const formatDate = (dateString) => new Date(dateString).toLocaleString("uk-UA");

const sortTasks = (tasks, sortType) => {
    const copiedTasks = [...tasks];

    if (!sortType) {
        return copiedTasks;
    }

    if (sortType === "createdAt") {
        return copiedTasks.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }

    if (sortType === "updatedAt") {
        return copiedTasks.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
    }

    if (sortType === "completed") {
        return copiedTasks.sort(
            (a, b) => Number(a.completed) - Number(b.completed),
        );
    }

    return copiedTasks;
};

const getVisibleTasks = (currentState) =>
    sortTasks(currentState.tasks, currentState.selectedSort);

const generateId = (tasks) =>
    tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

const createTask = ({ tasks, text }) => {
    const now = new Date().toISOString();

    return {
        id: generateId(tasks),
        text,
        completed: false,
        createdAt: now,
        updatedAt: now,
    };
};

const updateTaskText = (task, newText) => ({
    ...task,
    text: newText,
    updatedAt: new Date().toISOString(),
});

const toggleTaskCompletedData = (task) => ({
    ...task,
    completed: !task.completed,
    updatedAt: new Date().toISOString(),
});

const showToast = (message) => {
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(showToast.timeoutId);

    showToast.timeoutId = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
};

const renderSortButtonsState = () => {
    const buttons = sortButtonsContainer.querySelectorAll("[data-sort]");

    buttons.forEach((button) => {
        if (button.dataset.sort === state.selectedSort) {
            button.classList.add("btn--active");
        } else {
            button.classList.remove("btn--active");
        }
    });
};

const startEditingTask = (id) => {
    state = { ...state, editingTaskId: id };
    renderTasks();
};

const cancelEditingTask = () => {
    state = { ...state, editingTaskId: null };
    renderTasks();
};

const saveEditedTask = (id, inputValue) => {
    const trimmedValue = inputValue.trim();

    if (trimmedValue.length < 2) {
        showToast("Текст завдання має містити щонайменше 2 символи.");
        return;
    }

    state = {
        ...state,
        tasks: state.tasks.map((task) =>
            task.id === id ? updateTaskText(task, trimmedValue) : task,
        ),
        editingTaskId: null,
    };

    const updatedTask = state.tasks.find((task) => task.id === id);

    renderTasks();
    showToast(`Завдання "${updatedTask.text}" успішно оновлено.`);
};

const deleteTask = (id) => {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const task = state.tasks.find((item) => item.id === id);

    if (!task) {
        return;
    }

    if (taskElement) {
        taskElement.classList.add("removing");

        setTimeout(() => {
            state = {
                ...state,
                tasks: state.tasks.filter((item) => item.id !== id),
            };

            renderTasks();
            showToast(`Завдання "${task.text}" успішно видалено.`);
        }, 280);
    }
};

const toggleTaskCompleted = (id) => {
    state = {
        ...state,
        tasks: state.tasks.map((task) =>
            task.id === id ? toggleTaskCompletedData(task) : task,
        ),
    };

    const updatedTask = state.tasks.find((task) => task.id === id);

    renderTasks();

    if (updatedTask.completed) {
        showToast(`Завдання "${updatedTask.text}" відзначено як виконане.`);
    } else {
        showToast(`Завдання "${updatedTask.text}" позначено як невиконане.`);
    }
};

const createTaskView = (task) => {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.id = String(task.id);

    if (task.completed) {
        item.classList.add("task-item--completed");
    }

    if (state.editingTaskId === task.id) {
        const editBox = document.createElement("div");
        editBox.className = "task-item__edit-box";

        const editInput = document.createElement("input");
        editInput.className = "task-item__edit-input";
        editInput.type = "text";
        editInput.value = task.text;
        editInput.minLength = 2;
        editInput.maxLength = 100;
        editInput.required = true;

        const editActions = document.createElement("div");
        editActions.className = "task-item__edit-actions";

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "btn btn--primary";
        saveBtn.textContent = "Зберегти";
        saveBtn.addEventListener("click", () =>
            saveEditedTask(task.id, editInput.value),
        );

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "btn btn--secondary";
        cancelBtn.textContent = "Скасувати";
        cancelBtn.addEventListener("click", cancelEditingTask);

        editInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                saveEditedTask(task.id, editInput.value);
            }
        });

        editActions.append(saveBtn, cancelBtn);
        editBox.append(editInput, editActions);
        item.append(editBox);

        return item;
    }

    const top = document.createElement("div");
    top.className = "task-item__top";

    const text = document.createElement("p");
    text.className = "task-item__text";
    text.textContent = task.text;
    text.title = "Натисніть, щоб змінити стан виконання";
    text.addEventListener("click", () => toggleTaskCompleted(task.id));

    const badge = document.createElement("span");
    badge.className = "task-item__badge";
    badge.textContent = task.completed ? "Виконано" : "Не виконано";

    const leftBox = document.createElement("div");
    leftBox.append(text, badge);

    top.append(leftBox);

    const meta = document.createElement("div");
    meta.className = "task-item__meta";
    meta.innerHTML = `
    <div>Дата додавання: ${formatDate(task.createdAt)}</div>
    <div>Дата оновлення: ${formatDate(task.updatedAt)}</div>
  `;

    const actions = document.createElement("div");
    actions.className = "task-item__actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn--secondary";
    editBtn.textContent = "Редагувати";
    editBtn.addEventListener("click", () => startEditingTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn--danger";
    deleteBtn.textContent = "Видалити";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actions.append(editBtn, deleteBtn);

    item.append(top, meta, actions);

    return item;
};

const renderTasks = () => {
    const visibleTasks = getVisibleTasks(state);

    tasksList.innerHTML = "";

    if (visibleTasks.length === 0) {
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");

        visibleTasks.forEach((task) => {
            tasksList.append(createTaskView(task));
        });
    }

    renderSortButtonsState();
};

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!taskForm.checkValidity()) {
        taskForm.reportValidity();
        return;
    }

    const text = taskInput.value.trim();

    const newTask = createTask({
        tasks: state.tasks,
        text,
    });

    state = {
        ...state,
        tasks: [...state.tasks, newTask],
    };

    taskForm.reset();
    renderTasks();
    showToast(`Завдання "${newTask.text}" успішно додано.`);
});

sortButtonsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sort]");

    if (!button) {
        return;
    }

    state = { ...state, selectedSort: button.dataset.sort };
    renderTasks();
});

resetSortBtn.addEventListener("click", () => {
    state = { ...state, selectedSort: null };
    renderTasks();
});

renderTasks();
