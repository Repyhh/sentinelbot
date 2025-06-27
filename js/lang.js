document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("languageSelect");
  const themeToggle    = document.getElementById("themeToggle");

  // Aplicar tema guardado
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.checked = true;
  }

  // Aplicar idioma guardado
  const savedLang = localStorage.getItem("selectedLang");
  if (savedLang) {
    languageSelect.value = savedLang;
  }

  // Trocar de tema e guardar no localStorage
  window.toggleTheme = function () {
    const isDark = themeToggle.checked;
    document.documentElement.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("dark-mode",    isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // Carregar traduções do JSON
  const loadLanguage = (lang) => {
    fetch(`../lang/${lang}.json`)
      .then((response) => response.json())
      .then((translations) => applyTranslations(translations))
      .catch((error) => console.error("Erro ao carregar traduções:", error));
  };

  // Aplicar traduções aos elementos com data-i18n e data-i18n-alt
  const applyTranslations = (translations) => {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(el => {
      const key = el.getAttribute("data-i18n-alt");
      if (translations[key]) {
        el.setAttribute("alt", translations[key]);
      }
    });
    if (translations.title) {
      document.title = translations.title;
    }
  };

  // Trocar de idioma sem reload
  languageSelect.addEventListener("change", () => {
    const selectedLang = languageSelect.value;
    localStorage.setItem("selectedLang", selectedLang);
    loadLanguage(selectedLang);
  });

  // Carregar tradução atual
  loadLanguage(languageSelect.value);
});