/**
 * Global variables
 */
/**
 * https://developers.google.com/apps-script/reference/properties/properties-service
 * https://developers.google.com/apps-script/guides/properties
 */
const hooks = PropertiesService.getScriptProperties();
// hooks.deleteAllProperties();

/**
 * The event handler triggered when editing the spreadsheet.
 * @param {Event} e The onEdit event.
 * @see https://developers.google.com/apps-script/guides/triggers#onedite
 * https://developers.google.com/apps-script/guides/triggers/events#edit
 */
function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit){
  registerHooks(e, hooks);
}

/**
 * Reset Hooks
 * @customfunction
 */
function resetHooks(){
  hooks.deleteAllProperties();
}