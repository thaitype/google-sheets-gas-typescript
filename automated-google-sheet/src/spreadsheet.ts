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
