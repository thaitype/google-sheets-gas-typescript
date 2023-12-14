interface AutoIdColumnOption {
  type: 'autoIdColumn';
  checkColumn: number;
  idColumn: number;
  startRow: number;
}

/**
 * Enable auto id column on sheet
 * @param checkColumn number
 * @param idColumn number
 *
 * @example `enableAutoIdColumn(COLUMN(B2), COLUMN(A2),ROW(A4))`
 */
function enableAutoIdColumn(checkColumn: unknown, idColumn: unknown, startRow: unknown) {
  validateNumber(checkColumn, 'Check column');
  validateNumber(idColumn, 'ID column');
  validateNumber(startRow, 'Start row');
  const sheet = getActiveSheet();
  const message = `Enabled auto id column on sheet name '${sheet.name}' (id: ${sheet.id})`;
  logger(message);
  hooks.setProperty(sheet.name, JSON.stringify(sheet));
  return message;
}

function registerAutoIdColumn(e: GoogleAppsScript.Events.SheetsOnEdit, hook: Omit<AutoIdColumnOption, 'type'>) {
  logger(`Registering auto id column on sheet name`);
}
