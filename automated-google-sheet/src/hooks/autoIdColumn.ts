interface AutoIdColumnHookOption extends HookOptionBase {
  type: 'autoIdColumn';
  checkColumn: number;
  idColumn: number;
  startRow: number;
}

/**
 * Enable auto id column on sheet
 * @param checkColumn number The Column Number, which using for checking the column if it is not empty, then generate UUID on the ID column
 * @param idColumn number The Column Number, which using for generate UUID
 * @param startRow number The Row Number, which using for start generate UUID
 * @param _hookId string The Hook ID, which using for identify the hook (Optional)
 *
 * @example `enableAutoIdColumn(COLUMN(B2), COLUMN(A2),ROW(A4))`
 * @customfunction
 */
function enableAutoIdColumn(checkColumn: unknown, idColumn: unknown, startRow: unknown, _hookId?: string) {
  validateNumber(checkColumn, 'Check column');
  validateNumber(idColumn, 'ID column');
  validateNumber(startRow, 'Start row');
  const sheet = getActiveSheet();
  const defaultHookId = `autoIdColumn-${sheet.id}-${checkColumn}-${idColumn}-${startRow}`;
  const hookId = _hookId ?? defaultHookId;
  validateString(hookId, 'Hook ID');
  logger(`Enabled auto id column on Key='${hookId}' sheet name '${sheet.name}' (id: ${sheet.id})`);
  setHooks(
    hookId,
    JSON.stringify({
      type: 'autoIdColumn',
      sheet,
      checkColumn,
      idColumn,
      startRow,
    } satisfies AutoIdColumnHookOption)
  );
  return `Enabled Auto Generated ID on Column ${idColumn} start from Row ${startRow} when Column ${checkColumn} is not empty`;
}

function registerAutoIdColumn(e: GoogleAppsScript.Events.SheetsOnEdit, hook: AutoIdColumnHookOption) {
  logger(`Registering auto id column on At=${e.range.getA1Notation()}, ${JSON.stringify(hook)}`);
  let sheet = e.source.getSheetByName(hook.sheet.name);
  invariant(sheet, `Sheet '${hook.sheet.name}' not found`);

  // Check if the edited cell is in the specified target column and is not empty
  if (e.range.getColumn() == hook.checkColumn && e.value != '') {
    addUUIDsToEmptyRows(sheet, hook);
  }
}

/**
 * add UUIDs To Empty Rows
 *
 * @param {number} checkColumn target Column
 * @param {number} idColumn uuid Column
 * @return void
 */
// Function to add UUIDs to empty rows in the specified target column
function addUUIDsToEmptyRows(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  { checkColumn, idColumn, startRow }: AutoIdColumnHookOption
) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(startRow, checkColumn, lastRow - 1); // Start from the `startRow` row
  var uuidRange = sheet.getRange(startRow, idColumn, lastRow - 1);

  var targetValues = range.getValues();
  var uuidValues = uuidRange.getValues();

  for (var i = 0; i < targetValues.length; i++) {
    if (targetValues[i][0] !== '' && uuidValues[i][0] === '') {
      // If the target cell is empty and the UUID cell is empty, add a UUID to the UUID column
      sheet.getRange(i + startRow, idColumn).setValue(uuid());
      logger(`Added UUID to row ${i + startRow}`);
    }
  }
}
