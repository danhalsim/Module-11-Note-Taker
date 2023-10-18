const path = require('path');
const fs = require('fs');
const express = require('express');
const { uuid } = require('uuidv4');

// process.env.PORT for Heroku. 3001 for local.
const PORT = process.env.PORT || 3001;

// Initialize Express app
const app = express();

// Middleware to parse the JSON data
app.use(express.json());
// Middleware to parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the public folder
app.use(express.static('public'));

// Route to render index.html when the user accesses the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// Route for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Read JSON file located at ./db/db.json, parse its contents, then send the parsed JSON data as a response
app.get('/api/notes', async (req, res) => {
    try {
        const notesData = await fs.readFileSync('./db/db.json', 'utf-8');
        const parsedNotesData = JSON.parse(notesData);
        return res.json(parsedNotesData);
    } catch (err) {
        return res.status(500).json(err);
  }
});

// Route to post new notes
// Receive new note, give it a unique id, add to db.json, return new note to user
app.post('/api/notes', async (req, res) => {
    try {
        console.info(`${req.method} request received to add a note.`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        const data = await fs.readFileSync("./db/db.json", "utf-8");
        const dataArray = JSON.parse(data);

        dataArray.push(newNote);

        const stringDataArray = JSON.stringify(dataArray, null, 2);

        await fs.writeFileSync("./db/db.json", stringDataArray);

        console.info(`${newNote.title} has been added to JSON file.`);

        const response = {
            status: "Success",
            body: newNote
        };

        return res.status(201).json(response);
    } else {
        return res.status(500).json("Error occurred when trying to post note.");
    }
} catch (err) {
    return res.status(500).json(err);
};
}
);




// Catch-all route for HTTP GET requests that sends back index.html
app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'))
});

// Listen for requests and console log a message once the server is running
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);