import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/buildRoutePath.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const data = database.select("tasks");
      return res.writeHead(200).end(JSON.stringify(data));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title)
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Property 'title' is required" }));

      if (!description)
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Property 'description' is required" })
          );

      const date = new Date();

      database.insert("tasks", {
        id: randomUUID(),
        title,
        description,
        created_at: date,
        updated_at: date,
        completed_at: null,
      });

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.getOne('tasks', id);
      if (!task) return res.writeHead(400).end(JSON.stringify({ message: "This id do not exists." }));

      const { title, description } = req.body;
      const date = new Date();

      database.update("tasks", id, { title, description, updated_at: date });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.getOne('tasks', id);
      if (!task) return res.writeHead(400).end(JSON.stringify({ message: "This id do not exists." }));

      const date = new Date();

      database.update("tasks", id, { completed_at: date, updated_at: date });

      res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      
      const task = database.getOne('tasks', id);
      if (!task) return res.writeHead(400).end(JSON.stringify({ message: "This id do not exists." }));

      database.delete("tasks", id);

      res.writeHead(204).end();
    },
  },
];
