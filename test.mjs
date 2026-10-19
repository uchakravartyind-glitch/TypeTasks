import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { addTask, advanceTask, filterByStatus, getTasks } from "./model.js";

const firstTask = addTask("Test the typed task flow");
const secondTask = addTask("Check every filter");

assert.equal(getTasks().length, 2, "Add should place tasks in the model");
assert.equal(firstTask.status, "todo", "New tasks should begin as todo");
assert.equal(filterByStatus("todo").length, 2, "Todo filter should return both new tasks");

advanceTask(firstTask.id);
assert.equal(firstTask.status, "in-progress", "First advance should start a task");
assert.deepEqual(filterByStatus("in-progress"), [firstTask]);

advanceTask(firstTask.id);
assert.equal(firstTask.status, "done", "Second advance should complete a task");
assert.deepEqual(filterByStatus("done"), [firstTask]);
assert.deepEqual(filterByStatus("todo"), [secondTask]);

const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
assert.match(html, /<input[\s\S]*?id="title"/);
assert.match(html, /<ul[\s\S]*?id="task-list"/);
assert.match(html, /data-filter="all"/);
assert.match(html, /data-filter="todo"/);
assert.match(html, /data-filter="in-progress"/);
assert.match(html, /data-filter="done"/);
assert.match(html, /<script type="module" src="app\.js"><\/script>/);

console.log("All model transitions, filters, and required UI hooks passed.");

