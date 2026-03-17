const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-task-button");
const taskList = document.getElementById("tasks-container");
const userSelect = document.getElementById("user-select");

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();

    userSelect.innerHTML = '<option value="">Select User</option>';

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      userSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
}

async function fetchTasks() {
  try {
    const response = await fetch("http://localhost:3000/tasks");
    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";

      const text = document.createElement("span");
      text.textContent = `${task.description} (User: ${task.username})`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        try {
          const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const data = await response.json();
            console.error("Server error:", data);
            alert("Failed to delete task");
            return;
          }

          fetchTasks();
        } catch (err) {
          console.error("Network error:", err);
        }
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", async () => {
        const newDescription = prompt("Enter new description:", task.description);
        if (!newDescription) return;

        try {
          const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: newDescription }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error("Server error:", data);
            alert("Failed to update task");
            return;
          }

          fetchTasks();
        } catch (err) {
          console.error("Network error:", err);
        }
      });

      taskItem.appendChild(text);
      taskItem.appendChild(editButton);
      taskItem.appendChild(deleteButton);
      taskList.appendChild(taskItem);
    });
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
}

addButton.addEventListener("click", async () => {
  const description = taskInput.value.trim();
  const userId = userSelect.value;

  if (!description) {
    alert("Please enter a task");
    return;
  }

  if (!userId) {
    alert("Please select a user");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        user_id: parseInt(userId),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error:", data);
      alert("Failed to add task");
      return;
    }

    taskInput.value = "";
    userSelect.value = "";
    fetchTasks();
  } catch (err) {
    console.error("Network error:", err);
  }
});

fetchUsers();
fetchTasks();