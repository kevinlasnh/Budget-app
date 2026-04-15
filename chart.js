(function (root, factory) {
  /* istanbul ignore else -- browser bootstrap is exercised in the real page */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(root);
    return;
  } else {
    const api = factory(root);
    root.ChartModule = api;

    const defaultRenderer = api.createChartRenderer();
    if (defaultRenderer) {
      root.chartRenderer = defaultRenderer;
      root.updateChart = defaultRenderer.updateChart;
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  const CANVAS_SIZE = 50;
  const LINE_WIDTH = 8;
  const CIRCLE_RADIUS = 20;

  function calculateRatio(income, outcome) {
    const total = income + outcome;

    if (total <= 0) {
      return 0;
    }

    return income / total;
  }

  function createNoopContext() {
    return {
      lineWidth: 0,
      strokeStyle: "",
      beginPath: function () {},
      arc: function () {},
      stroke: function () {},
      clearRect: function () {},
    };
  }

  function createChartRenderer(options = {}) {
    const doc = options.document || root.document;
    const chartElement =
      options.chartElement || (doc ? doc.querySelector(".chart") : null);

    if (!doc || !chartElement) {
      return null;
    }

    const canvas = options.canvas || doc.createElement("canvas");
    if (!options.canvas) {
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Income vs Expense chart");
      chartElement.appendChild(canvas);
    }

    let ctx =
      options.context ||
      (typeof canvas.getContext === "function"
        ? canvas.getContext("2d")
        : null);

    if (!ctx) {
      ctx = createNoopContext();
    }

    ctx.lineWidth = LINE_WIDTH;

    function drawCircle(color, ratio, anticlockwise) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        CIRCLE_RADIUS,
        0,
        ratio * 2 * Math.PI,
        anticlockwise
      );
      ctx.stroke();
    }

    function updateChart(income, outcome) {
      const ratio = calculateRatio(income, outcome);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCircle("#FFF", -ratio, true);
      drawCircle("#F0624D", 1 - ratio, false);
      canvas.setAttribute("aria-label", `Income $${income} vs Expense $${outcome}`);

      return ratio;
    }

    return {
      canvas,
      ctx,
      drawCircle,
      updateChart,
    };
  }

  return {
    CANVAS_SIZE,
    LINE_WIDTH,
    CIRCLE_RADIUS,
    calculateRatio,
    createChartRenderer,
  };
});
