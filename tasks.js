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

// create a task
async function Create (client) {
  var now = new Date();
  // default data structure for a new task
  await client.db("todoList").collection("tasks").insertOne({
    name: "test",
    status: "to-do",
    start_date: now,
    due_date: now.setDate(now.getDate() + 7),
    done_date: ""
  });
}

// list all tasks
async function List (client) {
  tasks_db = await client.db("todoList").collection("tasks").find();
  // change type to array for display onto the terminal
  const tasks = await tasks_db.toArray();
  console.log(tasks);
  if (tasks.length > 0){
    tasks.forEach((task) => {
      console.log(`${task.name} - status: ${task.status} | start date: ${task.start_date} | due date: ${task.due_date} | done date: ${task.done_date}`);
    });
  }
}

// edit a task
async function Edit (client){
  await client.db("todoList").collection("tasks").updateOne({name: "test"}, {$set: { name: "new name" }});
}

// delete a task
async function Delete (client){
  await client.db("todoList").collection("tasks").deleteOne({name: "test"});
}

// mark a task as done
async function MarkDone (client){
  await client.db("todoList").collection("tasks").updateOne({name: "test"}, {$set: { status: "done", done_date: new Date() }});
}

// mark a task as to-do
async function MarkToDo (client){
  var now = new Date();
  await client.db("todoList").collection("tasks").updateOne({name: "test"}, {$set: { status: "to-do", start_date: now, due_date: now.setDate(now.getDate() + 7), done_date: "" }});
}

// filter tasks by status - done
async function FilterDone (client){
  await client.db("todoList").collection("tasks").find({status: { $eq: "done"}});
}

// filter tasks by status - to-do
async function FilterToDo (client){
  await client.db("todoList").collection("tasks").find({status: { $eq: "to-do"}});
}

//search tasks by name
async function Search (client){
  await client.db("todoList").collection("tasks").find({name: "test"});
}

//sort tasks by start date
async function SortStartDate (client){
  await client.db("todoList").collection("tasks").find().sort({start_date: 1});
}

//sort tasks by due date
async function SortDueDate (client){
  await client.db("todoList").collection("tasks").find().sort({due_date: 1});
}

//sort tasks by done date
async function SortDoneDate (client){
  await client.db("todoList").collection("tasks").find().sort({done_date: 1});
}

// ------------------------------------------------------------------------------
// ROUTES SECTION
// root - prompt a welcome message
app.get('/tasks/', (req, res) => {
  res.send("This is the root");
});

// create - create a task
app.get('/tasks/create', (req, res) => {
  res.send("This is a create task page");
  Connection(Create).catch(console.error);
});

// list - list all tasks
app.get('/tasks/list', (req, res) => {
  res.send("This is a list all tasks page");
  Connection(List).catch(console.error);
});

// edit - edit a task
app.get('/tasks/edit', (req, res) => {
  res.send("This is a edit task page");
  Connection(Edit).catch(console.error);
});

// delete - delete a task
app.get('/tasks/delete', (req, res) => {
  res.send("This is a delete task page");
  Connection(Delete).catch(console.error);
});

// mark - mark a task as to-do/done
app.get('/tasks/mark/done', (req, res) => {
  res.send("This is a mark a task (done) page");
  Connection(MarkDone).catch(console.error);
});

app.get('/tasks/mark/to-do', (req, res) => {
  res.send("This is a mark a task (to-do) page");
  Connection(MarkToDo).catch(console.error);
});

// filter - filter tasks by status (to-do / done)
app.get('/tasks/filter/done', (req, res) => {
  res.send("This is a filter tasks (done) page");
  Connection(FilterDone).catch(console.error);
});

app.get('/tasks/filter/to-do', (req, res) => {
  res.send("This is a filter tasks (to-do) page");
  Connection(FilterToDo).catch(console.error);
});

// search - search tasks by name
app.get('/tasks/search', (req, res) => {
  res.send("This is a search tasks page");
  Connection(Search).catch(console.error);
});

// sort/start_date - sort tasks by start date
app.get('/tasks/sort/start_date', (req, res) => {
  res.send("This is a sort start date page");
  Connection(SortStartDate).catch(console.error);
});

// sort/due_date - sort tasks by due date
app.get('/tasks/sort/due_date', (req, res) => {
  res.send("This is a sort due date page");
  Connection(SortDueDate).catch(console.error);
});

// sort/done_date - sort tasks by done date
app.get('/tasks/sort/done_date', (req, res) => {
  res.send("This is a sort done date page");
  Connection(SortDoneDate).catch(console.error);
});

// ------------------------------------------------------------------------------
// PORT LISTENING SECTION
app.listen(port, ()=> {
  console.log(`Server start at port ${port}`);
});