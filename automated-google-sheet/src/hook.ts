type Hook = AutoIdColumnHookOption;

interface HookOptionBase {
  type: string;
  sheet: Sheet;
}

function registerHooks(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const hookData = getHooks();
  logger(`Registering hooks, length: ${Object.entries(hookData).length}`);
  for (const [key, hook] of Object.entries(hookData)) {
    let sheet = e.source.getSheetByName(hook.sheet.name);
    if(sheet === null) {
      removeHook(key);
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


// ---------------------------------------- Hook Utils ----------------------------------------

const ScriptPropsKey = {
  Hooks: 'hooks',
};

/**
 * Global variables
 * https://developers.google.com/apps-script/reference/properties/properties-service
 * https://developers.google.com/apps-script/guides/properties
 */
const scriptProps = PropertiesService.getScriptProperties();
if (scriptProps.getProperty(ScriptPropsKey.Hooks) === null) {
  scriptProps.setProperty(ScriptPropsKey.Hooks, '{}');
}

/**
 * Reset Hooks
 * @customfunction
 */
function resetHooks() {
  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.deleteProperty(ScriptPropsKey.Hooks);
}

/**
 * Set Hooks
 */
function setHooks(key: string, value: string) {
  const scriptProps = PropertiesService.getScriptProperties();
  const hooks = getHooks();
  hooks[key] = JSON.parse(value);
  scriptProps.setProperty(ScriptPropsKey.Hooks, JSON.stringify(hooks));
}

/**
 * Remove Hooks
 * @param {string} key
 * @customfunction
 */
function removeHook(key: string) {
  const scriptProps = PropertiesService.getScriptProperties();
  const hooks = getHooks();
  delete hooks[key];
  scriptProps.setProperty(ScriptPropsKey.Hooks, JSON.stringify(hooks));
}

/**
 * Get Hooks
 * @param {GoogleAppsScript.Properties.Properties} scriptProps
 * @returns {Hooks}
 */
function getHooks(): Record<string, Hook> {
  const scriptProps = PropertiesService.getScriptProperties();
  const hooks = scriptProps.getProperty(ScriptPropsKey.Hooks);
  logger(`Get hooks: ${hooks}`);
  if (!hooks) return {};
  return JSON.parse(hooks);
}

/**
 * List Hooks
 *
 * @returns {string[][]} list of hooks
 * @customfunction
 */
function listHooks(): string[][] {
  const hookData = getHooks();
  if(Object.entries(hookData).length === 0) return [['No hooks found', '']];
  logger(`Listing hooks, length: ${Object.entries(hookData).length}`);
  const result: string[][] = [];
  for(const [key, hook] of Object.entries(hookData)) {
    result.push([key, JSON.stringify(hook)]);
    logger(`Hook: ${key}, on sheet ${hook.sheet.name} (#${hook.sheet.id}), type: ${hook.type} `);
  }
  return result;
}


// ---------------------------------------- ScriptProps ----------------------------------------
/**
 * List Script Props
 *
 * @returns {string[][]} list of Script Props
 * @customfunction
 */
function listScriptProps(): string[][] {
  const props = PropertiesService.getScriptProperties().getProperties();
  const result: string[][] = [];
  for(const [key, value] of Object.entries(props)) {
    result.push([key, value]);
  }
  return result;
}

/**
 * Reset Script Props
 * @customfunction
 */
function resetScriptProps() {
  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.deleteAllProperties();
}