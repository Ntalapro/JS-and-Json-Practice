document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    const taskID = document.getElementById("taskID");
    const taskText = document.getElementById("taskText");
    const updateTaskButton = document.getElementById("updateTask");

    // Load tasks from the JSON Server
    function loadTasks() {
        fetch("http://localhost:3001/tasks")
            .then(response => response.json())
            .then(data => {
                updateTaskList(data);
            })
            .catch(error => {
                console.error("Error loading tasks:", error);
            });
    }

    
    function updateTaskList(tasks) {
        // Clear the task list
        taskList.innerHTML = "";

        // Add tasks to the list
        tasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.appendChild(document.createTextNode(task.text));
            listItem.style.display("flex-direction: row");
            var button = document.createElement("button");
            button.innerHTML = "Delete";
        
            listItem.appendChild(button);
            //listItem.textContent = task.text;
            taskList.appendChild(listItem);

            // button.innerHTML = "asdasd";
            // li.appendChild(button);
            // li.setAttribute("id","element4");
            // ul.appendChild(li);
            // alert(li.id);
        });
    }

    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value;
        if (taskText) {
            // Add the new task to the JSON Server
            fetch("http://localhost:3001/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: taskText }),
            })
                .then(response => response.json())
                .then(data => {
                    // Load tasks after adding a new task
                    loadTasks();
                    taskInput.value = "";
                })
                .catch(error => {
                    console.error("Error adding task:", error);
                });
        }
    });

    // Load tasks when the page loads
    loadTasks();
});
