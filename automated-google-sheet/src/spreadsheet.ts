function getActiveSpreadsheetName(): string {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSpreadsheetName = activeSpreadsheet.getName();
  return activeSpreadsheetName;
}

function getSheetById(sheetId: number): GoogleAppsScript.Spreadsheet.Sheet | null {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() == sheetId) {
      return sheets[i];
    }
  }

  // Return null if the sheet ID is not found
  return null;
}

function prettyPrintRange(range: GoogleAppsScript.Spreadsheet.Range) {
  var numRows = range.getNumRows();
  var numCols = range.getNumColumns();
  var values = range.getValues();
  
  var output = "Range values:\n";
  
  for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {
      output += values[row][col] + "\t";
    }
    output += "\n";
  }
  
  return output;
}
// --------------------

interface Sheet {
  name: string;
  id: number;
}

function getActiveSheet(): Sheet {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  return {
    name: activeSheet.getName(),
    id: activeSheet.getSheetId(),
  };
}

function getAllSheets(): Sheet[] {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  return sheets.map(sheet => ({
    name: sheet.getName(),
    id: sheet.getSheetId(),
  }));
}

// function getSheetById(id: number) {
//   return getAllSheets().find(sheet => sheet.id === id);
// }

// function getSheetByName(name: string) {
//   return getAllSheets().find(sheet => sheet.name === name);
// }
