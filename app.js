import { addTask, advanceTask, filterByStatus, getTasks, } from "./model.js";
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterGroup = document.getElementById("filters");
const taskCount = document.getElementById("task-count");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const inputError = document.getElementById("input-error");
let activeFilter = "all";
const statusLabels = {
    todo: "To do",
    "in-progress": "In progress",
    done: "Done",
};
function tasksForActiveFilter() {
    return activeFilter === "all" ? getTasks() : filterByStatus(activeFilter);
}
function updateSummary() {
    const allTasks = getTasks();
    const completed = filterByStatus("done").length;
    const total = allTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    taskCount.textContent = `${total} ${total === 1 ? "task" : "tasks"}`;
    progressText.textContent = `${completed} of ${total} complete`;
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute("aria-valuenow", percentage.toString());
}
function createTaskItem(task) {
    const item = document.createElement("li");
    item.className = `task-card task-card--${task.status}`;
    const content = document.createElement("div");
    content.className = "task-card__content";
    const title = document.createElement("p");
    title.className = "task-card__title";
    title.textContent = task.title;
    const meta = document.createElement("div");
    meta.className = "task-card__meta";
    const badge = document.createElement("span");
    badge.className = `status-badge status-badge--${task.status}`;
    badge.textContent = statusLabels[task.status];
    const date = document.createElement("time");
    date.dateTime = task.createdAt.toISOString();
    date.textContent = task.createdAt.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
    });
    meta.append(badge, date);
    content.append(title, meta);
    const advanceButton = document.createElement("button");
    advanceButton.type = "button";
    advanceButton.className = "advance-button";
    advanceButton.dataset.taskId = task.id.toString();
    advanceButton.disabled = task.status === "done";
    advanceButton.textContent =
        task.status === "todo" ? "Start" : task.status === "in-progress" ? "Complete" : "Completed";
    advanceButton.setAttribute("aria-label", `${advanceButton.textContent} ${task.title}`);
    item.append(content, advanceButton);
    return item;
}
function render() {
    const visibleTasks = tasksForActiveFilter();
    taskList.replaceChildren(...visibleTasks.map(createTaskItem));
    const noTasks = visibleTasks.length === 0;
    emptyState.hidden = !noTasks;
    taskList.hidden = noTasks;
    emptyState.querySelector("strong").textContent =
        getTasks().length === 0 ? "Your orbit is clear" : `No ${statusLabels[activeFilter]} tasks`;
    emptyState.querySelector("span").textContent =
        getTasks().length === 0
            ? "Add a task above to begin your next mission."
            : "Choose another filter to see the rest of your orbit.";
    updateSummary();
}
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        addTask(titleInput.value);
        titleInput.value = "";
        inputError.textContent = "";
        activeFilter = "all";
        updateActiveFilter();
        render();
        titleInput.focus();
    }
    catch (error) {
        inputError.textContent = error instanceof Error ? error.message : "Unable to add this task.";
    }
});
taskList.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const button = clickedElement.closest("button[data-task-id]");
    if (!button) {
        return;
    }
    advanceTask(Number(button.dataset.taskId));
    render();
});
function updateActiveFilter() {
    const buttons = filterGroup.querySelectorAll("button[data-filter]");
    buttons.forEach((button) => {
        const isActive = button.dataset.filter === activeFilter;
        button.classList.toggle("filter-chip--active", isActive);
        button.setAttribute("aria-pressed", isActive.toString());
    });
}
filterGroup.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const button = clickedElement.closest("button[data-filter]");
    if (!button) {
        return;
    }
    activeFilter = button.dataset.filter;
    if (activeFilter !== "all") {
        filterByStatus(activeFilter);
    }
    updateActiveFilter();
    render();
});
render();
