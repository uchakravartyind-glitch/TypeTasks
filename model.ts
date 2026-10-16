// model.ts

// 1. Define the TaskStatus union type
export type TaskStatus = "todo" | "in-progress" | "done";

// 2. Define the Task interface
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

let nextId = 1;

/**
 * 3. Adds a new task with status "todo" and a unique ID.
 */
export function addTask(tasks: Task[], title: string): Task[] {
  const newTask: Task = {
    id: nextId++,
    title,
    status: "todo",
  };
  return [...tasks, newTask];
}

/**
 * 4. Marks a task as "done" by ID.
 */
export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, status: "done" } : task
  );
}

/**
 * 5. Filters tasks by their status.
 */
export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status);
}

// -------------------------------------------------------------------
// EXTRA CUSTOM OPERATIONS (Originality requirement)
// -------------------------------------------------------------------

/**
 * Deletes a task by ID.
 */
export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((task) => task.id !== id);
}

/**
 * Advances a task through stages: todo -> in-progress -> done.
 */
export function advanceTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) => {
    if (task.id !== id) return task;
    const nextStatus: TaskStatus =
      task.status === "todo" ? "in-progress" : "done";
    return { ...task, status: nextStatus };
  });
}

/**
 * Returns the count of tasks matching a given status.
 */
export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return filterByStatus(tasks, status).length;
}
