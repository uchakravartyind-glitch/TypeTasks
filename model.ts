export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export function addTask(tasks: Task[], title: string): Task[] {
  const nextId = tasks.reduce(
    (largestId: number, task: Task): number => Math.max(largestId, task.id),
    0,
  ) + 1;

  const newTask: Task = {
    id: nextId,
    title: title.trim(),
    status: "todo",
  };

  return [...tasks, newTask];
}

export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task: Task): Task =>
    task.id === id ? { ...task, status: "done" } : task,
  );
}

export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task: Task): boolean => task.status === status);
}

// Original extra operation: advances todo → in-progress → done.
export function advanceTask(tasks: Task[], id: number): Task[] {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "done",
  };

  return tasks.map((task: Task): Task =>
    task.id === id ? { ...task, status: nextStatus[task.status] } : task,
  );
}

/*
Type-safety checks (intentionally commented out so the project compiles):

const missingStatus: Task = { id: 1, title: "Invalid" };
const stringId: Task = { id: "3", title: "Invalid", status: "todo" };
filterByStatus([], "finished");
*/
