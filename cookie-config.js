// Cookie Consent Configuration

CookieConsent.run({
  guiOptions: {
    consentModal: {
      layout: "box",
      position: "bottom right"
    },
    preferencesModal: {
      layout: "box"
    }
  },

  categories: {
    necessary: {
      enabled: true,
      readOnly: true
    },
    analytics: {
      enabled: false
    }
  },

  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "We use cookies",
          description: "This website uses essential cookies to ensure proper functionality and tracking cookies to understand how you interact with it. The latter will be set only after consent.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences"
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Cookie usage",
              description: "We use cookies to ensure the basic functionalities of the website and to enhance your online experience."
            },
            {
              title: "Strictly necessary cookies",
              description: "These cookies are essential for the proper functioning of the website. Without these cookies, the website would not work properly.",
              linkedCategory: "necessary"
            },
            {
              title: "Analytics cookies",
              description: "These cookies collect information about how you use the website, which pages you visited and which links you clicked on.",
              linkedCategory: "analytics"
            }
          ]
        }
      },
      zh: {
        consentModal: {
          title: "我们使用 Cookie",
          description: "本网站使用必要的 Cookie 来确保正常功能，以及跟踪 Cookie 来了解您如何与其交互。后者仅在征得同意后设置。",
          acceptAllBtn: "接受全部",
          acceptNecessaryBtn: "拒绝全部",
          showPreferencesBtn: "管理偏好"
        },
        preferencesModal: {
          title: "Cookie 偏好设置",
          acceptAllBtn: "接受全部",
          acceptNecessaryBtn: "拒绝全部",
          savePreferencesBtn: "保存偏好",
          closeIconLabel: "关闭",
          sections: [
            {
              title: "Cookie 使用",
              description: "我们使用 Cookie 来确保网站的基本功能并增强您的在线体验。"
            },
            {
              title: "必要的 Cookie",
              description: "这些 Cookie 对于网站的正常运行至关重要。没有这些 Cookie，网站将无法正常工作。",
              linkedCategory: "necessary"
            },
            {
              title: "分析 Cookie",
              description: "这些 Cookie 收集有关您如何使用网站、访问了哪些页面以及点击了哪些链接的信息。",
              linkedCategory: "analytics"
            }
          ]
        }
      }
    }
  }
});
