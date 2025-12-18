/**
 * QuickRx Voice Assistant Sync Script
 * 1. Open your Google Sheet
 * 2. Go to Extensions -> Apps Script
 * 3. Delete any existing code and paste this script
 * 4. Update the CONFIG object with your Vercel URL and Sync Token
 */

const CONFIG = {
    VERCEL_URL: "https://your-app-name.vercel.app/api/sync",
    SYNC_TOKEN: "quickrx_sync_safe_token_2025" // Must match your .env SYNC_TOKEN
};

function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('QuickRx Dashboard')
        .addItem('Sync All Records', 'syncAllRecords')
        .addToUi();
}

/**
 * Triggers automatically when a row is added or changed
 */
function onEdit(e) {
    const row = e.range.getRow();
    if (row > 1) { // Skip header
        syncRow(row);
    }
}

function syncRow(row) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

    const payload = {};
    headers.forEach((header, index) => {
        payload[header.replace(/\s+/g, '_')] = data[index];
    });

    const options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload),
        "headers": {
            "Authorization": "Bearer " + CONFIG.SYNC_TOKEN
        },
        "muteHttpExceptions": true
    };

    try {
        const response = UrlFetchApp.fetch(CONFIG.VERCEL_URL, options);
        console.log("Sync row " + row + ": " + response.getContentText());
    } catch (err) {
        console.error("Sync error: " + err.message);
    }
}

function syncAllRecords() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();

    for (let i = 2; i <= lastRow; i++) {
        syncRow(i);
        Utilities.sleep(100); // Small delay to avoid hitting rate limits
    }

    SpreadsheetApp.getUi().alert('Sync complete for ' + (lastRow - 1) + ' records.');
}
