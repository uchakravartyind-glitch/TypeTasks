export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: Date;
}

const tasks: Task[] = [];
let nextId = 1;

export function addTask(title: string): Task {
  const cleanTitle = title.trim();

  if (cleanTitle.length === 0) {
    throw new Error("A task needs a title.");
  }

  const task: Task = {
    id: nextId,
    title: cleanTitle,
    status: "todo",
    createdAt: new Date(),
  };

  nextId += 1;
  tasks.unshift(task);
  return task;
}

export function advanceTask(id: number): Task | undefined {
  const task = tasks.find((candidate: Task) => candidate.id === id);

  if (!task) {
    return undefined;
  }

  const nextStatus: Record<TaskStatus, TaskStatus> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "done",
  };

  task.status = nextStatus[task.status];
  return task;
}

export function filterByStatus(status: TaskStatus): Task[] {
  return tasks.filter((task: Task) => task.status === status);
}

export function getTasks(): Task[] {
  return [...tasks];
}

