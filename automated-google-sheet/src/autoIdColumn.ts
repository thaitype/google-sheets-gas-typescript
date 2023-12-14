interface AutoIdColumnHookOption extends HookOptionBase {
  type: 'autoIdColumn';
  checkColumn: number;
  idColumn: number;
  startRow: number;
}

/**
 * Enable auto id column on sheet
 * @param hookId string
 * @param checkColumn number
 * @param idColumn number
 * @param startRow number
 *
 * @example `enableAutoIdColumn(COLUMN(B2), COLUMN(A2),ROW(A4))`
 * @customfunction
 */
function enableAutoIdColumn(hookId: unknown, checkColumn: unknown, idColumn: unknown, startRow: unknown) {
  validateString(hookId, 'Hook ID');
  validateNumber(checkColumn, 'Check column');
  validateNumber(idColumn, 'ID column');
  validateNumber(startRow, 'Start row');
  const sheet = getActiveSheet();
  const message = `Enabled auto id column on sheet name '${sheet.name}' (id: ${sheet.id})`;
  logger(message);
  hooks.setProperty(hookId, JSON.stringify({
    type: 'autoIdColumn',
    sheet,
    checkColumn,
    idColumn,
    startRow,
  } satisfies AutoIdColumnHookOption));
  return message;
}

function registerAutoIdColumn(e: GoogleAppsScript.Events.SheetsOnEdit, hook: AutoIdColumnHookOption) {
  logger(`Registering auto id column on At=${e.range.getA1Notation()}, ${JSON.stringify(hook)}`);
}
