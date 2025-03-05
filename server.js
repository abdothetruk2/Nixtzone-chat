const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cookie = require("cookie");
const app = express();
const PORT = 80;
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded data

app.get("/set-cookie", (req, res) => {
    res.cookie("username", "JohnDoe"); // Sets a simple cookie
    res.send("Cookie has been set!");
});

// Create an HTTP server
const server = http.createServer(app);
app.set("view engine", "ejs");
app.use(express.static('public'));

const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (modify for production)
        methods: ['GET', 'POST']
    }
});

// MySQL Connection
const db = mysql.createConnection({
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'jDHdPHfMgwmBzZZkusbhShoSQvPOeVKj', // Change this to your actual MySQL password
    database: 'railway'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Sample Express API Route
io.on('connection', socket => {
    socket.on('message', (data) => {
        // Broadcast message to all connected clients
        io.emit('receiveMessage', { message: data.message, email: data.email });
    });
    


db.query('SELECT * FROM mydb where status=1', (err, results) => {   

    if (err) {
        socket.emit('users', { error: err.message });
    } else {
        socket.broadcast.emit('users', results);
    }
});
    // Disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
    
app.get('/', (req, res) => {
    if (req.cookies.username) {
        db.query('SELECT * FROM mydb where status=1', (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res      .render("index", { users: results }); // Pass the users array to the template
            }
        })
    } else {
        res.render("index3");
    }
});

app.get('/users', (req, res) => {
    db.query('SELECT * FROM mydb', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.render("index2", { users: results }); // Pass the users array to the template
        }
    });
});

app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    db.query('SELECT * FROM mydb WHERE email = ?', [email], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.length === 0) {
            db.query('INSERT INTO mydb (username, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.redirect("/login");
                }
            });
        } else {
            res.status(400).render("index2", { error: "Something went wrong!" });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM mydb WHERE email = ? AND password = ?', [email, password], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.length === 0) {
            res.redirect("/login");
        } else {
            res.cookie("username", email);
            db.query('UPDATE mydb SET status = 1 WHERE email = ?', [email], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.redirect("/");
                }
            });
        }
    });
});

app.get('/login', (req, res) => {
    if (req.cookies.username) {
        res.redirect("/");
    } else {
        res.render("index3");
    }
});

app.get('/logout', (req, res) => {
    db.query('UPDATE mydb SET status = 0 WHERE email = ?', [req.cookies.username], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.clearCookie("username");
            res.redirect("/login");
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
