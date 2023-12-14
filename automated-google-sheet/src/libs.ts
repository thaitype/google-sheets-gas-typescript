

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
