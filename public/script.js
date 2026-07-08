let notes = [];
let editId = null;

// Character Counter
function countCharacters() {
    document.getElementById("charCount").innerText =
        document.getElementById("note").value.length;
}

// Reset Form
function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("course").value = "";
    document.getElementById("date").value = "";
    document.getElementById("note").value = "";
    document.getElementById("charCount").innerText = "0";
    document.getElementById("message").innerHTML = "";
    editId = null;
}

// Add / Update Note
async function addNote() {

    const name = document.getElementById("name").value.trim();
    const course = document.getElementById("course").value.trim();
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value.trim();

    if (!name || !course || !date || !note) {
        document.getElementById("message").style.color = "red";
        document.getElementById("message").innerHTML = "Please fill all fields.";
        return;
    }

    try {

        let response;

        if (editId == null) {

            response = await fetch("/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    course,
                    date,
                    note
                })
            });

        } else {

            response = await fetch("/notes/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    course,
                    date,
                    note
                })
            });

        }

        if (response.ok) {

            document.getElementById("message").style.color = "green";
            document.getElementById("message").innerHTML = "Saved Successfully";

            resetForm();
            loadNotes();

        } else {

            const error = await response.text();
            console.log(error);
            alert("Data save nahi hua.");

        }

    } catch (err) {

        console.log(err);
        alert("Server Error");

    }

}

// Load Notes
async function loadNotes() {

    const res = await fetch("/notes");
    notes = await res.json();

    displayNotes(notes);
    updateDashboard();
}

// Display Notes
function displayNotes(data) {

    let output = "";

    if (data.length == 0) {
        output = "<h3>No Notes Found</h3>";
    }

    data.forEach(item => {

        output += `
        <div class="card">

        <p><b>Name:</b> ${item.name}</p>
        <p><b>Course:</b> ${item.course}</p>
        <p><b>Date:</b> ${item.date}</p>
        <p><b>Notes:</b> ${item.note}</p>

        <button class="edit-btn"
        onclick="editNote('${item._id}')">
        Edit
        </button>

        <button class="delete-btn"
        onclick="deleteNote('${item._id}')">
        Delete
        </button>

        </div>
        `;

    });

    document.getElementById("notesList").innerHTML = output;
}

// Delete
async function deleteNote(id) {

    if (!confirm("Delete this note?")) return;

    await fetch("/notes/" + id, {
        method: "DELETE"
    });

    loadNotes();
}

// Edit
function editNote(id) {

    const item = notes.find(n => n._id === id);

    document.getElementById("name").value = item.name;
    document.getElementById("course").value = item.course;
    document.getElementById("date").value = item.date;
    document.getElementById("note").value = item.note;

    document.getElementById("charCount").innerText =
        item.note.length;

    editId = id;
}

// Search
function searchNotes() {

    const name =
        document.getElementById("searchName")
        .value.toLowerCase();

    const course =
        document.getElementById("searchCourse")
        .value.toLowerCase();

    const filtered = notes.filter(item =>

        item.name.toLowerCase().includes(name) &&
        item.course.toLowerCase().includes(course)

    );

    displayNotes(filtered);
}

// Filter Date
function filterNotes() {

    const date =
        document.getElementById("filterDate").value;

    const filtered =
        notes.filter(item => item.date == date);

    displayNotes(filtered);
}

// Dashboard
function updateDashboard() {

    document.getElementById("totalNotes").innerHTML =
        notes.length;

    const students =
        [...new Set(notes.map(n => n.name))];

    document.getElementById("totalStudents").innerHTML =
        students.length;

    const today =
        new Date().toISOString().split("T")[0];

    document.getElementById("todayNotes").innerHTML =
        notes.filter(n => n.date == today).length;

    document.getElementById("latestNote").innerHTML =
        notes.length ?
        notes[notes.length - 1].name :
        "No Notes";
}

loadNotes();