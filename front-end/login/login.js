const loginButton = document.getElementById("login-btn");

// LOGIN
loginButton.addEventListener("click", async () => {
  const name = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Logged in as ${data.name}`);
      window.location.href = "/main/tasks.html"; 
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
  }
});