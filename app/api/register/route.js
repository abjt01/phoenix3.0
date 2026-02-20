import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/googleSheets";
import { events } from "@/data/events";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (resets on cold start / server restart).
// For production at scale, swap this for an upstash-redis or similar solution.
// ---------------------------------------------------------------------------
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateLimitStore.get(ip) ?? { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

    if (now > entry.resetAt) {
        entry.count = 1;
        entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
    } else {
        entry.count += 1;
    }

    rateLimitStore.set(ip, entry);
    return entry.count > MAX_REQUESTS_PER_WINDOW;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

function validateBody(body) {
    const { name, email, college, phone, teamSize, selectedEvents, teamMembers } = body;

    if (!name?.trim()) return "Full name is required.";
    if (!email?.trim()) return "Email address is required.";
    if (!EMAIL_RE.test(email.trim())) return "Please enter a valid email address.";
    if (!college?.trim()) return "College / institution is required.";
    if (!phone?.trim()) return "Phone number is required.";
    if (!PHONE_RE.test(phone.trim())) return "Please enter a valid phone number (7–20 digits).";

    if (!Array.isArray(selectedEvents) || selectedEvents.length === 0)
        return "Please select at least one event.";

    const teamSizeNum = parseInt(teamSize, 10);
    if (isNaN(teamSizeNum) || teamSizeNum < 1) return "Invalid team size.";

    // Validate each selected event
    for (const slug of selectedEvents) {
        const event = events.find((e) => e.slug === slug);
        if (!event) return `Unknown event: "${slug}".`;

        if (teamSizeNum < event.minTeamSize || teamSizeNum > event.maxTeamSize) {
            const range =
                event.minTeamSize === event.maxTeamSize
                    ? `exactly ${event.minTeamSize}`
                    : `between ${event.minTeamSize} and ${event.maxTeamSize}`;
            return `"${event.title}" requires ${range} member${event.maxTeamSize > 1 ? "s" : ""}. Adjust your team size.`;
        }
    }

    // Validate additional team members when team size > 1
    if (teamSizeNum > 1) {
        const members = Array.isArray(teamMembers) ? teamMembers : [];
        const expectedExtras = teamSizeNum - 1;

        if (members.length < expectedExtras)
            return `Please provide details for all ${expectedExtras} additional team member${expectedExtras > 1 ? "s" : ""}.`;

        for (let i = 0; i < expectedExtras; i++) {
            const m = members[i];
            if (!m?.name?.trim()) return `Name for team member ${i + 2} is required.`;
            if (!m?.email?.trim()) return `Email for team member ${i + 2} is required.`;
            if (!EMAIL_RE.test(m.email.trim()))
                return `Please enter a valid email for team member ${i + 2}.`;
            if (!m?.phone?.trim()) return `Phone number for team member ${i + 2} is required.`;
            if (!PHONE_RE.test(m.phone.trim()))
                return `Please enter a valid phone number for team member ${i + 2}.`;
        }
    }

    return null; // no error
}

// ---------------------------------------------------------------------------
// POST /api/register
// ---------------------------------------------------------------------------
export async function POST(request) {
    // 1. Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a minute and try again." },
            { status: 429 }
        );
    }

    // 2. Parse body
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // 3. Validate
    const validationError = validateBody(body);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { name, email, college, phone, teamSize, selectedEvents, teamMembers } = body;
    const teamSizeNum = parseInt(teamSize, 10);

    // 4. Write to Google Sheets
    try {
        const eventTitles = selectedEvents
            .map((slug) => events.find((e) => e.slug === slug)?.title ?? slug)
            .join(", ");

        await appendToSheet({
            timestamp: new Date().toISOString(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            college: college.trim(),
            phone: phone.trim(),
            events: eventTitles,
            teamSize: teamSizeNum,
            teamMembers: Array.isArray(teamMembers) ? teamMembers.slice(0, teamSizeNum - 1) : [],
        });

        return NextResponse.json(
            { success: true, message: "Registration successful! Check your email for confirmation." },
            { status: 200 }
        );
    } catch (err) {
        console.error("[/api/register] Google Sheets error:", err);
        return NextResponse.json(
            { error: "Registration could not be saved. Please try again or contact the organizers." },
            { status: 500 }
        );
    }
}

// Reject non-POST methods
export async function GET() {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
