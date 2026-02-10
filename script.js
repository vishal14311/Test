const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskPriority = document.querySelector("#task-priority");
const taskDue = document.querySelector("#task-due");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const completedCount = document.querySelector("#completed-count");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");
const hideCompletedToggle = document.querySelector("#hide-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

const tasks = [];
let activeFilter = "all";

const formatDate = (value) => {
  if (!value) {
    return "No due date";
  }

  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const updateSummary = () => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  taskCount.textContent = total;
  completedCount.textContent = completed;
  emptyState.hidden = total > 0;
};

const createBadge = (priority) => {
  const badge = document.createElement("span");
  badge.classList.add("badge", `badge--${priority}`);
  badge.textContent = priority;
  return badge;
};

const shouldShowTask = (task) => {
  if (hideCompletedToggle.checked && task.completed) {
    return false;
  }

  if (activeFilter === "active") {
    return !task.completed;
  }

  if (activeFilter === "completed") {
    return task.completed;
  }

  return true;
};

const renderTasks = () => {
  taskList.innerHTML = "";

  tasks.filter(shouldShowTask).forEach((task) => {
    const card = document.createElement("li");
    card.className = "task-card";
    card.dataset.id = task.id;

    if (task.completed) {
      card.classList.add("is-completed");
    }

    const header = document.createElement("div");
    header.className = "task-card__header";

    const title = document.createElement("div");
    title.className = "task-card__title";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const titleText = document.createElement("span");
    titleText.textContent = task.title;

    title.append(checkbox, titleText);

    const actions = document.createElement("div");
    actions.className = "task-card__actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "icon-btn";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "icon-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => removeTask(task.id));

    actions.append(editButton, deleteButton);
    header.append(title, actions);

    const meta = document.createElement("div");
    meta.className = "task-card__meta";

    const badge = createBadge(task.priority);
    const due = document.createElement("span");
    due.textContent = formatDate(task.dueDate);

    meta.append(badge, due);

    card.append(header, meta);
    taskList.append(card);
  });

  updateSummary();
};

const addTask = (title, priority, dueDate) => {
  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    priority,
    dueDate,
    completed: false,
  });

  renderTasks();
};

const toggleTask = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
};

const removeTask = (id) => {
  const index = tasks.findIndex((item) => item.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    renderTasks();
  }
};

const editTask = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }

  const updatedTitle = window.prompt("Update task name", task.title);
  if (updatedTitle && updatedTitle.trim()) {
    task.title = updatedTitle.trim();
  }

  const updatedPriority = window.prompt(
    "Update priority: low, medium, or high",
    task.priority
  );

  if (["low", "medium", "high"].includes(updatedPriority)) {
    task.priority = updatedPriority;
  }

  renderTasks();
};

const setActiveFilter = (filter) => {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
  });
  renderTasks();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) {
    return;
  }

  addTask(title, taskPriority.value, taskDue.value);
  form.reset();
  taskPriority.value = "medium";
  taskInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  const activeTasks = tasks.filter((task) => !task.completed);
  tasks.length = 0;
  tasks.push(...activeTasks);
  renderTasks();
});

hideCompletedToggle.addEventListener("change", renderTasks);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveFilter(button.dataset.filter));
});

addTask("Review weekly goals", "high", new Date().toISOString().split("T")[0]);
addTask("Schedule team sync", "medium", "");
addTask("Plan focus block", "low", "");
