const bodyParser = require('body-parser');
const express = require ( "express" );
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();
// connects to the "test" database (ensure mongod is running!)
// the later arguments fix some deprecation warnings

var mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/todos')
.then(()=>console.log("DB Connected"))
.catch((err)=>console.log(err));

let ObjectId = mongoose.ObjectID;

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

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());

const userSchema = new mongoose.Schema ({
    username: String,
    password: String
});
//use the passport plugin
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

// 4. Add our strategy for using Passport, using the local user from MongoDB
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
    res.render(__dirname + "/views/index.ejs");
});
app.get("/todo", async(req, res) => {
    //res.render("todo", {username: currentUser, tasks: taskList.tasks})
    // render the view with our task collections
    //update the current user so that it utilizes passport authentication
    if(req.isAuthenticated()){
    try {
      const results = await Task.find();
      //console.log( results );
      res.render("todo", { username: req.user.username, tasks: results });
    } catch (error) {
      console.log(error);
    }}
    else{
        res.redirect("/");
    }
});
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/logout", (req, res) => {
    res.redirect("/");
});

app.post("/login", (req, res) => {
    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                res.redirect( "/todo" ); 
            });
        }
    });
// userList = require('./users.json');
// for(var i = 0; i < userList.length; i++){

//     if((req.body["email1"] === userList[i].username) && (req.body["pwd1"] === userList[i].password))
//     {
//         currentUser = req.body["email1"];
//         res.redirect("/todo");
//         console.log(userList[i].username);
//         console.log("true");
//         break;
//     }
// }
//     res.redirect("/");
});

app.post("/register", (req, res) => {
    if(req.body["auth"] === "todo2022"){
    console.log("User " + req.body.username + " is attempting to register");
    User.register(
      { username: req.body.username },
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/");
        } else {
          passport.authenticate("local")(req, res, () => {
            res.redirect("/todo");
          });
        }
      }
    );}
    else{
        res.redirect("/");
    }
});

//add task does not work properly and if you add a task it breaks somethings possibly 
 app.post("/addTask", async (req,res)=>{
    if(req.body.listText.trim().length > 0)
    {
            try {
                const taskx = new Task(
                    {text: req.body.listText, state: "unclaimed", Creator: req.user.username, isTaskClaimed: false, claimingUser: null, isTaskDone: false, isTaskCleared: false}
                );
                taskx.save();
                res.redirect("/todo");
            } catch (error) {
                console.log(error);
            }
    }
    else{
        res.redirect("/todo");  
    }
});

app.post("/claim", (req,res)=>{
    //we r going to get a task from our database
    //we will find a task based on the task id which will be rendered in the ejs file
    //we will update the task parameters such that it is displayed as claimed in the view
    let Id = req.body.id;
    console.log(Id);
    Task.findByIdAndUpdate(Id,{isTaskClaimed: true}, function(err, result){
        console.log(result);
        if(err){
            res.redirect('/todo')
        }
        else{
            res.redirect('/todo')
        }
        console.log(result);
    });
});

app.post("/abandon", async (req, res)=>{
    let Id = req.body.id;
    //check if the user hit the check button
    if(req.body.check === "on"){
    Task.findByIdAndUpdate(Id, { isTaskDone: true }, function (err, result) {
        console.log(result);
      if (err) {
        res.redirect("/todo");
      }
       else {
        res.redirect("/todo");
      }
    });}
    //if the abandon button is clicked
    else if(req.body.submitbutton === "on"){
        console.log("task has been abadoned");
        Task.findByIdAndUpdate(Id, { isTaskDone: false, isTaskClaimed: false }, function (err, result) {
          if (err) {
            res.redirect("/todo");
          } else {
            res.redirect("/todo");
          }
        });}
        else{
            res.redirect("/todo");
        }
});

app.post("/unfinish", async (req,res)=>{
    console.log("A task has been unfinished");
    //we r going to get a task from our database
    //we will find a task based on the task id which will be rendered in the ejs file
    //we will update the task parameters such that it is displayed as claimed in the view
    let Id = req.body.id;
    Task.findByIdAndUpdate(Id,{isTaskDone: false}, function(err, result){

        if(err){
            res.redirect('/todo')
        }
        else{
            res.redirect('/todo')
        }

    });
});
//purge does not work as intended
app.post("/purge", (req,res)=>{
    async function findInDatabase() {
        try {
            await Task.updateMany({ isTaskDone: true },
                { $set: { isTaskCleared: true } });

            res.redirect("/todo");
        } catch (error) {
            console.log(error);
        }
    }
    findInDatabase();
});

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

// User.register({ username: "user1" },  "1")
// User.register({ username: "user2" }, "2");
/*
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