const express = require("express");
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: false },
];

// GET All – Read
app.get("/todos", (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

app.get("/todos/completed", (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

// GET all active todos
app.get("/todos/active", (req, res) => {
  const active = todos.filter((t) => !t.completed);
  res.json(active);
});

// POST New – Create
app.post("/todos", (req, res) => {
  const { task, completed = false } = req.body;
  if (typeof task !== "string" || task.trim() === "") {
    return res
      .status(400)
      .json({ error: 'The "task" field is required and must not be empty' });
  }
  const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  const newTodo = {
    id: nextId,
    task: task.trim(),
    completed: Boolean(completed),
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: "Not found" });
  res.status(204).send(); // Silent success
});

// GET single todo /:id (only digits)
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.status(200).json(todo);
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error!" });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
