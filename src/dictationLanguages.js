const languages = [
  ["Afrikaans", ["af-ZA"]],
  ["አማርኛ", ["am-ET"]],
  ["Azərbaycanca", ["az-AZ"]],
  ["বাংলা", ["bn-BD", "বাংলাদেশ"], ["bn-IN", "ভারত"]],
  ["Bahasa Indonesia", ["id-ID"]],
  ["Bahasa Melayu", ["ms-MY"]],
  ["Català", ["ca-ES"]],
  ["Čeština", ["cs-CZ"]],
  ["Dansk", ["da-DK"]],
  ["Deutsch", ["de-DE"]],
  [
    "English",
    ["en-AU", "Australia"],
    ["en-CA", "Canada"],
    ["en-IN", "India"],
    ["en-KE", "Kenya"],
    ["en-TZ", "Tanzania"],
    ["en-GH", "Ghana"],
    ["en-NZ", "New Zealand"],
    ["en-NG", "Nigeria"],
    ["en-ZA", "South Africa"],
    ["en-PH", "Philippines"],
    ["en-GB", "United Kingdom"],
    ["en-US", "United States"],
  ],
  [
    "Español",
    ["es-AR", "Argentina"],
    ["es-BO", "Bolivia"],
    ["es-CL", "Chile"],
    ["es-CO", "Colombia"],
    ["es-CR", "Costa Rica"],
    ["es-EC", "Ecuador"],
    ["es-SV", "El Salvador"],
    ["es-ES", "España"],
    ["es-US", "Estados Unidos"],
    ["es-GT", "Guatemala"],
    ["es-HN", "Honduras"],
    ["es-MX", "México"],
    ["es-NI", "Nicaragua"],
    ["es-PA", "Panamá"],
    ["es-PY", "Paraguay"],
    ["es-PE", "Perú"],
    ["es-PR", "Puerto Rico"],
    ["es-DO", "República Dominicana"],
    ["es-UY", "Uruguay"],
    ["es-VE", "Venezuela"],
  ],
  ["Euskara", ["eu-ES"]],
  ["Filipino", ["fil-PH"]],
  ["Français", ["fr-FR"]],
  ["Basa Jawa", ["jv-ID"]],
  ["Galego", ["gl-ES"]],
  ["ગુજરાતી", ["gu-IN"]],
  ["Hrvatski", ["hr-HR"]],
  ["IsiZulu", ["zu-ZA"]],
  ["Íslenska", ["is-IS"]],
  ["Italiano", ["it-IT", "Italia"], ["it-CH", "Svizzera"]],
  ["ಕನ್ನಡ", ["kn-IN"]],
  ["ភាសាខ្មែរ", ["km-KH"]],
  ["Latviešu", ["lv-LV"]],
  ["Lietuvių", ["lt-LT"]],
  ["മലയാളം", ["ml-IN"]],
  ["मराठी", ["mr-IN"]],
  ["Magyar", ["hu-HU"]],
  ["ລາວ", ["lo-LA"]],
  ["Nederlands", ["nl-NL"]],
  ["नेपाली भाषा", ["ne-NP"]],
  ["Norsk bokmål", ["nb-NO"]],
  ["Polski", ["pl-PL"]],
  ["Português", ["pt-BR", "Brasil"], ["pt-PT", "Portugal"]],
  ["Română", ["ro-RO"]],
  ["සිංහල", ["si-LK"]],
  ["Slovenščina", ["sl-SI"]],
  ["Basa Sunda", ["su-ID"]],
  ["Slovenčina", ["sk-SK"]],
  ["Suomi", ["fi-FI"]],
  ["Svenska", ["sv-SE"]],
  ["Kiswahili", ["sw-TZ", "Tanzania"], ["sw-KE", "Kenya"]],
  ["ქართული", ["ka-GE"]],
  ["Հայերեն", ["hy-AM"]],
  [
    "தமிழ்",
    ["ta-IN", "இந்தியா"],
    ["ta-SG", "சிங்கப்பூர்"],
    ["ta-LK", "இலங்கை"],
    ["ta-MY", "மலேசியா"],
  ],
  ["తెలుగు", ["te-IN"]],
  ["Tiếng Việt", ["vi-VN"]],
  ["Türkçe", ["tr-TR"]],
  ["اُردُو", ["ur-PK", "پاکستان"], ["ur-IN", "بھارت"]],
  ["Ελληνικά", ["el-GR"]],
  ["български", ["bg-BG"]],
  ["Русский", ["ru-RU"]],
  ["Српски", ["sr-RS"]],
  ["Українська", ["uk-UA"]],
  ["한국어", ["ko-KR"]],
  [
    "中文",
    ["cmn-Hans-CN", "普通话 (中国大陆)"],
    ["cmn-Hans-HK", "普通话 (香港)"],
    ["cmn-Hant-TW", "中文 (台灣)"],
    ["yue-Hant-HK", "粵語 (香港)"],
  ],
  ["日本語", ["ja-JP"]],
  ["हिन्दी", ["hi-IN"]],
  ["ภาษาไทย", ["th-TH"]],
];

export function buildLanguageSelect() {
  const select = document.getElementById("languageSelect");
  for (let i = 0; i < languages.length; i++) {
    const language = languages[i];
    if (language.length === 2) {
      // no dialects, just add the option
      const option = document.createElement("option");
      option.value = language[1][0];
      option.innerHTML = language[0];
      select.appendChild(option);
    } else {
      // iterate over dialects
      for (let j = 1; j < language.length; j++) {
        const option = document.createElement("option");
        option.value = language[j][0];
        if (option.value === "en-US") {
          option.selected = true;
        }
        option.innerHTML = `${language[0]} (${language[j][1]})`;
        select.appendChild(option);
      }
    }
  }
}
