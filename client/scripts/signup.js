import doFetch from "./do_fetch.js";

async function checkUser() {
  console.log("Checking user signup...");
  /* const response = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName: "Nagur Lalush", email: "nagurlalush@gmail.com", password: "password123"}), 
  }); */

  const req = await doFetch("auth/signup", "POST", { fullName: "Nagur Lalush", email: "nagurlalush@gmail.com", password: "password123"});
}

//checkUser();