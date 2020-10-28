const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

app.use(cors());
app.use(express.json());

morgan.token("token", (req, res) => res.resBody);

app.use(
  morgan(
    ":method :status :url: :status :res[content-length] - :response-time ms :token"
  )
);

let persons = [
  {
    id: 1,
    name: "miksa",
    number: "01212345",
  },
  {
    id: 2,
    name: "ada",
    number: "5216512",
  },
  {
    id: 3,
    name: "teppo tulppu",
    number: "123888999",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/info", (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people - ${new Date()}`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  console.log(req.body);
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
