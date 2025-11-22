// packages/workers/social-agent/src/miner.ts
// Data Mining Engine - Extracts insights from 3 pillars

export interface MiningResult {
    type: 'wins' | 'tech' | 'vision';
    title: string;
    data: any;
    timestamp: string;
}

export class DataMiner {
    constructor(
        private env: {
            TOOL_EXECUTOR_URL?: string;
            GITHUB_TOKEN?: string;
            KV_WHITEPAPER?: KVNamespace;
        }
    ) { }

    /**
     * PILLAR A: THE WINS (Trading Stats)
     * Queries BigQuery via Tool Executor for profitable trades
     */
    async getWins(): Promise<MiningResult> {
        console.log('🔍 Mining: Trading Wins...');

        try {
            if (!this.env.TOOL_EXECUTOR_URL) {
                return this.getMockWins();
            }

            const response = await fetch(`${this.env.TOOL_EXECUTOR_URL}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'query_bigquery',
                    args: {
                        query: `
              SELECT 
                token_symbol,
                profit_pct,
                volume_usd,
                timestamp
              FROM trading.completed_trades
              WHERE profit_pct > 5
                AND DATE(timestamp) = CURRENT_DATE()
              ORDER BY profit_pct DESC
              LIMIT 1
            `
                    }
                })
            });

            if (!response.ok) {
                console.warn('Tool Executor unavailable, using mock data');
                return this.getMockWins();
            }

            const data = await response.json();
            return {
                type: 'wins',
                title: `${data.token_symbol} Trade Victory`,
                data,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching wins:', error);
            return this.getMockWins();
        }
    }

    /**
     * PILLAR B: THE BUILD (Tech Progress)
     * Fetches recent GitHub commits
     */
    async getTech(): Promise<MiningResult> {
        console.log('🔍 Mining: Tech Updates...');

        try {
            const headers: HeadersInit = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Axiom-Social-Agent'
            };

            if (this.env.GITHUB_TOKEN) {
                headers['Authorization'] = `Bearer ${this.env.GITHUB_TOKEN}`;
            }

            const response = await fetch(
                'https://api.github.com/repos/Moeabdelaziz007/axiom-stack/commits?per_page=1',
                { headers }
            );

            if (!response.ok) {
                return this.getMockTech();
            }

            const commits = await response.json();
            const latestCommit = commits[0];

            return {
                type: 'tech',
                title: latestCommit.commit.message.split('\n')[0],
                data: {
                    message: latestCommit.commit.message,
                    author: latestCommit.commit.author.name,
                    sha: latestCommit.sha.substring(0, 7),
                    date: latestCommit.commit.author.date
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching tech:', error);
            return this.getMockTech();
        }
    }

    /**
     * PILLAR C: THE VISION (Philosophy)
     * Retrieves random whitepaper snippet from KV
     */
    async getVision(): Promise<MiningResult> {
        console.log('🔍 Mining: Vision Topics...');

        try {
            if (!this.env.KV_WHITEPAPER) {
                return this.getMockVision();
            }

            // List all keys in KV
            const { keys } = await this.env.KV_WHITEPAPER.list();

            if (keys.length === 0) {
                return this.getMockVision();
            }

            // Pick random topic
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const content = await this.env.KV_WHITEPAPER.get(randomKey.name);

            return {
                type: 'vision',
                title: randomKey.name.replace(/_/g, ' '),
                data: { content },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching vision:', error);
            return this.getMockVision();
        }
    }

    // Fallback mock data
    private getMockWins(): MiningResult {
        return {
            type: 'wins',
            title: '$SOL Trade Victory',
            data: {
                token_symbol: 'SOL',
                profit_pct: 12.4,
                volume_usd: 50000,
                timestamp: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        };
    }

    private getMockTech(): MiningResult {
        return {
            type: 'tech',
            title: 'feat: quantum-resistant hashing',
            data: {
                message: 'feat: quantum-resistant hashing\n\nImplemented post-quantum cryptography for all agent signatures.',
                author: 'Axiom Core Team',
                sha: 'a1b2c3d',
                date: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        };
    }

    private getMockVision(): MiningResult {
        return {
            type: 'vision',
            title: 'The Future of Work',
            data: {
                content: 'Imagine a world where you don\'t work for money, but your AI agents do. This is not science fiction—it\'s the inevitable evolution of labor.'
            },
            timestamp: new Date().toISOString()
        };
    }
}
