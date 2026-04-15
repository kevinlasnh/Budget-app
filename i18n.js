// i18n.js - Internationalization support for Budget App

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
    chartLabel: "Income vs Expense chart"
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
    chartLabel: "收入与支出图表"
  }
};

let currentLang = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  updatePageLanguage();
}

function t(key) {
  return translations[currentLang][key] || key;
}

function updatePageLanguage() {
  // Update app title
  document.querySelector('.app-title a').innerHTML = `${t('appTitle')}<b>${t('appTitleBold')}</b>`;

  // Update balance section
  document.querySelector('.balance .title').textContent = t('balance');

  // Update income/outcome titles
  document.querySelectorAll('.income .title')[0].textContent = t('income');
  document.querySelectorAll('.outcome .title')[0].textContent = t('outcome');

  // Update dashboard
  document.querySelector('.dash-title').textContent = t('dashboard');

  // Update toggle tabs
  document.querySelector('.first-tab').textContent = t('expenses');
  document.querySelector('.second-tab').textContent = t('income');
  document.querySelector('.third-tab').textContent = t('all');

  // Update expense labels
  const expenseLabels = document.querySelectorAll('#expense label');
  if (expenseLabels[0]) expenseLabels[0].textContent = t('expenseTitle');
  if (expenseLabels[1]) expenseLabels[1].textContent = t('expenseAmount');

  // Update income labels
  const incomeLabels = document.querySelectorAll('#income label');
  if (incomeLabels[0]) incomeLabels[0].textContent = t('incomeTitle');
  if (incomeLabels[1]) incomeLabels[1].textContent = t('incomeAmount');

  // Update buttons aria-labels
  document.querySelector('.add-expense').setAttribute('aria-label', t('addExpense'));
  document.querySelector('.add-income').setAttribute('aria-label', t('addIncome'));

  // Update chart aria-label
  const canvas = document.querySelector('.chart canvas');
  if (canvas) {
    canvas.setAttribute('aria-label', t('chartLabel'));
  }

  // Update language selector
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-lang="${currentLang}"]`).classList.add('active');
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  updatePageLanguage();
});
