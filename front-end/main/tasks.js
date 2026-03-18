const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const addButton = document.getElementById("add-task-button");

const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("tasks-container");
const tasksSection = document.getElementById("tasks-section");

registerButton.addEventListener("click", async () => {
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  const res = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  alert(res.ok ? "Registered! Now log in" : data.error);
});

loginButton.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const res = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    alert(`Logged in as ${data.name}`);
    tasksSection.style.display = "block";
    fetchTasks();
  } else {
    alert(data.error);
  }
});

async function fetchTasks() {
  try {
    const res = await fetch("http://localhost:3000/tasks", { credentials: "include" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Failed to fetch tasks:", data);
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
        const newDescription = prompt("Enter new description:", task.description);
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
            console.error("Failed to update task:", data);
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
            console.error("Failed to delete task:", data);
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
    console.error("Failed to fetch tasks:", err);
  }
}

addButton.addEventListener("click", async () => {
  const description = taskInput.value.trim();
  if (!description) return alert("Enter a task");

  try {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to add task:", data);
      alert(data.error);
      return;
    }

    taskInput.value = "";
    fetchTasks();
  } catch (err) {
    console.error("Network error:", err);
  }
});

tasksSection.style.display = "none";