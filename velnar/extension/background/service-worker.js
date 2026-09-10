importScripts("../utils/constants.js", "../themes/presets.js", "../utils/validator.js", "../utils/storage.js");
VELNAR.Storage.isWriter = true;

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.type !== "velnar:settings") return;
  if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(""))) {
    respond({ ok: false, error: "Settings can only be changed from VELNAR." });
    return;
  }
  VELNAR.Storage._commit(message.action, message.payload).then(
    settings => respond({ ok: true, settings }),
    error => respond({ ok: false, error: error.message })
  );
  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  // A no-op patch also migrates the old key without resetting preferences.
  VELNAR.Storage.set({}).catch(console.error);
});

chrome.commands.onCommand.addListener(command => {
  if (command === "toggle-extension") VELNAR.Storage.toggle("enabled").catch(console.error);
  if (command === "random-theme") VELNAR.Storage.randomTheme().catch(console.error);
});
