const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

const cors = require("cors");

app.use(express.json());

app.use(cors());

const projects = [];

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.json({
      error: "invalid project id",
    });
  }

  return next();
}

app.use("/projects/:id", validateProjectId);

app.get("/projects", (req, res) => {
  const { owner } = req.query;

  const result = owner
    ? projects.filter((project) => project.owner.includes(owner))
    : projects;

  return res.json(result);
});

app.post("/projects", (req, res) => {
  const { title, owner } = req.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return res.json(project);
});

app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({
      error: "Project not found",
    });
  }

  const { title, owner } = req.body;
  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return res.json(project);
});

app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({
      error: "Project not found",
    });
  }

  projects.splice(projectIndex, 1);

  return res.status(204).send();
});

app.listen(3333, () => console.log("Backend started"));
