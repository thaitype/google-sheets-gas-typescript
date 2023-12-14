function getActiveSpreadsheetName() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSpreadsheetName = activeSpreadsheet.getName();
  return activeSpreadsheetName;
}

function getActiveSheet() {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  return {
    name: activeSheet.getName(),
    id: activeSheet.getSheetId(),
  };
}
