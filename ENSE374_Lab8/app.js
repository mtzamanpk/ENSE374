const bodyParser = require('body-parser');
const express = require ( "express" );
// connects to the "test" database (ensure mongod is running!)
// the later arguments fix some deprecation warnings

var mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/todos')
.then(()=>console.log("DB Connected"))
.catch((err)=>console.log(err));



const fs = require("fs");
// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// Bring in mongoose

// a common localhost test port
const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://0.0.0.0:${port}`);
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
    res.render(__dirname + "/views/index.ejs");
});
app.get("/todo", async(req, res) => {
    //res.render("todo", {username: currentUser, tasks: taskList.tasks})
    // render the view with our task collections
    //updste the current user so that it utilizes passport authentication
    try {
        const results = await Task.find();
        console.log( results );
        res.render("todo", {username: currentUser, tasks: results})
    } catch ( error ) {
        console.log( error );
    }
});
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/logout", (req, res) => {
    res.redirect("/");
});

app.post("/login", (req, res) => {
userList = require('./users.json');
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
        const user = new User ({
            username: newEmail,
            password: newPwd
        })
        user.save();
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
    //we r going to get from our database
    //we will find a task based on the task id which will be rendered in the ejs file 
    //we will update the task parameters such that it is displayed as claimed in the view
    
    // taskList = readJson("./tasks.json");
    // var taskID = req.body.id;
    // console.log("claim task id: " + taskID);
    // //console.log("the data type of task id is..."+typeof(taskID));
    // var task = taskList.tasks.find(element => element._id === Number(taskID));
    // console.log("we found the matching task: " + task);
    // task.claimingUser = currentUser;
    // task.isTaskClaimed = false; 
    // task.state = "unfinished";
    // taskList.tasks[taskID] = task;
    // writeTask(taskList, "tasks.json");
    // res.redirect("/todo");
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


const userSchema = new mongoose.Schema ({
    username: String,
    password: String
});
const User = mongoose.model ("User", userSchema);
const taskSchema = new mongoose.Schema ({
    text: String,
    state: String,
    creator: String,
    isTaskClaimed: Boolean,
    claimingUser: String,
    isTaskDone: Boolean,
    isTaskCleared: Boolean
});
const Task = mongoose.model ("Task", taskSchema);


/*const user1 = new User({
    username: "1",
    password: "1"
})
user1.save();
const user2 = new User({
    username: "2",
    password: "2"
})
user2.save();
const task1 = new Task({
    
    text:"unclaimed task",
    state: "unclaimed",
    creator: "user1",
    isTaskClaimed: false,
    claimingUser: null,
    isTaskDone: false,
    isTaskCleared: false,
})
task1.save();
const task2 = new Task({

    text: "claimed by user1 and unfinished",
    state: "unfinished",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user1",
    isTaskDone: false,
    isTaskCleared: false,
});
task2.save();
const task3 = new Task({

    text: "claimed by user2 and unfinished",
    state: "unfinished",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user2",
    isTaskDone: false,
    isTaskCleared: false,
});
task3.save();
const task4 = new Task({

    text: "claimed by user1 and finished",
    state: "finished",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user1",
    isTaskDone: true,
    isTaskCleared: false,
});
task4.save();
const task5 = new Task({

    text: "claimed by user2 and finished",
    state: "finished",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user2",
    isTaskDone: true,
    isTaskCleared: false,
});
task5.save();*/