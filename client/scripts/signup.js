async function checkUser() {
  console.log("Checking user signup...");
  const response = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName: "Test User6", email: "patnamprudvi3@gmail.com", password: "password123"}),
  });

  const data = await response.json();
  console.log(data);
}

checkUser();