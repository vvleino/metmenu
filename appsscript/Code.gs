// 1. Serves the HTML frontend when someone visits the web app URL
function doGet() {
    return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('MetMenu')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 2. Searches ALL sheets in the document for a specific query
function searchData(searchQuery) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets(); // Gets all tabs in the document

    let allResults = [];
    let mainHeaders = [];
    let isFirstSheet = true;

    // Loop through every sheet in the document
    sheets.forEach(sheet => {
        const data = sheet.getDataRange().getValues();

        // Skip completely empty tabs to prevent errors
        if (data.length === 0) return;

        // Assumes row 1 contains headers
        const headers = data[0];
        const rows = data.slice(1);

        // Set up the headers for the results table (only need to do this once)
        if (isFirstSheet) {
            // Add a 'Sheet Name' column to the front of the headers
            mainHeaders = ["Sheet Name", ...headers];
            isFirstSheet = false;
        }

        // Filter rows based on whether any cell matches the search query
        const filteredRows = rows.filter(row => {
            return row.some(cell => {
                return String(cell).toLowerCase().includes(searchQuery.toLowerCase());
            });
        });

        // Add the specific sheet's name to the beginning of each matched row
        const rowsWithSheetName = filteredRows.map(row => [sheet.getName(), ...row]);

        // Combine this sheet's results with the master list
        allResults = allResults.concat(rowsWithSheetName);
    });

    return {
        headers: mainHeaders,
        results: allResults
    };
}
