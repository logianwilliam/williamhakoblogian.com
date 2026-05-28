const LOGIN_USER = "admin";
const LOGIN_PASSWORD = "password";
const SUCCESS_PAGE = "work.html";

const trigger = document.querySelector(".image-login-trigger");
const modal = document.querySelector("#login-modal");
const form = document.querySelector("#login-form");
const userInput = document.querySelector("#login-user");
const passwordInput = document.querySelector("#login-password");
const errorMessage = document.querySelector("#login-error");
const closeButtons = document.querySelectorAll("[data-close-login]");
const dragIgnoreSelector = "button, input, label";

let dragStartX = 0;
let dragStartY = 0;
let panelStartX = 0;
let panelStartY = 0;
let panelX = 0;
let panelY = 0;

function setPanelPosition(x, y) {
  const panelBox = form.getBoundingClientRect();
  const halfWidth = panelBox.width / 2;
  const halfHeight = panelBox.height / 2;
  const maxX = Math.max(0, window.innerWidth / 2 - halfWidth);
  const maxY = Math.max(0, window.innerHeight / 2 - halfHeight);

  panelX = Math.min(Math.max(x, -maxX), maxX);
  panelY = Math.min(Math.max(y, -maxY), maxY);
  form.style.transform = `translate(${panelX}px, ${panelY}px)`;
}

function openLogin() {
  modal.hidden = false;
  document.body.classList.add("is-login-open");
  errorMessage.textContent = "";
  setPanelPosition(0, 0);
  userInput.focus();
}

function closeLogin() {
  modal.hidden = true;
  document.body.classList.remove("is-login-open");
  form.reset();
  errorMessage.textContent = "";
  trigger.focus();
}

trigger.addEventListener("click", openLogin);

form.addEventListener("pointerdown", (event) => {
  if (event.target.closest(dragIgnoreSelector)) {
    return;
  }

  dragStartX = event.clientX;
  dragStartY = event.clientY;
  panelStartX = panelX;
  panelStartY = panelY;

  form.classList.add("is-dragging");
  form.setPointerCapture(event.pointerId);
});

form.addEventListener("pointermove", (event) => {
  if (!form.hasPointerCapture(event.pointerId)) {
    return;
  }

  setPanelPosition(
    panelStartX + event.clientX - dragStartX,
    panelStartY + event.clientY - dragStartY
  );
});

function stopDragging(event) {
  if (form.hasPointerCapture(event.pointerId)) {
    form.releasePointerCapture(event.pointerId);
  }

  form.classList.remove("is-dragging");
}

form.addEventListener("pointerup", stopDragging);
form.addEventListener("pointercancel", stopDragging);

closeButtons.forEach((button) => {
  button.addEventListener("click", closeLogin);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeLogin();
  }
});

window.addEventListener("resize", () => {
  if (!modal.hidden) {
    setPanelPosition(panelX, panelY);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = userInput.value.trim();
  const password = passwordInput.value;

  if (user === LOGIN_USER && password === LOGIN_PASSWORD) {
    window.location.href = SUCCESS_PAGE;
    return;
  }

  errorMessage.textContent = "wrong user or password";
  passwordInput.select();
});
