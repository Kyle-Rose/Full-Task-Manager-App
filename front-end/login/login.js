const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");

// REGISTER
registerButton.addEventListener("click", async () => {
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  try {
    const res = await fetch("/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(res.ok ? "Registered! Now log in" : data.error);
  } catch (err) {
    console.error(err);
  }
});

// LOGIN
loginButton.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const res = await fetch("/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Logged in as ${data.name}`);
      window.location.href = "/front-end/main/tasks.html";
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
  }
});