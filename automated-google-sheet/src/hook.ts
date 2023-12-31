type Hook = AutoIdColumnHookOption | EnsureColumnCorrectHookOption;

interface HookOptionBase {
  type: string;
  sheet: Sheet;
}

interface ColumnModifier {
  checkColumn: number;
  idColumn: number;
  startRow: number;
}

class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

/**
 * Register manual trigger
 * https://developers.google.com/apps-script/guides/triggers/installable#manage_triggers_manually
 */
function registerHooks(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const hookData = getHooks();
  logger(`Registering hooks, length: ${Object.entries(hookData).length}`);
  for (const [key, hook] of Object.entries(hookData)) {
    let sheet = e.source.getSheetByName(hook.sheet.name);
    if (sheet === null) {
      removeHook(key);
      continue;
    }
    logger(`Registering hook: ${key}, on sheet ${hook.sheet.name} (#${hook.sheet.id}), type: ${hook.type} `);
    switch (hook.type) {
      case 'autoIdColumn':
        registerAutoIdColumn(e, hook);
        break;
      case 'ensureColumnCorrect':
        registerEnsureColumnCorrect(e, hook);
        break;
      default:
        throw new UnreachableCaseError(hook);
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
  return 'Hooks reset';
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
  return `Hook '${key}' removed`;
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
  if (Object.entries(hookData).length === 0) return [['No hooks found', '']];
  logger(`Listing hooks, length: ${Object.entries(hookData).length}`);
  const result: string[][] = [];
  for (const [key, hook] of Object.entries(hookData)) {
    result.push([key, JSON.stringify(hook)]);
    logger(`Hook: ${key}, on sheet ${hook.sheet.name} (#${hook.sheet.id}), type: ${hook.type} `);
  }
  return result;
}

/**
 * Get a Hook by ID
 * @param id
 * @returns {string[][]} hooks with the specified ID
 * @customfunction
 */
function getHook(id: string): string[][] {
  const hookData = getHooks();
  const hook = hookData[id];
  if (!hook) return [['Hook not found', '']];
  const result: string[][] = [];
  result.push(['id', id]);
  for (const [key, value] of Object.entries(hook)) {
    result.push([key, JSON.stringify(value)]);
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
  for (const [key, value] of Object.entries(props)) {
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
  return 'Script Props reset';
}
