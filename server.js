const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let notes = [];
let nextId = 1;

// Add Note
app.post("/notes", (req, res) => {

    const { name, course, date, note } = req.body;

    const newNote = {
        id: nextId++,
        name,
        course,
        date,
        note
    };

    notes.push(newNote);

    res.status(201).json(newNote);
});



// Get All Notes
app.get("/notes", (req, res) => {
    res.json(notes);
});

app.delete("/notes/:id", (req, res) => {

    const id = parseInt(req.params.id);

    notes = notes.filter(note => note.id !== id);

    console.log("Remaining Notes:", notes);

    res.json({
        success: true
    });
});

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});