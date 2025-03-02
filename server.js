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
app.use(cookieParser());
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
   host: process.env.MYSQLHOST || 'mysql.railway.internal',  // Use Railway's MySQL host
  user: process.env.MYSQLUSER || 'root',  // Use Railway's MySQL user
  password: process.env.MYSQLPASSWORD  || "fkbmBDcRydklWBOhboqEYGFbuIrNIzrp",  // Use Railway's MySQL password
  database: process.env.MYSQLDATABASE || 'railway',  // Use Railway's MySQL database
  port: process.env.MYSQLPORT || 3306,
  MYSQL_URI:'mysql://root:fkbmBDcRydklWBOhboqEYGFbuIrNIzrp@nozomi.proxy.rlwy.net:27314/railway'

});
   
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Sample Express API Route
app.get('/', (req, res) => {    
    db.query('SELECT * FROM mydb where status=1', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.render("index", { users: results }); // Pass the users array to the template
        }
    });
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
    var s=[];
   db.query('Select  * from  mydb where   email =? ', [ email], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else{
        
        s=result;
        console.log(s)

    }
    
    if(s.length ==0){



    db.query('INSERT INTO mydb (username, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.redirect("/login");

        }   
    });

}else{  

    res.status(400).render("index2", { error: "Something went wrong!" });

}
});
});
app.post('/login', (req, res) => {
    const { name, email, password } = req.body;
    
    db.query('Select * from mydb where email =? and password= ?', [ email, password], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else{

console.log(result);
            if(result.length ==0){
                res.redirect("/login");
            }else{
                res.cookie("username", email)
                res.redirect("/"); // Sets a simple cookie
            }

            db.query('Update  mydb set status = 1 where email=? ', [ email], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
               
                } else {
                }
            });

        }
    });

        
    
});


    

io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    // Listen for messages from the client
    socket.on('message', (message) => {
        console.log('Received message:', message);

        // Broadcast message to all connected clients
        io.emit('receiveMessage', message);
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    }); 
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.get('/login', (req, res) => {
    res.render("index3");
if (req.cookies.username) {
} else {
    res.redirect("/login");
}
    }); 

