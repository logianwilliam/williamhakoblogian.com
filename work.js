const viewer = document.querySelector(".contact-sheet-viewer");
const sheet = document.querySelector(".contact-sheet");
const magnifier = document.querySelector(".magnifier");
const magnifierZoom = document.querySelector(".magnifier__zoom");

const zoom = 1.8;
const loupeNaturalSize = 600;
const glassCenterX = 140;
const glassCenterY = 185;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function moveMagnifier(clientX, clientY) {
  const viewerBox = viewer.getBoundingClientRect();
  const sheetBox = sheet.getBoundingClientRect();
  const lensBox = magnifier.getBoundingClientRect();
  const scale = lensBox.width / loupeNaturalSize;
  const cursorOffsetX = glassCenterX * scale;
  const cursorOffsetY = glassCenterY * scale;

  const x = clientX - viewerBox.left;
  const y = clientY - viewerBox.top;
  const lensX = x - cursorOffsetX;
  const lensY = y - cursorOffsetY;

  const imageX = clamp(clientX - sheetBox.left, 0, sheetBox.width);
  const imageY = clamp(clientY - sheetBox.top, 0, sheetBox.height);

  magnifier.style.left = `${lensX}px`;
  magnifier.style.top = `${lensY}px`;

  const zoomBox = magnifierZoom.getBoundingClientRect();
  const glassCenterInZoomX = clientX - zoomBox.left;
  const glassCenterInZoomY = clientY - zoomBox.top;

  magnifierZoom.style.backgroundImage = `url("${sheet.currentSrc || sheet.src}")`;
  magnifierZoom.style.backgroundSize = `${sheetBox.width * zoom}px ${sheetBox.height * zoom}px`;
  magnifierZoom.style.backgroundPosition = `${glassCenterInZoomX - imageX * zoom}px ${glassCenterInZoomY - imageY * zoom}px`;
}

viewer.addEventListener("pointerenter", (event) => {
  magnifier.hidden = false;
  moveMagnifier(event.clientX, event.clientY);
});

viewer.addEventListener("pointermove", (event) => {
  magnifier.hidden = false;
  moveMagnifier(event.clientX, event.clientY);
});

viewer.addEventListener("pointerleave", () => {
  magnifier.hidden = true;
});

sheet.addEventListener("load", () => {
  magnifierZoom.style.backgroundImage = `url("${sheet.currentSrc || sheet.src}")`;
});
