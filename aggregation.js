// projects

var today = new Date().getDate();

projects.orders.aggregate( [
  // filter due date is today
  {
     $match: { tasks: { $exist: { due_date: { $eq: { today }}}}}
  },
] )



// tasks

tasks.orders.aggregate( [
  // filter due date is today
  {
     $match: { projects: { $exist: { due_date: { $eq: { today }}}}}
  },
] )
