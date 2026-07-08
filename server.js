const path = require("path")
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("_dirname"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let notes = [];
let nextId = 1;

// Add Note
app.post("/notes", (req, res) => {

    const { name, course, date, note } = req.body;

    if (!name || !course || !date || !note) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newNote = {
        id: nextId++,
        name,
        course,
        date,
        note
    };

    notes.unshift(newNote);

    res.status(201).json(newNote);
});

// Get All Notes
app.get("/notes", (req, res) => {
    res.json(notes);
});

// Update Note
app.put("/notes/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const { name, course, date, note } = req.body;

    const index = notes.findIndex(n => n.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    notes[index] = {
        id,
        name,
        course,
        date,
        note
    };

    res.json(notes[index]);
});

// Delete Note
app.delete("/notes/:id", (req, res) => {

    const id = parseInt(req.params.id);

    notes = notes.filter(note => note.id !== id);

    res.json({
        success: true,
        message: "Note Deleted"
    });
});

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});