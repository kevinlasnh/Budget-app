/**
 * @jest-environment jsdom
 */

const { createI18n, initI18n, translations } = require("./i18n.js");

function renderI18nDom() {
  document.body.innerHTML = `
    <div class="app-title"><a href="#"></a></div>
    <div class="balance"><div class="title"></div><div class="value"></div></div>
    <div class="income"><div class="title"></div></div>
    <div class="outcome"><div class="title"></div></div>
    <div class="dash-title"></div>
    <button class="first-tab"></button>
    <button class="second-tab"></button>
    <button class="third-tab"></button>
    <div id="expense">
      <label></label>
      <label></label>
    </div>
    <div id="income">
      <label></label>
      <label></label>
    </div>
    <button class="add-expense"></button>
    <button class="add-income"></button>
    <div class="chart"><canvas role="img"></canvas></div>
    <button class="lang-btn" data-lang="en"></button>
    <button class="lang-btn" data-lang="zh"></button>
  `;
}

describe("i18n module", () => {
  beforeEach(() => {
    localStorage.clear();
    renderI18nDom();
  });

  test("translations expose both supported languages", () => {
    expect(Object.keys(translations)).toEqual(["en", "zh"]);
  });

  test("initI18n applies English by default", () => {
    const i18n = initI18n({
      document,
      storage: localStorage,
    });

    expect(i18n.getCurrentLanguage()).toBe("en");
    expect(document.querySelector(".balance .title").textContent).toBe("Balance");
    expect(document.querySelector(".lang-btn[data-lang='en']").classList.contains("active")).toBe(true);
    expect(document.querySelector(".add-expense").getAttribute("aria-label")).toBe("Add expense");
  });

  test("setLanguage updates DOM text, aria labels, and localStorage", () => {
    const i18n = createI18n({
      document,
      storage: localStorage,
    });

    i18n.setLanguage("zh");

    expect(i18n.getCurrentLanguage()).toBe("zh");
    expect(localStorage.getItem("language")).toBe("zh");
    expect(document.querySelector(".balance .title").textContent).toBe("余额");
    expect(document.querySelector(".first-tab").textContent).toBe("支出");
    expect(document.querySelector(".add-income").getAttribute("aria-label")).toBe("添加收入");
    expect(document.querySelector(".chart canvas").getAttribute("aria-label")).toBe("收入与支出图表");
    expect(document.querySelector(".lang-btn[data-lang='zh']").classList.contains("active")).toBe(true);
  });

  test("unknown translation key falls back to the key name", () => {
    const i18n = createI18n({
      document,
      storage: localStorage,
    });

    expect(i18n.t("missingKey")).toBe("missingKey");
  });

  test("unsupported saved language falls back to English", () => {
    localStorage.setItem("language", "fr");

    const i18n = createI18n({
      document,
      storage: localStorage,
    });

    expect(i18n.getCurrentLanguage()).toBe("en");
  });

  test("setLanguage falls back to English for unsupported target languages", () => {
    const storage = {};
    const i18n = createI18n({
      document,
      storage,
    });

    i18n.setLanguage("fr");

    expect(i18n.getCurrentLanguage()).toBe("en");
  });

  test("updatePageLanguage is safe when optional elements are missing", () => {
    document.body.innerHTML = "";

    const i18n = createI18n({
      document,
      storage: localStorage,
    });

    expect(i18n.updatePageLanguage()).toBe("en");
  });

  test("initI18n can operate without a document", () => {
    const i18n = initI18n({
      document: null,
      storage: localStorage,
    });

    expect(i18n.getCurrentLanguage()).toBe("en");
  });

  test("initI18n registers a DOMContentLoaded callback when the document is loading", () => {
    const loadingDocument = {
      readyState: "loading",
      addEventListener: jest.fn(),
      querySelector: jest.fn().mockReturnValue(null),
      querySelectorAll: jest.fn().mockReturnValue([]),
      createElement: document.createElement.bind(document),
    };

    initI18n({
      document: loadingDocument,
      storage: localStorage,
    });

    expect(loadingDocument.addEventListener).toHaveBeenCalledWith(
      "DOMContentLoaded",
      expect.any(Function),
      { once: true }
    );
  });
});
