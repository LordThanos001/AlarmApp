document.addEventListener("DOMContentLoaded", () => {
  const userData = [];

  const sign = document.querySelector("#btn-sign");
  const openPopMessage = document.querySelector("#open");
  const path = document.querySelector("#path");
  const StudentForm = document.querySelector("#Studet-form");
  const popMsg = document.querySelector('#pop-msg')

  const name = document.querySelector("#username");
  const regNumber = document.querySelector("#regNumber");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  const loader = document.querySelector(".loader");
  const pageLoader = document.querySelector("[data-page-loader");

  const form = document.querySelector("#myform");

  if (!form) {
    console.log("form not found");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = {
      name: name.value,
      regNumber: regNumber.value,
      email: email.value,
      password: password.value,
    };

    userData.push(user);
    console.log(user);

    localStorage.setItem("user", JSON.stringify(userData));
  });

  sign.addEventListener("click", () => {
    console.log("pop message");
    openPopMessage.classList.add("show");
    StudentForm.classList.add("hide");
  });

  path.addEventListener("click", () => {
    console.log("path click");
    window.location = "http://127.0.0.1:5501/dashboard.html"

  });

  setTimeout(() => {
    console.log("Loaded");
    pageLoader.classList.add("hidden");
    popMsg.classList.add('show')
  }, 3000);


});
