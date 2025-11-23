#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const API_BASE = "http://api.alquran.cloud/v1";

// Initialize Server
const server = new Server(
    {
        name: "buraq-quran",
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
                name: "search_quran",
                description: "Search for a specific keyword in the Quran (Arabic text). Returns verses.",
                inputSchema: {
                    type: "object",
                    properties: {
                        keyword: { type: "string", description: "The Arabic word to search for (e.g., 'الرحمة')" },
                    },
                    required: ["keyword"],
                },
            },
            {
                name: "get_ayah",
                description: "Get a specific Ayah by Surah number and Ayah number.",
                inputSchema: {
                    type: "object",
                    properties: {
                        surah: { type: "number", description: "Surah number (1-114)" },
                        ayah: { type: "number", description: "Ayah number" },
                    },
                    required: ["surah", "ayah"],
                },
            },
        ],
    };
});

// Handle Call Tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "search_quran") {
        const keyword = String(args?.keyword);
        try {
            const response = await fetch(`${API_BASE}/search/${encodeURIComponent(keyword)}/all/ar`);
            const data = await response.json();

            if (data.code !== 200) {
                return { content: [{ type: "text", text: "Search failed or no results found." }], isError: true };
            }

            // Return top 5 matches to avoid overwhelming context
            const matches = (data.data.matches || []).slice(0, 5).map((m: any) => ({
                text: m.text,
                surah: m.surah.name,
                ayah: m.numberInSurah
            }));

            return { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }] };
        } catch (error: any) {
            return { content: [{ type: "text", text: `Error searching Quran: ${error.message}` }], isError: true };
        }
    }

    if (name === "get_ayah") {
        const { surah, ayah } = args as any;
        try {
            const response = await fetch(`${API_BASE}/ayah/${surah}:${ayah}/ar.alafasy`); // Text + Audio
            const data = await response.json();

            if (data.code !== 200) {
                return { content: [{ type: "text", text: "Ayah not found." }], isError: true };
            }

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        text: data.data.text,
                        surah: data.data.surah.name,
                        audio: data.data.audio // Audio link
                    }, null, 2)
                }],
            };
        } catch (error: any) {
            return { content: [{ type: "text", text: `Error retrieving Ayah: ${error.message}` }], isError: true };
        }
    }

    throw new Error(`Unknown tool: ${name}`);
});

// Start Server
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Buraq Quran MCP Server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
