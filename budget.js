(function (root, factory) {
  /* istanbul ignore else -- browser bootstrap is exercised in the real page */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(root);
    return;
  } else {
    const api = factory(root);
    root.BudgetModule = api;
    root.budgetApp = api.initBudgetApp({
      document: root.document,
      storage: root.localStorage,
      updateChart: root.updateChart,
      translate: root.t,
      alertFn: root.alert,
    });
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  const DELETE = "delete";
  const EDIT = "edit";

  function createEntry(type, title, amount) {
    return {
      type,
      title,
      amount: Number(amount),
    };
  }

  function validateEntry(title, amount) {
    const normalizedTitle = typeof title === "string" ? title.trim() : "";
    const numericAmount = Number(amount);

    return {
      isValid:
        Boolean(normalizedTitle) &&
        Number.isFinite(numericAmount) &&
        numericAmount > 0,
      title: normalizedTitle,
      amount: numericAmount,
    };
  }

  function loadEntries(storage) {
    if (!storage || typeof storage.getItem !== "function") {
      return [];
    }

    try {
      const rawValue = storage.getItem("entry_list");
      const parsed = rawValue ? JSON.parse(rawValue) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveEntries(storage, entries) {
    if (storage && typeof storage.setItem === "function") {
      storage.setItem("entry_list", JSON.stringify(entries));
    }
  }

  function calculateTotal(type, list) {
    let sum = 0;

    list.forEach(function (entry) {
      if (entry.type === type) {
        sum += Number(entry.amount) || 0;
      }
    });

    return sum;
  }

  function calculateBalance(income, outcome) {
    return income - outcome;
  }

  function clearInput(inputs) {
    inputs.forEach(function (input) {
      if (input) {
        input.value = "";
      }
    });
  }

  function clearElement(elements) {
    elements.forEach(function (element) {
      if (element) {
        element.innerHTML = "";
      }
    });
  }

  function show(element) {
    if (element) {
      element.classList.remove("hide");
    }
  }

  function hide(elements) {
    elements.forEach(function (element) {
      if (element) {
        element.classList.add("hide");
      }
    });
  }

  function active(element) {
    if (element) {
      element.classList.add("focus");
    }
  }

  function inactive(elements) {
    elements.forEach(function (element) {
      if (element) {
        element.classList.remove("focus");
      }
    });
  }

  function buildEntryElement(doc, entry, id) {
    const item = doc.createElement("li");
    item.id = String(id);
    item.className = entry.type;

    const entryContent = doc.createElement("div");
    entryContent.className = "entry";
    entryContent.textContent = `${entry.title} : $${entry.amount}`;
    item.appendChild(entryContent);

    const editButton = doc.createElement("button");
    editButton.type = "button";
    editButton.id = EDIT;
    editButton.setAttribute("aria-label", `Edit ${entry.title}`);
    item.appendChild(editButton);

    const deleteButton = doc.createElement("button");
    deleteButton.type = "button";
    deleteButton.id = DELETE;
    deleteButton.setAttribute("aria-label", `Delete ${entry.title}`);
    item.appendChild(deleteButton);

    return item;
  }

  function showEntry(list, entry, id, doc) {
    const item = buildEntryElement(doc, entry, id);
    list.prepend(item);
    return item;
  }

  function getElements(doc) {
    return {
      balanceEl: doc.querySelector(".balance .value"),
      incomeTotalEl: doc.querySelector(".income-total"),
      outcomeTotalEl: doc.querySelector(".outcome-total"),
      incomeEl: doc.querySelector("#income"),
      expenseEl: doc.querySelector("#expense"),
      allEl: doc.querySelector("#all"),
      incomeList: doc.querySelector("#income .list"),
      expenseList: doc.querySelector("#expense .list"),
      allList: doc.querySelector("#all .list"),
      expenseBtn: doc.querySelector(".first-tab"),
      incomeBtn: doc.querySelector(".second-tab"),
      allBtn: doc.querySelector(".third-tab"),
      addExpenseButton: doc.querySelector(".add-expense"),
      expenseTitle: doc.getElementById("expense-title-input"),
      expenseAmount: doc.getElementById("expense-amount-input"),
      addIncomeButton: doc.querySelector(".add-income"),
      incomeTitle: doc.getElementById("income-title-input"),
      incomeAmount: doc.getElementById("income-amount-input"),
    };
  }

  function createBudgetApp(options = {}) {
    const doc = Object.prototype.hasOwnProperty.call(options, "document")
      ? options.document
      : root.document;
    const storage = options.storage || root.localStorage;
    const updateChart =
      typeof options.updateChart === "function" ? options.updateChart : function () {};
    const translate =
      typeof options.translate === "function" ? options.translate : null;
    const alertFn =
      typeof options.alertFn === "function" ? options.alertFn : function () {};

    if (!doc) {
      throw new Error("A document is required to initialize the budget app.");
    }

    const elements = getElements(doc);
    let entryList = Array.isArray(options.entryList)
      ? options.entryList.slice()
      : loadEntries(storage);

    function getValidationMessage() {
      return translate
        ? translate("validationError")
        : "Please enter a valid positive amount";
    }

    function updateUI() {
      const income = calculateTotal("income", entryList);
      const outcome = calculateTotal("expense", entryList);
      const balance = Math.abs(calculateBalance(income, outcome));
      const sign = income >= outcome ? "$" : "-$";

      elements.balanceEl.textContent = `${sign}${balance}`;
      elements.outcomeTotalEl.textContent = `$${outcome}`;
      elements.incomeTotalEl.textContent = `$${income}`;

      clearElement([elements.expenseList, elements.incomeList, elements.allList]);

      entryList.forEach(function (entry, index) {
        if (entry.type === "expense") {
          showEntry(elements.expenseList, entry, index, doc);
        } else if (entry.type === "income") {
          showEntry(elements.incomeList, entry, index, doc);
        }

        showEntry(elements.allList, entry, index, doc);
      });

      updateChart(income, outcome);
      saveEntries(storage, entryList);

      return {
        income,
        outcome,
        balance,
      };
    }

    function deleteEntry(entryId) {
      entryList.splice(entryId, 1);
      updateUI();
    }

    function editEntry(entryId) {
      const entry = entryList[entryId];
      if (!entry) {
        return;
      }

      if (entry.type === "income") {
        elements.incomeTitle.value = entry.title;
        elements.incomeAmount.value = entry.amount;
      } else if (entry.type === "expense") {
        elements.expenseTitle.value = entry.title;
        elements.expenseAmount.value = entry.amount;
      }

      deleteEntry(entryId);
    }

    function handleListClick(event) {
      const targetButton = event.target.closest("button");
      if (!targetButton || !targetButton.parentNode) {
        return;
      }

      const entryId = Number(targetButton.parentNode.id);
      if (Number.isNaN(entryId)) {
        return;
      }

      if (targetButton.id === EDIT) {
        editEntry(entryId);
      } else if (targetButton.id === DELETE) {
        deleteEntry(entryId);
      }
    }

    function addEntry(type) {
      const isExpense = type === "expense";
      const titleInput = isExpense ? elements.expenseTitle : elements.incomeTitle;
      const amountInput = isExpense
        ? elements.expenseAmount
        : elements.incomeAmount;
      const validation = validateEntry(titleInput.value, amountInput.value);

      if (!validation.isValid) {
        alertFn(getValidationMessage());
        return false;
      }

      entryList.push(createEntry(type, validation.title, validation.amount));
      updateUI();
      clearInput([titleInput, amountInput]);

      return true;
    }

    const onExpenseTabClick = function () {
      show(elements.expenseEl);
      hide([elements.incomeEl, elements.allEl]);
      active(elements.expenseBtn);
      inactive([elements.incomeBtn, elements.allBtn]);
    };

    const onIncomeTabClick = function () {
      show(elements.incomeEl);
      hide([elements.expenseEl, elements.allEl]);
      active(elements.incomeBtn);
      inactive([elements.expenseBtn, elements.allBtn]);
    };

    const onAllTabClick = function () {
      show(elements.allEl);
      hide([elements.incomeEl, elements.expenseEl]);
      active(elements.allBtn);
      inactive([elements.incomeBtn, elements.expenseBtn]);
    };

    const onExpenseAddClick = function () {
      addEntry("expense");
    };

    const onIncomeAddClick = function () {
      addEntry("income");
    };

    elements.expenseBtn.addEventListener("click", onExpenseTabClick);
    elements.incomeBtn.addEventListener("click", onIncomeTabClick);
    elements.allBtn.addEventListener("click", onAllTabClick);
    elements.addExpenseButton.addEventListener("click", onExpenseAddClick);
    elements.addIncomeButton.addEventListener("click", onIncomeAddClick);
    elements.incomeList.addEventListener("click", handleListClick);
    elements.expenseList.addEventListener("click", handleListClick);
    elements.allList.addEventListener("click", handleListClick);

    updateUI();

    return {
      elements,
      addEntry,
      deleteEntry,
      editEntry,
      updateUI,
      getEntryList: function () {
        return entryList.map(function (entry) {
          return { ...entry };
        });
      },
      destroy: function () {
        elements.expenseBtn.removeEventListener("click", onExpenseTabClick);
        elements.incomeBtn.removeEventListener("click", onIncomeTabClick);
        elements.allBtn.removeEventListener("click", onAllTabClick);
        elements.addExpenseButton.removeEventListener("click", onExpenseAddClick);
        elements.addIncomeButton.removeEventListener("click", onIncomeAddClick);
        elements.incomeList.removeEventListener("click", handleListClick);
        elements.expenseList.removeEventListener("click", handleListClick);
        elements.allList.removeEventListener("click", handleListClick);
      },
    };
  }

  function initBudgetApp(options = {}) {
    return createBudgetApp(options);
  }

  return {
    DELETE,
    EDIT,
    active,
    buildEntryElement,
    calculateBalance,
    calculateTotal,
    clearElement,
    clearInput,
    createBudgetApp,
    createEntry,
    hide,
    inactive,
    initBudgetApp,
    loadEntries,
    saveEntries,
    show,
    showEntry,
    validateEntry,
  };
});
