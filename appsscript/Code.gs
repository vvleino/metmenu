// MetMenu JSON API.
// Deployed as a web app (Execute as: Me, Who has access: Anyone), this returns
// the full contents of every tab in the bound spreadsheet as JSON:
//   { generatedAt, headers: ["Sheet Name", ...row-1 headers], rows: [[sheetName, ...cells], ...] }
// The PWA fetches this once and does all searching client-side.
function doGet() {
    const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

    let headers = [];
    let rows = [];

    sheets.forEach(sheet => {
        // Display values: the formatted strings the user sees in the sheet,
        // so numbers/dates serialize predictably.
        const data = sheet.getDataRange().getDisplayValues();
        if (data.length === 0) return;

        // Row 1 of each tab is its header row; all tabs are assumed to share
        // the first non-empty tab's column layout.
        if (headers.length === 0) {
            headers = ["Sheet Name", ...data[0]];
        }

        const sheetName = sheet.getName();
        data.slice(1).forEach(row => {
            rows.push([sheetName, ...row]);
        });
    });

    const payload = {
        generatedAt: new Date().toISOString(),
        headers: headers,
        rows: rows
    };

    return ContentService
        .createTextOutput(JSON.stringify(payload))
        .setMimeType(ContentService.MimeType.JSON);
}
