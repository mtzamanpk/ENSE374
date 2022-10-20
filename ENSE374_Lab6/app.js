const bodyParser = require('body-parser');
const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 

// a common localhost test port
const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});


app.post("/login", (req, res) => {
    var EmailInput =  req.body["email1"];
    var PasswordInput = req.body["pwd1"];

    
    const fs = require("fs");
    
    fs.readFile ( __dirname + "/public/login.json",
            "utf8", 
            ( err, jsonString ) => {
    if ( err ) {
        console.log("Error reading file from disk:", err);
        return;
    }
    try {
        const object = JSON.parse(jsonString);

        console.log("user1: " + EmailInput);
        console.log("pwd1: " + PasswordInput);
        console.log("User's name is:", object.email); 
        console.log("Password is:", object.password);

    if(EmailInput == object.email && PasswordInput == object.password)
    {
        console.log("Success!");
        res.redirect("/todo.html")
    }
    else{
        console.log("Failure")
        res.redirect("/")
    }
    } catch ( err ) {
        console.log("Error parsing JSON:", err);
    }
});
});