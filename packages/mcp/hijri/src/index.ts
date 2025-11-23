#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import moment from "moment-hijri";

// Initialize Server
const server = new Server(
    {
        name: "buraq-hijri",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Tools Definition
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "convert_to_hijri",
                description: "Convert a Gregorian date to Hijri date. Use this to know the current Islamic date.",
                inputSchema: {
                    type: "object",
                    properties: {
                        date: { type: "string", description: "Date in YYYY-MM-DD format (default is today)" },
                    },
                },
            },
            {
                name: "get_islamic_holidays",
                description: "Get dates for upcoming Islamic holidays (Ramadan, Eid) for a given Hijri year.",
                inputSchema: {
                    type: "object",
                    properties: {
                        year: { type: "number", description: "Hijri Year (e.g., 1446)" },
                    },
                },
            },
        ],
    };
});

// Handle Call Tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "convert_to_hijri") {
        const dateStr = args?.date ? String(args.date) : undefined;
        const date = dateStr ? moment(dateStr) : moment();

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    gregorian: date.format("YYYY-MM-DD"),
                    hijri: date.format("iYYYY-iMM-iDD"),
                    text_ar: date.format("iD iMMMM iYYYY"), // "15 Rajab 1446" - Note: moment-hijri locale might need setup for Arabic text, defaulting to English transliteration if 'ar' locale not loaded
                }),
            }],
        };
    }

    if (name === "get_islamic_holidays") {
        const year = Number(args?.year || moment().iYear());
        // Basic events calculation (approximate)
        const events = [
            { name: "Ramadan Start", date: `${year}-09-01` },
            { name: "Eid al-Fitr", date: `${year}-10-01` },
            { name: "Arafat Day", date: `${year}-12-09` },
            { name: "Eid al-Adha", date: `${year}-12-10` },
            { name: "Islamic New Year", date: `${year + 1}-01-01` },
        ];

        return {
            content: [{ type: "text", text: JSON.stringify(events, null, 2) }]
        };
    }

    throw new Error(`Unknown tool: ${name}`);
});

// Start Server
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Buraq Hijri MCP Server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
