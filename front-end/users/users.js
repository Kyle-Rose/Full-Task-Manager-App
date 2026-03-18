const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const addUser = document.getElementById("add-user");
const fetchUser = document.getElementById("fetch-users");
const userList = document.getElementById("user-list");

fetchUser.addEventListener("click", () => {
    console.log("Fetching users...");

    fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((data) => {
            userList.innerHTML = "";

            data.forEach((user) => {
                const li = document.createElement("li");
                li.textContent = `${user.name} (${user.email})`;
                userList.appendChild(li);
            });
        })
        .catch((error) => console.error("Error fetching users:", error));
});

addUser.addEventListener("click", () => {
    const name = userName.value;
    const email = userEmail.value;

    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("User added:", data);
            userName.value = "";
            userEmail.value = "";
        })
        .catch((error) => console.error("Error adding user:", error));
});