CREATE TABLE book_of_deeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL,
    angel_side TEXT CHECK(angel_side IN ('RIGHT', 'LEFT')),
    -- RIGHT=Good, LEFT=Bad
    action_type TEXT NOT NULL,
    details TEXT,
    impact_score INTEGER,
    -- Positive for Good, Negative for Bad
    timestamp INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_agent_deeds ON book_of_deeds(agent_id);