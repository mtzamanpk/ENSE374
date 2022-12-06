const bodyParser = require('body-parser');
const e = require('express');
const express = require ( "express" );
const fs = require("fs");
// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 

// a common localhost test port
const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());

//read and save from json file
var userList = [];
var taskList = [];
var currentUser;

userList = JSON.parse(fs.readFileSync("users.json", "utf8"));
taskList = JSON.parse(fs.readFileSync("tasks.json", "utf8"));

app.get("/", (req, res) => {
    res.render(__dirname + "/views/index.ejs")
});
app.get("/todo", (req, res) => {
    res.render("todo", {username: currentUser, tasks: taskList.tasks})
});
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/logout", (req, res) => {
    res.redirect("/")
});

app.post("/login", (req, res) => {
userList = require('./users.json');
//console.log(req.body["email1"]);
//console.log(req.body["pwd1"]);
//console.log(userList.length);
for(var i = 0; i < userList.length; i++){
   
    if((req.body["email1"] === userList[i].username) && (req.body["pwd1"] === userList[i].password))
    {
        currentUser = req.body["email1"];
        res.redirect("/todo");
        console.log(userList[i].username);
        console.log("true");
        break;
    }
}
    res.redirect("/");
});

app.post("/register", (req, res) => {

    userList = require('./users.json');

    console.log(req.body["regEmail"]);
    console.log(req.body["regPwd"]);
    console.log(req.body["auth"]);

    const authentication = "todo2022"; 
    var newEmail = req.body["regEmail"];
    var newPwd =  req.body["regPwd"];
    var dupeCheck = false;
    var object = {username: newEmail, password: newPwd};
                  
    console.log("auth"); 
    for(var i = 0; i < userList.length; i++){

        if ((req.body["regEmail"] === userList[i].username)){
            dupeCheck = true; 
        }
            console.log(dupeCheck);
    }
    if(dupeCheck === false && req.body["auth"] === authentication){
        userList.push(object);
        writeUser(object, "/users.json");
        currentUser = req.body["regEmail"];
        res.redirect("/todo");
    }
    else{
        res.redirect("/");
    }
});

function writeUser(object, filename) {
    fs.writeFile ( __dirname + "/users.json", JSON.stringify( userList ),
        "utf8",( err ) => {
        if ( err ) {
        console.log( "Error writingthe file:", err );
        }
    });
}
function writeTask(object, filename) {
    fs.writeFile ( __dirname + "/tasks.json", JSON.stringify( taskList ),
        "utf8",( err ) => {
        if ( err ) {
        console.log( "Error writingthe file:", err );
        }
    });
}
function readJson(filename) {
    jsonString = fs.readFileSync ( __dirname + "/" + filename,
                 "utf8");
     const object = JSON.parse(jsonString);
     return object;
 }

 app.post("/addTask",(req,res)=>{
    taskList = readJson("./tasks.json");
    var taskLength = taskList.tasks.length;
    var addTask = req.body["listText"];
    taskLength++;
    taskList.tasks.push({"id": taskLength, "text": addTask, "state": "unclaimed", "creator": currentUser, "isTaskClaimed":false,"claimingUser":null,"isTaskDone":false,"isTaskCleared":false});
    console.log(taskList);
    currentUser = req.body.username;
    console.log(currentUser);
    writeTask(taskList, "tasks.json");
    res.redirect("/todo");
});

app.post("/claim",(req,res)=>{
    taskList = readJson("./tasks.json");
    var taskID = req.body.id
    console.log("claim task id: " + taskID);
    //console.log("the data type of task id is..."+typeof(taskID));
    var task = taskList.tasks.find(element => element._id === Number(taskID));
    console.log("we found the matching task: " + task);
    task.claimingUser = currentUser;
    task.isTaskClaimed = false; 
    task.state = "unfinished";
    taskList.tasks[taskID] = task;
    writeTask(taskList, "tasks.json");
    res.redirect("/todo");
});
/*
var taskID = req.body["id"];
    console.log(taskID);
    var task = taskList.tasks.find(task => task.id === taskID);
    task.claimingUser = currentUser;
    task.isTaskClaimed = false; 
    task.state = "unfinished";
    writeTask(taskList, "tasks.json");
    
*/
app.post("/abandon",(req,res)=>{
    taskList = readJson("./tasks.json");
    currentUser = req.body["username"];
    var taskID = req.body["id"];
    console.log(req.body["id"]);
    var task = taskList.tasks.find(task => task.id === taskID);
    console.log("task:" + task );
    task.claimingUser = currentUser;
    task.isTaskClaimed = false; 
    task.state = "unclaimed";
    writeTask(taskList, "tasks.json");
    res.redirect("/todo");
});