interface EnsureColumnCorrectHookOption extends HookOptionBase, ColumnModifier {
  type: 'ensureColumnCorrect';
  sourceSheetId: number;
  source: ColumnModifier;
}

/**
 * ensure Column Correct
 * @param {number} checkColumn target Column
 * @param {number} idColumn uuid Column
 * @param {number} startRow start Row
 * @param {number} sourceCheckColumn source target Column
 * @param {number} sourceIdColumn source uuid Column
 * @param {number} sourceStartRow source start Row
 * @param {string} sourceSheetId source Sheet ID (optional)
 * @param {string} _hookId hook ID (optional)
 * @return {string} Status message
 *
 * @customfunction
 */
function ensureColumnCorrect(
  checkColumn: unknown,
  idColumn: unknown,
  startRow: unknown,
  sourceCheckColumn: unknown,
  sourceIdColumn: unknown,
  sourceStartRow: unknown,
  _sourceSheetId?: number,
  _hookId?: string
) {
  validateNumber(checkColumn, 'checkColumn');
  validateNumber(idColumn, 'idColumn');
  validateNumber(startRow, 'startRow');
  validateNumber(sourceCheckColumn, 'sourceCheckColumn');
  validateNumber(sourceIdColumn, 'sourceIdColumn');
  validateNumber(sourceStartRow, 'sourceStartRow');
  const sheet = getActiveSheet();
  const sourceSheetId = _sourceSheetId ?? sheet.id;
  const hookId = _hookId ?? `ensureColumnCorrect-${sheet.id}-${checkColumn}-${idColumn}-${startRow}`;
  logger(`Enabled ensure column correct on Key='${hookId}' sheet name '${sheet.name}' (id: ${sheet.id})`);
  setHooks(
    hookId,
    JSON.stringify({
      type: 'ensureColumnCorrect',
      sheet,
      checkColumn,
      idColumn,
      startRow,
      sourceSheetId,
      source: {
        checkColumn: sourceCheckColumn,
        idColumn: sourceIdColumn,
        startRow: sourceStartRow,
      },
    } satisfies EnsureColumnCorrectHookOption)
  );
  return `Enabled ensure column correct on Column ${idColumn} start from Row ${startRow}`;
}

function registerEnsureColumnCorrect(e: GoogleAppsScript.Events.SheetsOnEdit, hook: EnsureColumnCorrectHookOption) {
  logger(`Registering ensure column correct on At=${e.range.getA1Notation()}, ${JSON.stringify(hook)}`);
  const sourceSheet = getSheetById(hook.sourceSheetId);
  invariant(sourceSheet, `Source sheet not found. ID: ${hook.sourceSheetId}`);

  const sourceIdColumnData: string[] = (
    sourceSheet
      .getRange(hook.source.startRow, hook.source.idColumn, sourceSheet.getLastRow(), 1)
      .getValues() as string[][]
  ).map(row => row[0]);
  const sourceCheckColumnData: string[] = (
    sourceSheet
      .getRange(hook.source.startRow, hook.source.checkColumn, sourceSheet.getLastRow(), 1)
      .getValues() as string[][]
  ).map(row => row[0]);

  if (e.range.getColumn() == hook.checkColumn && e.value != '') {
    logger(`In range, changed range: ${e.range.getA1Notation()}`);
    let sheet = e.source.getSheetByName(hook.sheet.name);
    invariant(sheet, `Sheet '${hook.sheet.name}' not found`);
    const sourceId = sourceIdColumnData[sourceCheckColumnData.indexOf(e.value)];
    addDataToRow(sheet, hook, sourceId, e.range.getRow());
  } else {
    logger(`Out of range, changed range: ${e.range.getA1Notation()}`);
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
function addDataToRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  { idColumn, startRow }: ColumnModifier,
  data: string,
  targetRow: number
) {
  if (targetRow < startRow) {
    return;
  }
  sheet.getRange(targetRow, idColumn).setValue(data);
  logger(`Added Data '${data}' to row ${targetRow}`);
}
