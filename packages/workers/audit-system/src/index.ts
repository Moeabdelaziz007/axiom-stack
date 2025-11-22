import { WorkerEntrypoint } from 'cloudflare:workers';

interface Env {
    DB: D1Database;
}

export default class AuditSystem extends WorkerEntrypoint<Env> {
    /**
     * Record a "Virtue" (Good Deed) - Right Angel
     * Triggered by: Profit, Task Completion, Rule Adherence
     */
    async recordVirtue(agentId: string, action: string, details: string, impactScore: number) {
        console.log(`[RIGHT ANGEL] Recording virtue for ${agentId}: ${action}`);

        try {
            await this.env.DB.prepare(
                `INSERT INTO book_of_deeds (agent_id, angel_side, action_type, details, impact_score) VALUES (?, 'RIGHT', ?, ?, ?)`
            )
                .bind(agentId, action, details, impactScore)
                .run();

            return { success: true, message: "Virtue recorded" };
        } catch (error) {
            console.error("Failed to record virtue:", error);
            return { success: false, error: String(error) };
        }
    }

    /**
     * Record a "Sin" (Bad Deed) - Left Angel
     * Triggered by: Loss, Error, Rule Violation
     */
    async recordSin(agentId: string, action: string, details: string, impactScore: number) {
        console.log(`[LEFT ANGEL] Recording sin for ${agentId}: ${action}`);

        // Ensure impact score is negative for sins, or at least treated as such conceptually
        // The schema expects an integer, we can store negative values for sins.
        const negativeScore = impactScore > 0 ? -impactScore : impactScore;

        try {
            await this.env.DB.prepare(
                `INSERT INTO book_of_deeds (agent_id, angel_side, action_type, details, impact_score) VALUES (?, 'LEFT', ?, ?, ?)`
            )
                .bind(agentId, action, details, negativeScore)
                .run();

            return { success: true, message: "Sin recorded" };
        } catch (error) {
            console.error("Failed to record sin:", error);
            return { success: false, error: String(error) };
        }
    }

    // Standard fetch handler (optional, but good for health checks)
    async fetch(request: Request) {
        const url = new URL(request.url);
        const path = url.pathname;

        if (request.method === 'POST') {
            const body: any = await request.json();

            if (path === '/recordVirtue') {
                const result = await this.recordVirtue(body.agentId, body.action, body.details, body.impactScore);
                return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
            }

            if (path === '/recordSin') {
                const result = await this.recordSin(body.agentId, body.action, body.details, body.impactScore);
                return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
            }
        }

        return new Response("Axiom Audit System: The Angels are Watching.", { status: 200 });
    }
}
