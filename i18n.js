(function (root, factory) {
  /* istanbul ignore else -- browser bootstrap is exercised in the real page */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(root);
    return;
  } else {
    const api = factory(root);
    root.I18nModule = api;

    const instance = api.initI18n({
      document: root.document,
      storage: root.localStorage,
    });

    root.i18n = instance;
    root.t = instance.t;
    root.setLanguage = instance.setLanguage;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  const translations = {
    en: {
      appTitle: "Budget",
      appTitleBold: "App",
      balance: "Balance",
      income: "Income",
      outcome: "Outcome",
      dashboard: "Dashboard",
      expenses: "Expenses",
      all: "All",
      expenseTitle: "Expense Title",
      expenseAmount: "Expense Amount",
      incomeTitle: "Income Title",
      incomeAmount: "Income Amount",
      addExpense: "Add expense",
      addIncome: "Add income",
      editEntry: "Edit",
      deleteEntry: "Delete",
      validationError: "Please enter a valid positive amount",
      chartLabel: "Income vs Expense chart",
    },
    zh: {
      appTitle: "预算",
      appTitleBold: "应用",
      balance: "余额",
      income: "收入",
      outcome: "支出",
      dashboard: "仪表板",
      expenses: "支出",
      all: "全部",
      expenseTitle: "支出标题",
      expenseAmount: "支出金额",
      incomeTitle: "收入标题",
      incomeAmount: "收入金额",
      addExpense: "添加支出",
      addIncome: "添加收入",
      editEntry: "编辑",
      deleteEntry: "删除",
      validationError: "请输入有效的正数金额",
      chartLabel: "收入与支出图表",
    },
  };

  function updateAppTitle(doc, titleText, boldText) {
    const link = doc.querySelector(".app-title a");
    if (!link) {
      return;
    }

    link.textContent = "";
    link.appendChild(doc.createTextNode(titleText));

    const bold = doc.createElement("b");
    bold.textContent = boldText;
    link.appendChild(bold);
  }

  function setText(doc, selector, value) {
    const element = doc.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function createI18n(options = {}) {
    const doc = options.document || root.document;
    const storage = options.storage || root.localStorage;

    let currentLang =
      (storage && storage.getItem && storage.getItem("language")) || "en";

    if (!translations[currentLang]) {
      currentLang = "en";
    }

    function t(key) {
      return translations[currentLang][key] || key;
    }

    function updatePageLanguage() {
      if (!doc) {
        return currentLang;
      }

      updateAppTitle(doc, t("appTitle"), t("appTitleBold"));
      setText(doc, ".balance .title", t("balance"));
      setText(doc, ".income .title", t("income"));
      setText(doc, ".outcome .title", t("outcome"));
      setText(doc, ".dash-title", t("dashboard"));
      setText(doc, ".first-tab", t("expenses"));
      setText(doc, ".second-tab", t("income"));
      setText(doc, ".third-tab", t("all"));

      const expenseLabels = doc.querySelectorAll("#expense label");
      if (expenseLabels[0]) {
        expenseLabels[0].textContent = t("expenseTitle");
      }
      if (expenseLabels[1]) {
        expenseLabels[1].textContent = t("expenseAmount");
      }

      const incomeLabels = doc.querySelectorAll("#income label");
      if (incomeLabels[0]) {
        incomeLabels[0].textContent = t("incomeTitle");
      }
      if (incomeLabels[1]) {
        incomeLabels[1].textContent = t("incomeAmount");
      }

      const addExpenseButton = doc.querySelector(".add-expense");
      if (addExpenseButton) {
        addExpenseButton.setAttribute("aria-label", t("addExpense"));
      }

      const addIncomeButton = doc.querySelector(".add-income");
      if (addIncomeButton) {
        addIncomeButton.setAttribute("aria-label", t("addIncome"));
      }

      const canvas = doc.querySelector(".chart canvas");
      if (canvas) {
        canvas.setAttribute("aria-label", t("chartLabel"));
      }

      doc.querySelectorAll(".lang-btn").forEach(function (button) {
        button.classList.remove("active");
      });

      const activeButton = doc.querySelector(`[data-lang="${currentLang}"]`);
      if (activeButton) {
        activeButton.classList.add("active");
      }

      return currentLang;
    }

    function setLanguage(lang) {
      currentLang = translations[lang] ? lang : "en";

      if (storage && storage.setItem) {
        storage.setItem("language", currentLang);
      }

      return updatePageLanguage();
    }

    return {
      t,
      setLanguage,
      updatePageLanguage,
      getCurrentLanguage: function () {
        return currentLang;
      },
    };
  }

  function initI18n(options = {}) {
    const instance = createI18n(options);
    const doc = options.document || root.document;

    if (!doc) {
      return instance;
    }

    if (doc.readyState === "loading") {
      doc.addEventListener(
        "DOMContentLoaded",
        function () {
          instance.updatePageLanguage();
        },
        { once: true }
      );
    } else {
      instance.updatePageLanguage();
    }

    return instance;
  }

  return {
    translations,
    createI18n,
    initI18n,
  };
});
