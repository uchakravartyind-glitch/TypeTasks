import {
  addTask,
  advanceTask,
  filterByStatus,
  getTasks,
  type Task,
  type TaskStatus,
} from "./model.js";

type FilterStatus = TaskStatus | "all";

const taskForm = document.getElementById("task-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;
const emptyState = document.getElementById("empty-state") as HTMLDivElement;
const filterGroup = document.getElementById("filters") as HTMLDivElement;
const taskCount = document.getElementById("task-count") as HTMLSpanElement;
const progressBar = document.getElementById("progress-bar") as HTMLDivElement;
const progressText = document.getElementById("progress-text") as HTMLSpanElement;
const inputError = document.getElementById("input-error") as HTMLParagraphElement;

let activeFilter: FilterStatus = "all";

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

function tasksForActiveFilter(): Task[] {
  return activeFilter === "all" ? getTasks() : filterByStatus(activeFilter);
}

function updateSummary(): void {
  const allTasks = getTasks();
  const completed = filterByStatus("done").length;
  const total = allTasks.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  taskCount.textContent = `${total} ${total === 1 ? "task" : "tasks"}`;
  progressText.textContent = `${completed} of ${total} complete`;
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage.toString());
}

function createTaskItem(task: Task): HTMLLIElement {
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

function render(): void {
  const visibleTasks = tasksForActiveFilter();
  taskList.replaceChildren(...visibleTasks.map(createTaskItem));

  const noTasks = visibleTasks.length === 0;
  emptyState.hidden = !noTasks;
  taskList.hidden = noTasks;
  emptyState.querySelector("strong")!.textContent =
    getTasks().length === 0 ? "Your orbit is clear" : `No ${statusLabels[activeFilter as TaskStatus]} tasks`;
  emptyState.querySelector("span")!.textContent =
    getTasks().length === 0
      ? "Add a task above to begin your next mission."
      : "Choose another filter to see the rest of your orbit.";

  updateSummary();
}

taskForm.addEventListener("submit", (event: SubmitEvent): void => {
  event.preventDefault();

  try {
    addTask(titleInput.value);
    titleInput.value = "";
    inputError.textContent = "";
    activeFilter = "all";
    updateActiveFilter();
    render();
    titleInput.focus();
  } catch (error: unknown) {
    inputError.textContent = error instanceof Error ? error.message : "Unable to add this task.";
  }
});

taskList.addEventListener("click", (event: MouseEvent): void => {
  const clickedElement = event.target as HTMLElement;
  const button = clickedElement.closest<HTMLButtonElement>("button[data-task-id]");

  if (!button) {
    return;
  }

  advanceTask(Number(button.dataset.taskId));
  render();
});

function updateActiveFilter(): void {
  const buttons = filterGroup.querySelectorAll<HTMLButtonElement>("button[data-filter]");

  buttons.forEach((button: HTMLButtonElement): void => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("filter-chip--active", isActive);
    button.setAttribute("aria-pressed", isActive.toString());
  });
}

filterGroup.addEventListener("click", (event: MouseEvent): void => {
  const clickedElement = event.target as HTMLElement;
  const button = clickedElement.closest<HTMLButtonElement>("button[data-filter]");

  if (!button) {
    return;
  }

  activeFilter = button.dataset.filter as FilterStatus;

  if (activeFilter !== "all") {
    filterByStatus(activeFilter);
  }

  updateActiveFilter();
  render();
});

render();

