const users = localStorage.getItem("user");

const userMenu = document.querySelector(".user-menu");

const data = JSON.parse(users);
console.log(data);

data.forEach((value) => {
  const details = document.createElement("div");
  console.log(value.name);

  details.innerHTML = `
        <span>${value.name}</span>
        <span>${value.regNumber}</span>
        <span>${value.email}</span>
    `;

    userMenu.appendChild(details);
});
