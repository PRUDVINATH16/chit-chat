import doFetch from "./do_fetch.js";

document.addEventListener('DOMContentLoaded', async () => {

  async function checkAuth() {
    let res = await doFetch('auth/check');
    if(res.ok == false) {
      location.href='login.html';
    } else {
      return;
    }
  }
  checkAuth();

});