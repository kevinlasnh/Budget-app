/**
 * @jest-environment jsdom
 */

const {
  EDIT,
  DELETE,
  buildEntryElement,
  calculateBalance,
  calculateTotal,
  createBudgetApp,
  initBudgetApp,
  loadEntries,
  validateEntry,
} = require("./budget.js");

function renderBudgetDom() {
  document.body.innerHTML = `
    <div class="budget-container">
      <div class="balance">
        <div class="value"></div>
      </div>
      <div class="income-total"></div>
      <div class="outcome-total"></div>
      <div class="toggle">
        <button class="first-tab">Expenses</button>
        <button class="second-tab">Income</button>
        <button class="third-tab focus">All</button>
      </div>
      <div id="expense" class="hide">
        <ul class="list"></ul>
        <label for="expense-title-input">Expense Title</label>
        <input type="text" id="expense-title-input" />
        <label for="expense-amount-input">Expense Amount</label>
        <input type="number" id="expense-amount-input" />
        <button class="add-expense" type="button"></button>
      </div>
      <div id="income" class="hide">
        <ul class="list"></ul>
        <label for="income-title-input">Income Title</label>
        <input type="text" id="income-title-input" />
        <label for="income-amount-input">Income Amount</label>
        <input type="number" id="income-amount-input" />
        <button class="add-income" type="button"></button>
      </div>
      <div id="all">
        <ul class="list"></ul>
      </div>
    </div>
  `;
}

describe("Budget module - pure logic", () => {
  test("validateEntry accepts trimmed positive input", () => {
    expect(validateEntry(" Salary ", "100.50")).toEqual({
      isValid: true,
      title: "Salary",
      amount: 100.5,
    });
  });

  test("validateEntry rejects blank, negative, and non-numeric values", () => {
    expect(validateEntry("", "10").isValid).toBe(false);
    expect(validateEntry("Rent", "-10").isValid).toBe(false);
    expect(validateEntry("Rent", "abc").isValid).toBe(false);
  });

  test("calculateTotal sums only matching entry types", () => {
    const entries = [
      { type: "income", amount: 100 },
      { type: "income", amount: 250.25 },
      { type: "expense", amount: 40 },
    ];

    expect(calculateTotal("income", entries)).toBeCloseTo(350.25);
    expect(calculateTotal("expense", entries)).toBe(40);
  });

  test("calculateBalance returns signed difference", () => {
    expect(calculateBalance(500, 300)).toBe(200);
    expect(calculateBalance(300, 500)).toBe(-200);
  });

  test("loadEntries returns an empty array for invalid JSON", () => {
    const fakeStorage = {
      getItem: jest.fn().mockReturnValue("{bad json"),
    };

    expect(loadEntries(fakeStorage)).toEqual([]);
  });

  test("loadEntries returns an empty array when storage is unavailable", () => {
    expect(loadEntries(null)).toEqual([]);
  });

  test("buildEntryElement uses DOM APIs for text and action buttons", () => {
    const item = buildEntryElement(
      document,
      { type: "income", title: `<img src=x onerror="alert(1)">`, amount: 55 },
      3
    );

    expect(item.id).toBe("3");
    expect(item.className).toBe("income");
    expect(item.querySelector(".entry").textContent).toContain("<img src=x");
    expect(item.querySelector(`#${EDIT}`)).not.toBeNull();
    expect(item.querySelector(`#${DELETE}`)).not.toBeNull();
  });

  test("initBudgetApp requires a document", () => {
    expect(() => initBudgetApp({ document: null })).toThrow(
      "A document is required to initialize the budget app."
    );
  });
});

