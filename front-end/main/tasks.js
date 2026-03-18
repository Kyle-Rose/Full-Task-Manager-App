const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-task-button");
const taskList = document.getElementById("tasks-container");

async function fetchTasks() {
  try {
    const res = await fetch("http://localhost:3000/tasks", {
      credentials: "include",
    });

    if (res.status === 401) {
      alert("You must log in first");
      window.location.href = "/front-end/login/login.html";
      return;
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Error fetching tasks:", err);
      return;
    }

    const tasks = await res.json();
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";

      const text = document.createElement("span");
      text.textContent = task.description;

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", async () => {
        const newDescription = prompt("Edit task:", task.description);
        if (!newDescription) return;

        try {
          const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: newDescription }),
          });

          if (!res.ok) {
            const data = await res.json();
            console.error("Edit error:", data);
            alert("Failed to update task");
            return;
          }

          fetchTasks();
        } catch (err) {
          console.error("Network error:", err);
        }
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        try {
          const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          if (!res.ok) {
            const data = await res.json();
            console.error("Delete error:", data);
            alert("Failed to delete task");
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
    console.error("Fetch failed:", err);
  }
}

addButton.addEventListener("click", async () => {
  const description = taskInput.value.trim();

  if (!description) {
    alert("Please enter a task");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    if (res.status === 401) {
      alert("You must log in first");
      window.location.href = "/front-end/login/login.html";
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      console.error("Add error:", data);
      alert(data.error || "Failed to add task");
      return;
    }

    taskInput.value = "";
    fetchTasks();
  } catch (err) {
    console.error("Network error:", err);
  }
});

fetchTasks();