const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-task-button");
const taskList = document.getElementById("tasks-container");

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
  if (!description) return;

  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, user_id: 5 }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error:", data);
      alert("Failed to add task");
      return;
    }

    taskInput.value = "";
    fetchTasks();
  } catch (err) {
    console.error("Network error:", err);
  }
});

fetchTasks();