type Hook = AutoIdColumnHookOption;

interface HookOptionBase {
  type: string;
  sheet: Sheet;
}

function registerHooks(e: GoogleAppsScript.Events.SheetsOnEdit, hooks: GoogleAppsScript.Properties.Properties) {
  const hookData = hooks.getProperties();
  logger(`Registering hooks, length: ${Object.entries(hookData).length}`);
  for (const [key, _hook] of Object.entries(hookData)) {
    const hook = JSON.parse(_hook) as Hook;
    let sheet = e.source.getSheetByName(hook.sheet.name);
    if(sheet === null) {
      hooks.deleteProperty(key);
      continue;
    }
    logger(`Registering hook: ${key}, on sheet ${hook.sheet.name} (#${hook.sheet.id}), type: ${hook.type} `);
    switch (hook.type) {
      case 'autoIdColumn':
        registerAutoIdColumn(e, hook);
        break;
      default:
        throw new Error(`Unknown hook type: ${hook.type}`);
    }
  }
}

