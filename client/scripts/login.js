import doFetch from "./do_fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector('.goto-signup').addEventListener('click', () => {
    location.href = 'signup.html';
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
    let email = document.querySelector('.email-input').value.trim();
    let password = document.querySelector('.password-input').value.trim();
    if (email != '' && password != '') {
      let res = await doFetch('auth/login', 'POST', { email, password });
      if (res.ok != false) {
        location.href = "index.html";
      } else {
        errorMessage();
      }
    } else {
      errorMessage();
    }

    function errorMessage() {
      document.querySelector('.message').textContent = 'Failed To Send! may be invalid credentials...';

      setTimeout(() => {
        document.querySelector('.message').textContent = '';
      }, 2000);
    }
  }

  document.querySelector('.login-button').addEventListener('click', sendData);
});