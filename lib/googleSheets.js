import { google } from "googleapis";

/**
 * Returns an authenticated Google Sheets client.
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
 * Default headers written to row 1 if the sheet is empty.
 * Edit this list to add/remove columns — the rest of the code adapts automatically.
 */
const DEFAULT_HEADERS = [
    "Reg No",
    "Name",
    "Email",
    "Phone",
    "College / Institution",
    "Event(s)",
    "Team Size",
    "Role",
];

/**
 * Reads row 1 of the sheet and returns a map of { headerName → columnIndex (0-based) }.
 * If row 1 is empty, writes DEFAULT_HEADERS first.
 */
async function getHeaderMap(sheets, spreadsheetId) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Registrations!1:1",
    });

    let headers = response.data.values?.[0] ?? [];

    // Auto-create headers if row 1 is empty
    if (headers.length === 0) {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: "Registrations!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [DEFAULT_HEADERS] },
        });
        headers = DEFAULT_HEADERS;
    }

    const map = {};
    headers.forEach((header, idx) => {
        map[header.trim()] = idx;
    });
    return map;
}

/**
 * Returns the next registration number as a zero-padded 3-digit string ("001", "002", …).
 * Counts existing data rows (everything after the header row).
 */
async function getNextRegNumber(sheets, spreadsheetId) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Registrations!A:A",
    });

    const rows = response.data.values ?? [];
    // rows[0] is the header row; every row after that is a data row.
    // Each registration can span multiple rows (one per member), so we count
    // unique reg numbers rather than raw row count.
    const dataRows = rows.slice(1).map((r) => r[0]).filter(Boolean);
    const uniqueRegs = new Set(dataRows);
    const nextNum = uniqueRegs.size + 1;
    return String(nextNum).padStart(3, "0");
}

/**
 * Builds a sparse row array sized to fit all columns,
 * placing each value in the column index matching its header name.
 *
 * @param {Object} headerMap   – { headerName → 0-based column index }
 * @param {Object} data        – { headerName → value }
 * @returns {Array}            – Array ready to send to the Sheets API
 */
function buildRow(headerMap, data) {
    const totalCols = Math.max(...Object.values(headerMap)) + 1;
    const row = Array(totalCols).fill("");

    for (const [key, value] of Object.entries(data)) {
        const idx = headerMap[key];
        if (idx !== undefined) {
            row[idx] = value ?? "";
        }
    }

    return row;
}

/**
 * Appends one registration to the Google Sheet.
 * - Team leader gets one row (with College, Event(s), Team Size, Role = "Leader")
 * - Each additional member gets their own row (with Role = "Member"), same Reg No
 * - No timestamp
 *
 * @param {Object} data
 * @param {string} data.name        – Team leader's full name
 * @param {string} data.email       – Team leader's email
 * @param {string} data.college     – College / institution
 * @param {string} data.phone       – Team leader's phone
 * @param {string} data.events      – Comma-separated event titles
 * @param {number} data.teamSize    – Total number of members including leader
 * @param {Array}  data.teamMembers – Array of { name, email, phone } for members 2+
 */
export async function appendToSheet(data) {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
        throw new Error("Missing GOOGLE_SPREADSHEET_ID environment variable.");
    }

    const sheets = getSheetsClient();

    // Fetch headers and registration number in parallel
    const [headerMap, regNo] = await Promise.all([
        getHeaderMap(sheets, spreadsheetId),
        getNextRegNumber(sheets, spreadsheetId),
    ]);

    // ── Leader row ──────────────────────────────────────────────
    const leaderRow = buildRow(headerMap, {
        "Reg No": regNo,
        "Name": data.name,
        "Email": data.email,
        "Phone": data.phone,
        "College / Institution": data.college,
        "Event(s)": data.events,
        "Team Size": data.teamSize,
        "Role": "Leader",
    });

    // ── Member rows (one per additional team member) ─────────────
    const memberRows = (data.teamMembers ?? []).map((m) =>
        buildRow(headerMap, {
            "Reg No": regNo,
            "Name": m.name?.trim() ?? "",
            "Email": m.email?.trim() ?? "",
            "Phone": m.phone?.trim() ?? "",
            "Role": "Member",
        })
    );

    // ── Append all rows in a single API call ─────────────────────
    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Registrations!A:Z",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
            values: [leaderRow, ...memberRows],
        },
    });
}
