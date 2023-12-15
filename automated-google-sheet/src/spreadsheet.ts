function getActiveSpreadsheetName() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSpreadsheetName = activeSpreadsheet.getName();
  return activeSpreadsheetName;
}

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

function getSheetById(id: number) {
  return getAllSheets().find(sheet => sheet.id === id);
}

function getSheetByName(name: string) {
  return getAllSheets().find(sheet => sheet.name === name);
}