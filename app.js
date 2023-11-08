// Initial task data stored in JSON format
let tasks = [
    { id: 1, text: "Buy groceries" },
    { id: 2, text: "Complete homework" },
];

const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTask");
const taskInput = document.getElementById("task");

function renderTasks() {
    // Clear existing tasks
    taskList.innerHTML = "";

    // Render tasks from the JSON array
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.className = "mb-2";
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const newTask = { id: tasks.length + 1, text: taskText };
        tasks.push(newTask);
        taskInput.value = "";
        renderTasks();
    }
}

addTaskButton.addEventListener("click", addTask);

// Initial rendering of tasks
renderTasks();
