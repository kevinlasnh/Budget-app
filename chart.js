// SELECT CHART ELEMENT
const chartEl = document.querySelector(".chart");

// CREATE CANVAS ELEMENT
const canvas = document.createElement("canvas");
const CANVAS_SIZE = 50;
const LINE_WIDTH = 8;
const CIRCLE_RADIUS = 20;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
canvas.setAttribute('role', 'img');
canvas.setAttribute('aria-label', 'Income vs Expense chart');

chartEl.appendChild(canvas);

// TO DRAW ON CANVAS, WE NEED TO GET CONTEXT OF CANVAS
const ctx = canvas.getContext("2d");

// CHANGE LINE WIDTH
ctx.lineWidth = LINE_WIDTH;

// CIRCLE RADIUS
const R = CIRCLE_RADIUS;

function drawCircle(color, ratio, anticlockwise) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    R,
    0,
    ratio * 2 * Math.PI,
    anticlockwise
  );
  ctx.stroke();
}

function updateChart(income, outcome) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let ratio = income / (outcome + income);

  drawCircle("#FFF", -ratio, true);
  drawCircle("#F0624D", 1 - ratio, false);

  // Update aria-label with current values
  canvas.setAttribute('aria-label', `Income $${income} vs Expense $${outcome}`);
}
