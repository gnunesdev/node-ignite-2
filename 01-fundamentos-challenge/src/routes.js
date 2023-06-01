import { extractQueryParams } from "./utils/extract-query-params.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
      };

      const taskCreated = database.insert("tasks", task);

      return res.writeHead(201).end(JSON.stringify(taskCreated));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: true,
            message: "This task does not exists",
          })
        );
      }

      const taskUpdated = database.update("tasks", id, {
        ...task,
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(201).end(JSON.stringify(taskUpdated));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: true,
            message: "This task does not exists",
          })
        );
      }

      database.delete("tasks", task.id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: true,
            message: "This task does not exists",
          })
        );
      }

      database.update("tasks", id, {
        ...task,
        completed_at: new Date().toISOString(),
      });

      return res.end();
    },
  },
];
