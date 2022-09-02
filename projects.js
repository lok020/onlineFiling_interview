// SETUP
const {MongoClient} = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// ------------------------------------------------------------------------------
// ASYNC FUNCTION SECTION
// control connection flow, take a function as a props and excute if connect successful
async function Connection (func) {
  // const url = "mongodb+srv://temp_user:123@todolist.khgxltm.mongodb.net/?retryWrites=true&w=majority";
  const url = "mongodb://localhost:27017"
  const client = new MongoClient(url);

  try {
    // connect the cluster
    await client.connect();
    console.log("connect successful");
    await func(client);
  } catch (e) {
    // print out the error
    console.log("ERROR", e);
  } finally {
    // close out the connection after process are done
    await client.close();
    console.log("disconnect successful");
  }
}

// create a project
async function Create (client) {
  var now = new Date();
  // default data structure for the projects
  await client.db("todoList").collection("projects").insertOne({
    name: "test",
    tasks: [],
    start_date: now,
    due_date: now.setDate(now.getDate() + 7)
  });
}

// list all projects
async function List (client) {
  projects_db = await client.db("todoList").collection("projects").find();
  const projects = await projects_db.toArray();
  console.log(projects);
  if (projects.length > 0){
    projects.forEach((project) => {
      console.log(`${project.name} - tasks: ${project.tasks}`);
    });
  }
}

// edit a project
async function Edit (client){
  await client.db("todoList").collection("projects").updateOne({name: "test"}, {$set: { name: "new project" }});
}

// delete a project
async function Delete (client){
  await client.db("todoList").collection("projects").deleteOne({name: "test"});
}

// assign task(s) to a project
async function Assign (client) {
  tasks_db = await client.db("todoList").collection("tasks").find({name: "test"});
  const tasks = await tasks_db.toArray();
  projects_db = await client.db("todoList").collection("projects").find({name: "test"});
  // loop through all the tasks to check if it's existed in the list
  for (let i in tasks){
    // if the task is not exist in the project tasks list, add
    if (!projects_db.tasks.includes(tasks[i])){
      projects_db.tasks.push(tasks[i])
    }
  }
  await client.db("todoList").collection("projects").updateOne({name: "test"}, {$set: { tasks: projects_db.tasks }});
}

// filter task(s) by project name
async function Filter (client){
  await client.db("todoList").collection("projects").find({name: "test"}, {tasks: 1});
}

//sort projects by start date
async function SortStartDate (client){
  await client.db("todoList").collection("projects").find().sort({start_date: 1});
}

//sort projects by due date
async function SortDueDate (client){
  await client.db("todoList").collection("projects").find().sort({due_date: 1});
}

// ------------------------------------------------------------------------------
// ROUTES SECTION
// root - prompt a welcome message
app.get('/projects/', (req, res) => {
  res.send("This is the root");
});

// create - create a project
app.get('/projects/create', (req, res) => {
  res.send("This is a create project page");
  Connection(Create).catch(console.error);
});

// list - list all projects
app.get('/projects/list', (req, res) => {
  res.send("This is a list all projects page");
  Connection(List).catch(console.error);
});

// edit - edit a project
app.get('/projects/edit', (req, res) => {
  res.send("This is a edit project page");
  Connection(Edit).catch(console.error);
});

// delete - delete a project
app.get('/projects/delete', (req, res) => {
  res.send("This is a delete project page");
  Connection(Delete).catch(console.error);
});

// assign - assign task(s) to a project
app.get('/projects/assign', (req, res) => {
  res.send("This is a assign task(s) into project page");
  Connection(Assign).catch(console.error);
});

// filter - filter task(s) by project name
app.get('/projects/filter', (req, res) => {
  res.send("This is a filter projects page");
  Connection(Filter).catch(console.error);
});

// sort - sort projects by start date
app.get('/projects/sort/start_date', (req, res) => {
  res.send("This is a sort start date page");
  Connection(SortStartDate).catch(console.error);
});

// sort - sort projects by due date
app.get('/projects/sort/due_date', (req, res) => {
  res.send("This is a sort due date page");
  Connection(SortDueDate).catch(console.error);
});

// ------------------------------------------------------------------------------
// PORT LISTENING SECTION
app.listen(port, ()=> {
  console.log(`Server start at port ${port}`);
});