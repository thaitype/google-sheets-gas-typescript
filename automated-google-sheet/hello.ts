const greeter = (person: string) => {
  return `Hello, ${person}!`;
};

function testGreeter() {
  const user = "Grant --";
  Logger.log(greeter(user));
}

/**
 * The event handler triggered when editing the spreadsheet.
 * @param {Event} e The onEdit event.
 * @see https://developers.google.com/apps-script/guides/triggers#onedite
 * https://developers.google.com/apps-script/guides/triggers/events#edit
 */
function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit){
  // Set a comment on the edited cell to indicate when it was changed.
  var range = e.range;
  range.setNote('Last modified: ' + new Date());
}