document.addEventListener("DOMContentLoaded", function () { 

    // Reference html elements to be used by the javascript,
    // Get them by ID
    // Into variables
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const updateTaskButton = document.getElementById("updateTask");
    const cancelUpdateButton = document.getElementById("cancelUpdate");
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

    // Updaqte the task list
    function updateTaskList(tasks) {
        // Clear the task list
        taskList.innerHTML = "";

        // Add tasks to the list

        /*
            We use forEach to iterate over the tasks,
            Then we take each task's content use it,
            To add to the ul in the html list,
            Each ListItem is appended with 2 buttons,
            Update and Delete buttons.

            OnClick the buttons will execute showUpdateModal and deleteTask functions.
        */
        tasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.textContent = task.text;
            listItem.classList.add("border-b-2", "border-gray-500","py-2");

            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.classList.add("ml-2", "text-white","bg-blue-500","p-1","rounded-lg");
            updateButton.onclick = function () {
                showUpdateModal(task.id); 
            };

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("ml-2", "text-white","bg-red-500","p-1","rounded-lg");
            deleteButton.onclick = function () {
                deleteTask(task.id);
            };

            listItem.appendChild(updateButton);
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        });
    }

    //This function adds a task to our list of tasks,
    //in the db.json file through thhe json server,
    //we take the task from the client via the html input
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

    // Pop up the update task window
    function showUpdateModal(taskId) {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            //The values are stored because they are going to be used by the updateTask function
            document.getElementById("updateTaskID").value = taskToUpdate.id;
            document.getElementById("updatedTaskText").value = taskToUpdate.text;
            updateModal.classList.remove("hidden"); // display it again
        }
    }

    function closeUpdateModal() {
        updateModal.classList.add("hidden"); // add hidden to the modal class list to close it
    }
    
    //Take taskID from the delete function and then find the task in tasks json file and delete it
    function deleteTask(taskId) {
        fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                loadTasks(); //reload tasks after deletion
            })
            .catch(error => {
                console.error("Error deleting task:", error);
            });
    }

    //Take taskID and new task text from the user input and use it to update the json
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


    // Assign the closeUpdateModal function to the click event of the "Cancel" button
    cancelUpdateButton.addEventListener("click", closeUpdateModal);

    // Load tasks when the page loads
    loadTasks();
});
