const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
let notesData = require('./db/db.json')

const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err,data) => {
        if (err) {
            console.error(err);
          } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);
            res.send(parsedNotes);
          }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
app.get('/notes', (req, res) => {
      res.sendFile(path.join(__dirname, './public/notes.html'));
    });  

app.post('/api/notes', (req, res) => {
    const {title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            review_id: uuid()
        };

        fs.readFile('./db/db.json', 'utf8', (err,data) => {
            if (err) {
                console.error(err);
              } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);
        
                // Add a new note
                parsedNotes.push(newNote);
        
                // Write updated notes back to the file
                fs.writeFile(
                  './db/db.json',
                  JSON.stringify(parsedNotes, null, 4),
                  (writeErr) =>
                    writeErr
                      ? console.error(writeErr)
                      : console.info('Successfully updated notes!')
                );
                res.send();
              }
        });
    }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});