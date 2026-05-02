let draggedTask = null;

const taskLists = document.querySelectorAll(".task-list");
const tasks = document.querySelectorAll(".task");

const handleDragStart = (event) => {
    draggedTask = event.target;
    event.target.classList.add("dragging");

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", event.target.textContent);
};

const handleDragEnd = (event) => {
    event.target.classList.remove("dragging");
    draggedTask = null;
    removeDropTargets();
};

const handleDragOver = (event) => {
    event.preventDefault();

    const taskList = event.currentTarget;
    taskList.classList.add("drag-over");

    const afterElement = getDragAfterElement(taskList, event.clientY);

    if (!draggedTask) {
        return;
    }

    if (afterElement === null) {
        taskList.appendChild(draggedTask);
    } else {
        taskList.insertBefore(draggedTask, afterElement);
    }
};

const handleDragEnter = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
};

const handleDragLeave = (event) => {
    const taskList = event.currentTarget;

    if (!taskList.contains(event.relatedTarget)) {
        taskList.classList.remove("drag-over");
    }
};

const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");
};

const getDragAfterElement = (container, mouseY) => {
    const draggableElements = [
        ...container.querySelectorAll(".task:not(.dragging)"),
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = mouseY - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return {
                    offset,
                    element: child,
                };
            }

            return closest;
        },
        {
            offset: Number.NEGATIVE_INFINITY,
            element: null,
        },
    ).element;
};

const removeDropTargets = () => {
    document.querySelectorAll(".task-list").forEach((taskList) => {
        taskList.classList.remove("drag-over");
    });
};

tasks.forEach((task) => {
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);
});

taskLists.forEach((taskList) => {
    taskList.addEventListener("dragover", handleDragOver);
    taskList.addEventListener("dragenter", handleDragEnter);
    taskList.addEventListener("dragleave", handleDragLeave);
    taskList.addEventListener("drop", handleDrop);
});