describe("Budget module - DOM integration", () => {
  let app;
  let updateChartMock;
  let alertMock;

  beforeEach(() => {
    renderBudgetDom();
    localStorage.clear();
    updateChartMock = jest.fn();
    alertMock = jest.fn();
  });

  afterEach(() => {
    if (app) {
      app.destroy();
      app = null;
    }
  });

  test("initialization renders persisted entries and totals", () => {
    localStorage.setItem(
      "entry_list",
      JSON.stringify([
        { type: "income", title: "Salary", amount: 500 },
        { type: "expense", title: "Rent", amount: 200 },
      ])
    );

    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    expect(document.querySelector(".balance .value").textContent).toBe("$300");
    expect(document.querySelector(".income-total").textContent).toBe("$500");
    expect(document.querySelector(".outcome-total").textContent).toBe("$200");
    expect(document.querySelectorAll("#all .list li")).toHaveLength(2);
    expect(updateChartMock).toHaveBeenCalledWith(500, 200);
  });

  test("clicking add income uses real production logic and persists the entry", () => {
    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    document.getElementById("income-title-input").value = "Salary";
    document.getElementById("income-amount-input").value = "1000";
    document.querySelector(".add-income").click();

    expect(app.getEntryList()).toEqual([
      { type: "income", title: "Salary", amount: 1000 },
    ]);
    expect(document.querySelector(".balance .value").textContent).toBe("$1000");
    expect(document.querySelectorAll("#income .list li")).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem("entry_list"))).toEqual([
      { type: "income", title: "Salary", amount: 1000 },
    ]);
  });

  test("invalid input triggers translated alert and does not add an entry", () => {
    const translate = jest.fn().mockReturnValue("Bad input");
    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
      translate,
    });

    document.getElementById("expense-title-input").value = "Rent";
    document.getElementById("expense-amount-input").value = "-10";
    document.querySelector(".add-expense").click();

    expect(alertMock).toHaveBeenCalledWith("Bad input");
    expect(app.getEntryList()).toEqual([]);
    expect(document.querySelectorAll("#expense .list li")).toHaveLength(0);
  });

  test("tab buttons toggle visibility and active state", () => {
    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    document.querySelector(".first-tab").click();
    expect(document.getElementById("expense").classList.contains("hide")).toBe(false);
    expect(document.getElementById("income").classList.contains("hide")).toBe(true);
    expect(document.querySelector(".first-tab").classList.contains("focus")).toBe(true);

    document.querySelector(".second-tab").click();
    expect(document.getElementById("income").classList.contains("hide")).toBe(false);
    expect(document.getElementById("expense").classList.contains("hide")).toBe(true);

    document.querySelector(".third-tab").click();
    expect(document.getElementById("all").classList.contains("hide")).toBe(false);
    expect(document.querySelector(".third-tab").classList.contains("focus")).toBe(true);
  });

  test("delete button removes the selected entry from the real DOM", () => {
    localStorage.setItem(
      "entry_list",
      JSON.stringify([
        { type: "income", title: "Salary", amount: 500 },
        { type: "expense", title: "Rent", amount: 100 },
      ])
    );

    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    const firstDeleteButton = document.querySelector("#all .list li button#delete");
    firstDeleteButton.click();

    expect(app.getEntryList()).toHaveLength(1);
    expect(document.querySelectorAll("#all .list li")).toHaveLength(1);
  });

  test("edit button moves the selected entry back into the form inputs", () => {
    localStorage.setItem(
      "entry_list",
      JSON.stringify([{ type: "expense", title: "Rent", amount: 250 }])
    );

    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    document.querySelector("#expense .list button#edit").click();

    expect(document.getElementById("expense-title-input").value).toBe("Rent");
    expect(document.getElementById("expense-amount-input").value).toBe("250");
    expect(app.getEntryList()).toEqual([]);
  });

  test("editing a missing entry id is a no-op", () => {
    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    expect(() => app.editEntry(99)).not.toThrow();
    expect(app.getEntryList()).toEqual([]);
  });

  test("editing an income entry fills the income form fields", () => {
    localStorage.setItem(
      "entry_list",
      JSON.stringify([{ type: "income", title: "Salary", amount: 900 }])
    );

    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    document.querySelector("#income .list button#edit").click();

    expect(document.getElementById("income-title-input").value).toBe("Salary");
    expect(document.getElementById("income-amount-input").value).toBe("900");
    expect(app.getEntryList()).toEqual([]);
  });

  test("clicking outside action buttons does not mutate entries", () => {
    localStorage.setItem(
      "entry_list",
      JSON.stringify([{ type: "income", title: "Salary", amount: 500 }])
    );

    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    document.querySelector("#all .list").dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );

    expect(app.getEntryList()).toHaveLength(1);
  });

  test("non-numeric entry ids are ignored by the click handler", () => {
    app = createBudgetApp({
      document,
      storage: localStorage,
      updateChart: updateChartMock,
      alertFn: alertMock,
    });

    const invalidItem = document.createElement("li");
    invalidItem.id = "not-a-number";
    const invalidDelete = document.createElement("button");
    invalidDelete.id = DELETE;
    invalidItem.appendChild(invalidDelete);
    document.querySelector("#all .list").appendChild(invalidItem);

    invalidDelete.click();

    expect(app.getEntryList()).toEqual([]);
  });
});
