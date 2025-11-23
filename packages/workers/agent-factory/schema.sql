-- Schema for Axiom Brain (D1)
DROP TABLE IF EXISTS agents;
CREATE TABLE agents (
    id TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    template_id TEXT NOT NULL,
    dna TEXT NOT NULL,
    -- JSON string of full AIX DNA
    status TEXT DEFAULT 'active',
    created_at INTEGER,
    updated_at INTEGER
);
DROP TABLE IF EXISTS logs;
CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL,
    type TEXT NOT NULL,
    -- 'info', 'error', 'chat', 'action'
    message TEXT NOT NULL,
    metadata TEXT,
    -- JSON string
    timestamp INTEGER
);
CREATE INDEX idx_agents_owner ON agents(owner);
CREATE INDEX idx_logs_agent_id ON logs(agent_id);