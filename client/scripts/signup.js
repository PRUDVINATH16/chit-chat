import doFetch from "./do_fetch.js";

async function nmm() {
  const req = await doFetch("auth/signup", "POST", { fullName: "Nagur Lalush", email: "nagurlalush@gmail.com", password: "password123" });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.goto-login').addEventListener('click', () => {
    location.href = 'login.html';
  });

  async function checkAuth() {
    let res = await doFetch('auth/check');
    if (res.ok != false) {
      location.href = 'index.html';
    } else {
      return;
    }
  }
  checkAuth();

  async function sendData(event) {
    event.preventDefault();

    let fullName = document.querySelector('.full-name').value.trim();
    let email = document.querySelector('.email').value.trim();
    let password = document.querySelector('.password').value.trim();

    if (fullName != '' && email != '' && password != '') {
      let res = await doFetch('auth/signup', 'POST', { fullName, email, password });
      console.log(res)
      if(res.ok != false) {
        location.href="index.html";
      } else {
        errorMessage(res.message);
      }
    } else {
      errorMessage("Please fill the all fields!");
    }

    function errorMessage(message='Failed to send! try again...') {
      document.querySelector('.message').textContent = message;

      setTimeout(() => {
        document.querySelector('.message').textContent = '';
      }, 2000);
    }
  }

  document.querySelector('.signup-button').addEventListener('click', sendData);
});