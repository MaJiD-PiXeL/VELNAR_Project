// in file mishe hameye const haye moshtarak beyne background/content/popup/options
// hame ja az hamin namespace estefade mikonim ke ba var haye khode github ghati nashe
globalThis.VELNAR = globalThis.VELNAR || {};

VELNAR.STORAGE_KEY = "velnar_settings_v1";

// laziste kamele css var ha. nesbat be ghabl kheili gostarde tar shode
// ta Theme Builder betune vaghean hame ja ro poshesh bede, na faghat rang haye asli
VELNAR.CSS_VAR_MAP = {
  background: "--gs-bg",
  backgroundSecondary: "--gs-bg-secondary",
  backgroundTertiary: "--gs-bg-tertiary",
  hoverBackground: "--gs-hover-bg",
  activeBackground: "--gs-active-bg",
  textPrimary: "--gs-text-primary",
  textSecondary: "--gs-text-secondary",
  textTertiary: "--gs-text-tertiary",
  link: "--gs-link",
  linkHover: "--gs-link-hover",
  button: "--gs-button",
  buttonText: "--gs-button-text",
  buttonHover: "--gs-button-hover",
  border: "--gs-border",
  borderMuted: "--gs-border-muted",
  codeBackground: "--gs-code-bg",
  codeText: "--gs-code-text",
  repoBackground: "--gs-repo-bg",
  sidebarBackground: "--gs-sidebar-bg",
  navbarBackground: "--gs-navbar-bg",
  navbarText: "--gs-navbar-text",
  dropdownBackground: "--gs-dropdown-bg",
  tooltipBackground: "--gs-tooltip-bg",
  scrollbarThumb: "--gs-scrollbar-thumb",
  accent: "--gs-accent",
  accentSecondary: "--gs-accent2",
  success: "--gs-success",
  warning: "--gs-warning",
  error: "--gs-error",
  shadow: "--gs-shadow"
};

// har component chand css selector daare. in map to injector.js estefade mishe
// ta user betune har bakhsh ro joda joda khamush/roshan kone
VELNAR.COMPONENTS = [
  { id: "navbar", label: "Navbar" },
  { id: "sidebar", label: "Sidebar" },
  { id: "repoCards", label: "Repository Cards" },
  { id: "buttons", label: "Buttons" },
  { id: "inputs", label: "Inputs" },
  { id: "searchBox", label: "Search Box" },
  { id: "codeBlocks", label: "Code Blocks" },
  { id: "markdown", label: "Markdown" },
  { id: "issues", label: "Issues" },
  { id: "pullRequests", label: "Pull Requests" },
  { id: "profile", label: "Profile" },
  { id: "followers", label: "Followers/Following" },
  { id: "notifications", label: "Notifications" },
  { id: "commitList", label: "Commit List" },
  { id: "fileExplorer", label: "File Explorer" },
  { id: "dropdowns", label: "Dropdowns & Menus" },
  { id: "diffs", label: "Diffs & Code Review" },
  { id: "contributionGraph", label: "Contribution Graph" }
];


function gsDefaultComponentOverrides() {
  const out = {};
  VELNAR.COMPONENTS.forEach((c) => (out[c.id] = true));
  return out;
}

// default settings, age chizi to storage nabud az hamin estefade mishe
VELNAR.DEFAULT_SETTINGS = {
  enabled: true,
  activeThemeId: "dark",
  customThemeApplied: false,
  autoDarkMode: false,
  autoDarkModeLightTheme: "light",
  autoDarkModeDarkTheme: "dark",
  animationsEnabled: false,
  webSwingerEnabled: false,
  favoriteThemeIds: [],
  typography: {
    fontFamily: "",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 400,
    codeFont: ""
  },
  layout: {
    borderRadius: 8,
    shadowIntensity: 30 // 0 to 100
  },
  componentOverrides: gsDefaultComponentOverrides(),
  customCss: "",
  customCssEnabled: false,
  customTheme: null // vaghti user theme khodesho misaze mire injaa
};

VELNAR.STYLE_TAG_ID = "velnar-theme-vars";
VELNAR.CUSTOM_CSS_TAG_ID = "velnar-custom-css";
VELNAR.TYPOGRAPHY_TAG_ID = "velnar-typography";
VELNAR.COMPONENTS_TAG_ID = "velnar-components";
VELNAR.ANIMATIONS_TAG_ID = "velnar-animations";
VELNAR.WEB_SWINGER_STYLE_ID = "velnar-web-swinger-style";
VELNAR.WEB_SWINGER_ELEMENT_ID = "velnar-web-swinger";
