const addTicketBtn = document.querySelector(".btn-add-ticket");
const modalWindow = document.querySelector(".input-ticket");
const body = document.querySelector("body");
const ticketForm = document.querySelector(".add-ticket-form");
const inp = document.querySelectorAll(".inp");
const list = document.querySelector(".tickets-list");
const deleteCrosses = document.querySelectorAll(".cross");
const URL = "http://localhost:7070";

addTicketBtn.addEventListener("click", () => {
  if (modalWindow.style.display === "none") {
    modalWindow.style.display = "inline";
    inp.forEach((el) => {
      el.value = "";
    });
  }
});

// Show modal view
body.addEventListener("click", (e) => {
  if (
    e.target &&
    Array.from(e.target.classList).includes("btn-close-input") &&
    modalWindow.style.display === "inline"
  ) {
    inp.forEach((el) => {
      el.value = "";
    });
    modalWindow.style.display = "none";
  }
});

// Creating ticket and sending to the server
ticketForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const bodys = new FormData(ticketForm);

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    const parsed = JSON.parse(xhr.responseText);
    console.log(parsed);
    const blank = document.createElement("div");
    blank.classList.add("ticket");
    blank.id = parsed[parsed.length - 1].id;
    const ticket = `
        <div class="circle todo"></div>
          <div class="text">${parsed[parsed.length - 1].name}</div>
          <div class="text time push">${parsed[parsed.length - 1].created}</div>
          <div class="circle rewrite">
            <div class="pen">&#9998;</div>
          </div>
          <div class="circle delete">
            <div class="cross">&#10006;</div>
          </div>
    `;
    blank.innerHTML = ticket;
    list.appendChild(blank);
  };

  xhr.open("POST", URL);

  xhr.send(bodys);

  modalWindow.style.display = "none";
});

// Activate and deactivation todo
body.addEventListener("click", (e) => {
  if (
    e.target &&
    Array.from(e.target.classList).includes("todo") &&
    e.target.childElementCount === 0
  ) {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", URL);
    xhr.send();
    xhr.onload = function () {
      if (xhr.status != 200) {
        alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
      } else {
        const parsed = JSON.parse(xhr.responseText);
        parsed.forEach((el) => {
          if (el.id === e.target.parentNode.id) {
            const check = document.createElement("div");
            check.classList.add("check");
            check.textContent = "✔";
            e.target.appendChild(check);
          }
        });
      }
    };
  }
  if (e.target.classList[0] === "check") {
    e.target.remove();
  }
});

// Show more ticket's info
body.addEventListener("click", (e) => {
  if (e.target && Array.from(e.target.classList).includes("ticket")) {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", URL + "?method=allTickets");
    xhr.send();
    xhr.onload = function () {
      if (xhr.status != 200) {
        alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
      } else {
        const tm = e.target.querySelector(".addition");
        if (tm) {
          tm.remove();
          return;
        }
        const parsed = JSON.parse(xhr.responseText);
        const text = e.target.querySelector(".text");
        text.classList.add("text-cont");
        const elem = document.createElement("div");
        elem.classList.add("text");
        elem.classList.add("addition");
        elem.textContent = parsed[parsed.length - 1].description;
        text.appendChild(elem);
      }
    };
  }
});

// body.addEventListener("click", (e) => {
//   if (e.target) {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     xhr.open("GET", URL + "?method=allTickets");
//     xhr.send();
//     xhr.onload = function () {
//       if (xhr.status != 200) {
//         alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
//       } else {
//         const tm = e.target.querySelector(".addition");
//         if (tm) {
//           tm.remove();
//           return;
//         }
//         const parsed = JSON.parse(xhr.responseText);
//         const text = e.target.querySelector(".text");
//         text.classList.add("text-cont");
//         const elem = document.createElement("div");
//         elem.classList.add("text");
//         elem.classList.add("addition");
//         elem.textContent = parsed[parsed.length - 1].description;
//         text.appendChild(elem);
//       }
//     };
//   }
// });
