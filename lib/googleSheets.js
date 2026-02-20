import { google } from "googleapis";

/**
 * Returns an authenticated Google Sheets client.
 * Uses a Service Account for server-to-server auth — no OAuth flow needed.
 */
function getSheetsClient() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    if (!privateKey || !clientEmail) {
        throw new Error(
            "Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in your environment."
        );
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
}

/**
 * Ensures the header row exists in the sheet. Safe to call on every registration —
 * it only writes headers if row 1 is empty.
 */
async function ensureHeaders(sheets, spreadsheetId) {
    const range = "Registrations!A1:N1";
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const existingValues = response.data.values;
    if (!existingValues || existingValues.length === 0 || !existingValues[0][0]) {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[
                    "Timestamp",
                    "Name",
                    "Email",
                    "College / Institution",
                    "Phone",
                    "Event(s)",
                    "Team Size",
                    "Member 2 – Name",
                    "Member 2 – Email",
                    "Member 3 – Name",
                    "Member 3 – Email",
                    "Member 4 – Name",
                    "Member 4 – Email",
                    "Member 5 – Name",
                    "Member 5 – Email",
                    "Member 6 – Name",
                    "Member 6 – Email",
                ]],
            },
        });
    }
}

/**
 * Appends one registration row to the Google Sheet.
 *
 * @param {Object} data
 * @param {string} data.timestamp   – ISO 8601 timestamp
 * @param {string} data.name        – Team leader's full name
 * @param {string} data.email       – Team leader's email
 * @param {string} data.college     – College / institution
 * @param {string} data.phone       – Phone number
 * @param {string} data.events      – Comma-separated event titles
 * @param {number} data.teamSize    – Total number of members including leader
 * @param {Array}  data.teamMembers – Array of { name, email } for members 2–6
 */
export async function appendToSheet(data) {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
        throw new Error(
            "Missing GOOGLE_SPREADSHEET_ID environment variable."
        );
    }

    const sheets = getSheetsClient();
    await ensureHeaders(sheets, spreadsheetId);

    // Build extra member columns (up to 5 additional members = 10 columns)
    const memberColumns = [];
    for (let i = 0; i < 5; i++) {
        const member = data.teamMembers[i];
        memberColumns.push(member?.name?.trim() || "");
        memberColumns.push(member?.email?.trim() || "");
    }

    const row = [
        data.timestamp,
        data.name,
        data.email,
        data.college,
        data.phone,
        data.events,
        data.teamSize,
        ...memberColumns,
    ];

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Registrations!A:Q",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
            values: [row],
        },
    });
}
