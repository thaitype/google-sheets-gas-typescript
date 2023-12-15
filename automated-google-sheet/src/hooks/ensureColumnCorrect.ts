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
}
