/**
 * @jest-environment jsdom
 */

const {
  CANVAS_SIZE,
  LINE_WIDTH,
  CIRCLE_RADIUS,
  calculateRatio,
  createChartRenderer,
} = require("./chart.js");

function createContextMock() {
  return {
    lineWidth: 0,
    strokeStyle: "",
    beginPath: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    clearRect: jest.fn(),
  };
}

describe("chart module", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div class="chart"></div>`;
  });

  test("exports the expected drawing constants", () => {
    expect(CANVAS_SIZE).toBe(50);
    expect(LINE_WIDTH).toBe(8);
    expect(CIRCLE_RADIUS).toBe(20);
  });

  test("calculateRatio returns 0 when income and outcome are both zero", () => {
    expect(calculateRatio(0, 0)).toBe(0);
  });

  test("calculateRatio returns the income share of the total", () => {
    expect(calculateRatio(600, 400)).toBeCloseTo(0.6);
  });

  test("createChartRenderer returns null when the chart container is missing", () => {
    document.body.innerHTML = "";
    expect(createChartRenderer({ document })).toBeNull();
  });

  test("renderer creates a canvas with accessibility attributes", () => {
    const context = createContextMock();
    const renderer = createChartRenderer({
      document,
      context,
    });

    expect(renderer.canvas.width).toBe(50);
    expect(renderer.canvas.height).toBe(50);
    expect(renderer.canvas.getAttribute("role")).toBe("img");
    expect(renderer.canvas.getAttribute("aria-label")).toBe("Income vs Expense chart");
    expect(context.lineWidth).toBe(8);
  });

  test("renderer can use a provided canvas and fallback no-op context", () => {
    const providedCanvas = document.createElement("canvas");
    providedCanvas.width = 50;
    providedCanvas.height = 50;
    providedCanvas.getContext = jest.fn().mockReturnValue(null);

    const renderer = createChartRenderer({
      document,
      canvas: providedCanvas,
    });

    expect(renderer.canvas).toBe(providedCanvas);
    expect(() => renderer.updateChart(10, 5)).not.toThrow();
    expect(providedCanvas.getContext).toHaveBeenCalledWith("2d");
  });

  test("updateChart redraws the chart and updates the aria label", () => {
    const context = createContextMock();
    const renderer = createChartRenderer({
      document,
      context,
    });

    const ratio = renderer.updateChart(750, 250);

    expect(ratio).toBeCloseTo(0.75);
    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 50, 50);
    expect(context.beginPath).toHaveBeenCalledTimes(2);
    expect(context.arc).toHaveBeenCalledTimes(2);
    expect(context.stroke).toHaveBeenCalledTimes(2);
    expect(renderer.canvas.getAttribute("aria-label")).toBe("Income $750 vs Expense $250");
  });
});
