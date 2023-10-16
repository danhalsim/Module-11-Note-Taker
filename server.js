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

// Route to render index.html when a user accesses the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// Route for notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);


app.get('/api/notes', async (req, res) => {
  try {
    const notesData = await fs.readFileSync('./db/db.json', 'utf-8');
    const parsedNotesData = JSON.parse(notesData);
    return res.json(parsedNotesData);
  } catch (err) {
    return res.status(500).json(err);
  }
});







// Catch-all route for HTTP GET requests that sends back index.html
app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'))
});

// Listen for requests and console log a message once the server is running
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);