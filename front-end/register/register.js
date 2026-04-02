const registerButton = document.getElementById("register-btn");

// REGISTER
registerButton.addEventListener("click", async () => {
  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

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