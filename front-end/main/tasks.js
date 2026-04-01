const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-task-button");
const taskList = document.getElementById("tasks-container");
const logoutButton = document.getElementById("logout");

// LOGOUT
logoutButton.addEventListener("click", async () => {
  try {
    const res = await fetch("/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Failed to log out");
      return;
    }

    window.location.href = "/login/login.html";
  } catch (err) {
    console.error("Network error:", err);
  }
});

// FETCH TASKS
async function fetchTasks() {
  try {
    const res = await fetch("/tasks", { credentials: "include" });

    if (res.status === 401) {
      alert("You must log in first");
      window.location.href = "/login/login.html";
      return;
    }

    if (!res.ok) {
      console.error("Error fetching tasks");
      return;
    }

    const tasks = await res.json();
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";

      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed; // ✅ Set initial state

      const text = document.createElement("span");
      text.textContent = task.description;
      if (task.completed) {
        text.style.textDecoration = "line-through";
        text.style.color = "#888";
      }

      // CHECKBOX TOGGLE + SAVE TO BACKEND
      checkbox.addEventListener("change", async () => {
        try {
          const res = await fetch(`/tasks/${task.id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: checkbox.checked }),
          });

          if (!res.ok) {
            alert("Failed to update task");
            return;
          }

          // Update style instantly
          if (checkbox.checked) {
            text.style.textDecoration = "line-through";
            text.style.color = "#888";
          } else {
            text.style.textDecoration = "none";
            text.style.color = "#000";
          }
        } catch (err) {
          console.error("Network error:", err);
        }
      });

      label.appendChild(checkbox);
      label.appendChild(text);

      // EDIT
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", async () => {
        const newDescription = prompt("Edit task:", task.description);
        if (!newDescription) return;

        try {
          const res = await fetch(`/tasks/${task.id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: newDescription }),
          });

          if (!res.ok) {
            alert("Failed to update task");
            return;
          }

          fetchTasks();
        } catch (err) {
          console.error("Network error:", err);
        }
      });

      // DELETE
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        try {
          const res = await fetch(`/tasks/${task.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          if (!res.ok) {
            alert("Failed to delete task");
            return;
          }

          fetchTasks();
        } catch (err) {
          console.error("Network error:", err);
        }
      });

      taskItem.appendChild(label);
      taskItem.appendChild(editButton);
      taskItem.appendChild(deleteButton);

      taskList.appendChild(taskItem);
    });
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

// ADD TASK
addButton.addEventListener("click", async () => {
  const description = taskInput.value.trim();
  if (!description) {
    alert("Please enter a task");
    return;
  }

  try {
    const res = await fetch("/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    if (res.status === 401) {
      alert("You must log in first");
      window.location.href = "/login/login.html";
      return;
    }

    if (!res.ok) {
      alert("Failed to add task");
      return;
    }

    taskInput.value = "";
    fetchTasks();
  } catch (err) {
    console.error("Network error:", err);
  }
});

// ENTER KEY SUPPORT
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addButton.click();
});

// INITIAL LOAD
fetchTasks();