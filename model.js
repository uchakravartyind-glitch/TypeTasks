const tasks = [];
let nextId = 1;
export function addTask(title) {
    const cleanTitle = title.trim();
    if (cleanTitle.length === 0) {
        throw new Error("A task needs a title.");
    }
    const task = {
        id: nextId,
        title: cleanTitle,
        status: "todo",
        createdAt: new Date(),
    };
    nextId += 1;
    tasks.unshift(task);
    return task;
}
export function advanceTask(id) {
    const task = tasks.find((candidate) => candidate.id === id);
    if (!task) {
        return undefined;
    }
    const nextStatus = {
        todo: "in-progress",
        "in-progress": "done",
        done: "done",
    };
    task.status = nextStatus[task.status];
    return task;
}
export function filterByStatus(status) {
    return tasks.filter((task) => task.status === status);
}
export function getTasks() {
    return [...tasks];
}
