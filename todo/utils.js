function saveTasks(tasks) {
  localStorage.setItem("proTasks", JSON.stringify(tasks));
}

function loadTasks() {
  return JSON.parse(localStorage.getItem("proTasks")) || [];
}

function calculateNextRecurring(task) {
  let date = new Date(task.dueDate);

  if (task.recurring === "daily")
    date.setDate(date.getDate() + 1);

  if (task.recurring === "weekly")
    date.setDate(date.getDate() + 7);

  if (task.recurring === "monthly")
    date.setMonth(date.getMonth() + 1);

  return date.toISOString().slice(0,16);
}