let scale = 1;
let posX = 0;
let posY = 0;

let isDragging = false;
let startX, startY;

const img = document.getElementById("vrImage");
const container = document.getElementById("vr");

/* ===== DRAG ===== */
container.addEventListener("mousedown", (e) => {
  // ❗ nếu click vào menu thì không drag
  if (e.target.closest(".menu")) return;

  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  container.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  container.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  posX += dx;
  posY += dy;

  updateTransform();

  startX = e.clientX;
  startY = e.clientY;
});

/* ===== ZOOM ===== */
container.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (e.deltaY < 0) {
    scale += 0.1;
  } else {
    scale -= 0.1;
  }

  scale = Math.max(1, Math.min(scale, 3));

  updateTransform();
});

/* ===== APPLY TRANSFORM ===== */
function updateTransform() {
  img.style.transform = `
    translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px))
    scale(${scale})
  `;
}
