document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("search").addEventListener("input", renderTasks);
document.getElementById("filter").addEventListener("change", renderTasks);
document.getElementById("exportBtn").addEventListener("click", exportData);
document.getElementById("importInput").addEventListener("change", importData);

function addTask() {
    const title = document.getElementById("title").value.trim();
    if (!title) return alert("Title required");

    const task = {
        id: Date.now(),
        title,
        notes: document.getElementById("notes").value,
        dueDate: document.getElementById("dueDate").value,
        priority: document.getElementById("priority").value,
        repeat: document.getElementById("repeat").value,
        completed: false,
        createdAt: new Date()
    };

    saveTask(task);
    renderTasks();
}

function renderTasks() {
    getAllTasks(tasks => {

        const list = document.getElementById("taskList");
        list.innerHTML = "";

        const search = document.getElementById("search").value.toLowerCase();
        const filter = document.getElementById("filter").value;

        tasks = tasks.filter(t => t.title.toLowerCase().includes(search));

        if (filter === "pending")
            tasks = tasks.filter(t => !t.completed);

        if (filter === "completed")
            tasks = tasks.filter(t => t.completed);

        if (filter === "overdue")
            tasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());

        tasks.sort((a,b)=>new Date(a.dueDate||0)-new Date(b.dueDate||0));

        tasks.forEach(task => {

            const div = document.createElement("div");
            div.className = `task ${task.priority} ${task.completed ? "completed":""}`;

            div.innerHTML = `
                <strong>${task.title}</strong>
                <div>${task.notes || ""}</div>
                <div>${task.dueDate ? new Date(task.dueDate).toLocaleString() : ""}</div>
                <button onclick="toggleComplete(${task.id})">✔</button>
                <button onclick="deleteTaskHandler(${task.id})">🗑</button>
            `;

            list.appendChild(div);
        });

        updateProgress(tasks);
    });
}

function toggleComplete(id) {
    getAllTasks(tasks => {
        const task = tasks.find(t=>t.id===id);
        task.completed = !task.completed;
        saveTask(task);
        renderTasks();
    });
}

function deleteTaskHandler(id) {
    deleteTask(id);
    renderTasks();
}

function updateProgress(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t=>t.completed).length;
    const percent = total ? (completed/total)*100 : 0;
    document.getElementById("progress").style.width = percent+"%";
}

function exportData() {
    getAllTasks(tasks=>{
        const blob = new Blob([JSON.stringify(tasks)], {type:"application/json"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tasks.json";
        a.click();
    });
}

function importData(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=> {
        const tasks = JSON.parse(reader.result);
        tasks.forEach(saveTask);
        renderTasks();
    };
    reader.readAsText(file);
}

renderTasks();