type Hook = AutoIdColumnOption;

function registerHooks(e: GoogleAppsScript.Events.SheetsOnEdit, hooks: GoogleAppsScript.Properties.Properties) {
  const hookData = hooks.getProperties();
  logger(`Registering hooks, length: ${Object.entries(hookData).length}`);
  for (const hook of Object.entries(hookData)) {
    logger(`Registering hook: ${hook[0]}, ${hook[1]}`);
  }
}
