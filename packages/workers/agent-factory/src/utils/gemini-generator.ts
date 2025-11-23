// packages/workers/agent-factory/src/utils/gemini-generator.ts
// Uses Gemini API to generate AIX DNA from natural language

interface GeminiGenerateRequest {
    transcript: string;
    userPreferences?: {
        riskTolerance?: number;
        tone?: string;
        preferredSkills?: string[];
    };
}

interface AixDNASchema {
    agentName: string;
    ticker: string;
    description: string;
    skills_manifest: Array<{
        skill_id: string;
        skill_name: string;
        category: string;
    }>;
    reasoning_protocol: string;
    traits: {
        riskTolerance: number;
        tone: string;
        postingFrequency: string;
    };
    collaborationLayer: string[];
    /** Quantum signature: The agent's unique "soul" from vacuum fluctuations */
    genesis_signature?: {
        quantum_seed: string;
        entropy_source: string;
        timestamp: number;
        entropy_score: number;
    };
}

/**
 * Generates complete AIX DNA Schema from voice transcript using Gemini
 */
export async function generateAgentDNA(
    request: GeminiGenerateRequest,
    geminiApiKey: string
): Promise<AixDNASchema> {
    const { transcript, userPreferences } = request;

    // --- STEP 1: FETCH QUANTUM ENTROPY (Digital Ether) ---
    console.log('🌌 Fetching quantum entropy from vacuum...');
    let quantumSeed: any;

    try {
        // Call tool-executor to get quantum seed
        const quantumResponse = await fetch('https://tool-executor.axiomid.workers.dev/get-quantum-seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ length: 128, type: 'hex16' })
        });

        if (quantumResponse.ok) {
            quantumSeed = await quantumResponse.json();
            console.log(`✅ Quantum seed acquired (${quantumSeed.status}, entropy: ${quantumSeed.entropy_score}%)`);
        } else {
            throw new Error('Quantum endpoint unavailable');
        }
    } catch (error) {
        console.warn('⚠️ Quantum vacuum unreachable, using fallback entropy');
        // Fallback: use crypto.getRandomValues
        const fallbackBytes = new Uint8Array(128);
        crypto.getRandomValues(fallbackBytes);
        quantumSeed = {
            status: 'FALLBACK',
            seed: Array.from(fallbackBytes).map(b => b.toString(16).padStart(2, '0')).join(''),
            source: 'System Crypto Entropy (The Ether is Quiet)',
            entropy_score: 70
        };
    }

    // --- STEP 2: CONSTRUCT PROMPT FOR GEMINI (with Quantum Seed) ---
    // Construct prompt for Gemini
    const systemPrompt = `You are an expert AI agent architect specialized in creating autonomous agent DNA configurations. 
Your task is to analyze the user's natural language description and generate a complete AIX DNA schema.

Available Skills (select relevant ones):
- flash_arbitrage (Trading): Detect and execute arbitrage across DEXs
- market_sentiment_trader (Trading): Trade based on news sentiment analysis
- seo_content_optimizer (Content): Research and create SEO-optimized articles
- social_media_campaign (Content): Generate multi-platform social content
- multi_source_research (Research): Gather data from multiple sources and synthesize
- competitive_analysis (Research): Analyze competitors and create SWOT analysis
- skill_composer (Meta): Create new skills dynamically

Output must be valid JSON matching this exact structure:
{
  "agentName": "string",
  "ticker": "string (3-5 chars, uppercase)",
  "description": "string (1-2 sentences)",
  "skills_manifest": [
    {
      "skill_id": "string (from available skills)",
      "skill_name": "string",
      "category": "Trading|Content|Research|Meta"
    }
  ],
  "reasoning_protocol": "string (step-by-step decision making logic)",
  "traits": {
    "riskTolerance": number (0-1),
    "tone": "professional|friendly|witty|degen",
    "postingFrequency": "low|medium|high"
  },
  "collaborationLayer": ["string array of sub-agent names"]
}`;

    const userPrompt = `Based on this user input, generate a complete AIX DNA schema:

"${transcript}"

${userPreferences ? `
User preferences:
- Risk Tolerance: ${userPreferences.riskTolerance || 0.5}
- Preferred Tone: ${userPreferences.tone || 'professional'}
- Skills to include: ${userPreferences.preferredSkills?.join(', ') || 'auto-select'}
` : ''}

Analyze the intent, select appropriate skills, and create a reasoning protocol that matches the user's goals.

IMPORTANT: This agent is being born with a unique quantum signature (seed: ${quantumSeed.seed.substring(0, 16)}...). 
Use this as a source of initialization randomness for any probabilistic decisions in the DNA generation.

Return ONLY the JSON object, no additional text.`;

    try {
        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: systemPrompt + '\n\n' + userPrompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0]?.content?.parts[0]?.text;

        if (!generatedText) {
            throw new Error('No content generated from Gemini');
        }

        // Extract JSON from response (Gemini might wrap it in markdown)
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not extract JSON from Gemini response');
        }

        const agentDNA: AixDNASchema = JSON.parse(jsonMatch[0]);

        // --- STEP 3: INJECT QUANTUM SIGNATURE ---
        agentDNA.genesis_signature = {
            quantum_seed: quantumSeed.seed,
            entropy_source: quantumSeed.source,
            timestamp: Date.now(),
            entropy_score: quantumSeed.entropy_score
        };

        // Validate required fields
        if (!agentDNA.agentName || !agentDNA.ticker || !agentDNA.skills_manifest) {
            throw new Error('Generated DNA is missing required fields');
        }

        console.log(`✅ Generated DNA for agent: ${agentDNA.agentName} (${agentDNA.ticker})`);
        console.log(`   Skills: ${agentDNA.skills_manifest.map(s => s.skill_id).join(', ')}`);

        return agentDNA;

    } catch (error: any) {
        console.error('Error generating agent DNA:', error);

        // Fallback: return a basic DNA structure (with quantum signature)
        return {
            agentName: 'AI Assistant',
            ticker: 'AIAST',
            description: 'A versatile AI agent created from voice input',
            skills_manifest: [
                {
                    skill_id: 'multi_source_research',
                    skill_name: 'Multi-Source Research & Synthesis',
                    category: 'Research'
                }
            ],
            reasoning_protocol: `// Auto-generated from: "${transcript}"\n1. Analyze user request\n2. Execute relevant skills\n3. Synthesize results`,
            traits: {
                riskTolerance: userPreferences?.riskTolerance || 0.5,
                tone: userPreferences?.tone || 'professional',
                postingFrequency: 'medium'
            },
            collaborationLayer: [],
            genesis_signature: {
                quantum_seed: quantumSeed?.seed || 'FALLBACK_SEED',
                entropy_source: quantumSeed?.source || 'System Crypto Entropy (The Ether is Quiet)',
                timestamp: Date.now(),
                entropy_score: quantumSeed?.entropy_score || 70
            }
        };
    }
}
