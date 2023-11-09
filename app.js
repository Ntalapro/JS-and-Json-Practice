document.addEventListener("DOMContentLoaded", function () { 

    // Reference html elements to be used by the javascript,
    // Get them by ID
    // Into variables
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const updateTaskButton = document.getElementById("updateTask");
    const updateModal = document.getElementById("updateModal");

    let tasks = []; // Local copy of tasks

    // FIRST THING IS FIRST !
    // The endpoint "http://localhost:3001/tasks" stores our tasks
    // Load tasks from the JSON Server
    function loadTasks() {
        fetch("http://localhost:3001/tasks")
            .then(response => response.json())
            .then(data => {
                /*
                    Here we take data as it returns in json format,
                    Then update our tasks array with the data,
                    We then immediately update the tasks html list,
                    Filling it with the tasks array,
                    By executing the update function.
                */
                tasks = data; 
                updateTaskList(tasks);
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
            listItem.textContent = task.text;

            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.classList.add("ml-104", "text-blue-500");
            updateButton.onclick = function () {
                showUpdateModal(task.id);
            };

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("ml-2", "text-red-500");
            deleteButton.onclick = function () {
                deleteTask(task.id);
            };

            listItem.appendChild(updateButton);
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        });
    }

    function addTask() {
        const taskText = taskInput.value;
        if (taskText) {
            fetch("http://localhost:3001/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: taskText }),
            })
                .then(response => response.json())
                .then(data => {
                    loadTasks();
                    taskInput.value = "";
                })
                .catch(error => {
                    console.error("Error adding task:", error);
                });
        }
    }

    function showUpdateModal(taskId) {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            document.getElementById("updateTaskID").value = taskToUpdate.id;
            document.getElementById("updatedTaskText").value = taskToUpdate.text;
            updateModal.classList.remove("hidden");
        }
    }

    function closeUpdateModal() {
        updateModal.classList.add("hidden");
    }

    function deleteTask(taskId) {
        fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                loadTasks();
            })
            .catch(error => {
                console.error("Error deleting task:", error);
            });
    }

    function updateTask() {
        const taskId = document.getElementById("updateTaskID").value;
        const updatedTaskText = document.getElementById("updatedTaskText").value;

        fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: updatedTaskText }),
        })
            .then(response => response.json())
            .then(data => {
                loadTasks();
                closeUpdateModal();
            })
            .catch(error => {
                console.error("Error updating task:", error);
            });
    }

    // Assign the addTask function to the click event of the "Add" button
    addTaskButton.addEventListener("click", addTask);

    // Assign the updateTask function to the click event of the "Update" button
    updateTaskButton.addEventListener("click", updateTask);

    // Load tasks when the page loads
    loadTasks();
});
