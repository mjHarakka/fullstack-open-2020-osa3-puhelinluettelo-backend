const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { response } = require("express");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("build"));

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const password = "AlpakkaPaskooNurtsille";

//db connection url
const url = `mongodb+srv://mikko:${password}@cluster0.duudm.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  res.send(
    "Phonebook has info for " +
      persons.length +
      " people <br><br> " +
      new Date()
  );
});

app.get("/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/persons", (req, res) => {
  new Person({
    name: req.body.name,
    number: req.body.number,
  }).save();
});

app.delete("/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});
