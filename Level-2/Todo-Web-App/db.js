const DB_NAME = "TaskFlowDB";
const STORE = "tasks";

let db;

function initDB() {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = e => {
        db = e.target.result;
        db.createObjectStore(STORE, { keyPath: "id" });
    };

    request.onsuccess = e => db = e.target.result;
}

function saveTask(task) {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(task);
}

function getAllTasks(callback) {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => callback(req.result);
}

function deleteTask(id) {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
}

initDB();