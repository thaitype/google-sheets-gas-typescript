const hooks: AutoIdColumnOption[] = [];

interface AutoIdColumnOption {
  checkColumn: number;
  idColumn: number;
  startRow: number;
}
/**
 * Enable auto id column on sheet
 * @param checkColumn number
 * @param idColumn number
 *
 * @example `registerAutoIdColumn(COLUMN(B2), COLUMN(A2),ROW(A4))`
 */
function registerAutoIdColumn(checkColumn: unknown, idColumn: unknown, startRow: unknown) {
  validateNumber(checkColumn, 'Check column');
  validateNumber(idColumn, 'ID column');
  validateNumber(startRow, 'Start row');
  const sheet = getActiveSheet();
  logger(`Enabling auto id column on sheet name '${sheet.name}' (id: ${sheet.id})`);

  hooks.push({
    checkColumn,
    idColumn,
    startRow,
  });
}

function SampleFunctionForCellReference(cellRef: unknown) {
  validateString(cellRef, 'Cell reference');
  logger(`=> ${getCellValue(cellRef)}`);
}

function getCellValue(cellReference: string) {
  if (!isValidA1Notation(cellReference))
    throw new Error('Please provide a valid single-cell reference as a parameter.');
  // Convert the cell reference to a range
  var range = SpreadsheetApp.getActiveSpreadsheet().getRange(cellReference);

  // Check if the range is a single cell
  if (range.getNumRows() !== 1 || range.getNumColumns() !== 1) {
    throw new Error('Please provide a valid single-cell reference as a parameter.');
  }
  return range.getValue();
}
