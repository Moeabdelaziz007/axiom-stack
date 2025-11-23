// packages/workers/tool-executor/src/skills/SkillComposer.ts
// Meta-Skill: Allows agents to create new skills dynamically

import { AixSkill } from '../../../web-ui/src/lib/schema/AixSchema';

interface SkillComposerRequest {
    userRequest: string;
    availableTools?: string[];
    preferredCategory?: string;
}

/**
 * SkillComposer - Meta-skill that creates new skills on-the-fly
 * Uses Gemini/GPT to analyze user request and generate AixSkill schema
 */
export class SkillComposer {
    private geminiApiKey: string;

    constructor(geminiApiKey: string) {
        this.geminiApiKey = geminiApiKey;
    }

    /**
     * Generate a new custom skill based on user description
     */
    async composeSkill(request: SkillComposerRequest): Promise<AixSkill> {
        const systemPrompt = `You are a skill architect for an AI agent platform. 
Your task is to analyze the user's request and generate a complete AixSkill schema.

Available Tools for skills to use:
- binance_get_current_price, binance_execute_limit_order
- coingecko_get_price
- google_search
- newsdata_get_latest
- openweather_current
- imagen_generate
- hf_text_generation, hf_image_generation
- github_llm_inference
- groq_fast_inference

Output must be valid JSON matching this exact structure:
{
  "skill_id": "snake_case_identifier",
  "skill_name": "Human Readable Name",
  "category": "Trading|Content|Research|Social|Meta|Other",
  "description": "What this skill accomplishes",
  "reasoning_protocol": "Step-by-step execution logic with tool calls",
  "required_tools": ["array", "of", "tool", "names"],
  "parameters": {
    "optional_param1": "default_value"
  },
  "example_usage": "Example prompt that would trigger this skill"
}

The reasoning_protocol should be detailed, with numbered steps and clear IF-THEN logic where applicable.`;

        const userPrompt = `Create a new skill for: "${request.userRequest}"

${request.preferredCategory ? `Preferred category: ${request.preferredCategory}` : ''}
${request.availableTools ? `Focus on using these tools: ${request.availableTools.join(', ')}` : ''}

Generate the complete skill schema. Be creative with the reasoning protocol.
Return ONLY the JSON object, no additional text.`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: systemPrompt + '\n\n' + userPrompt }]
                        }],
                        generationConfig: {
                            temperature: 0.8,
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
                throw new Error('No content generated');
            }

            // Extract JSON
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Could not extract JSON from response');
            }

            const skill: AixSkill = JSON.parse(jsonMatch[0]);

            // Validate required fields
            if (!skill.skill_id || !skill.skill_name || !skill.reasoning_protocol) {
                throw new Error('Generated skill is missing required fields');
            }

            console.log(`✅ Composed new skill: ${skill.skill_name} (${skill.skill_id})`);
            console.log(`   Category: ${skill.category}`);
            console.log(`   Tools: ${skill.required_tools.join(', ')}`);

            return skill;

        } catch (error: any) {
            console.error('Error composing skill:', error);

            // Fallback: return a basic skill structure
            const fallbackSkillId = request.userRequest
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .substring(0, 50);

            return {
                skill_id: fallbackSkillId,
                skill_name: request.userRequest,
                category: (request.preferredCategory as any) || 'Other',
                description: `Custom skill: ${request.userRequest}`,
                reasoning_protocol: `// Auto-generated skill\n1. Analyze: ${request.userRequest}\n2. Execute relevant tools\n3. Return results`,
                required_tools: request.availableTools || ['google_search'],
                parameters: {},
                example_usage: request.userRequest
            };
        }
    }

    /**
     * Validate a custom skill before saving to marketplace
     */
    validateSkill(skill: AixSkill): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required fields
        if (!skill.skill_id || skill.skill_id.length < 3) {
            errors.push('skill_id must be at least 3 characters');
        }

        if (!skill.skill_name) {
            errors.push('skill_name is required');
        }

        if (!skill.category) {
            errors.push('category is required');
        }

        if (!skill.description || skill.description.length < 10) {
            errors.push('description must be at least 10 characters');
        }

        if (!skill.reasoning_protocol || skill.reasoning_protocol.length < 20) {
            errors.push('reasoning_protocol must be at least 20 characters');
        }

        if (!skill.required_tools || skill.required_tools.length === 0) {
            errors.push('at least one required tool must be specified');
        }

        // Check for malicious patterns
        const maliciousPatterns = [
            /eval\(/i,
            /exec\(/i,
            /system\(/i,
            /__import__/i,
            /process\.env/i
        ];

        const codeToCheck = skill.reasoning_protocol + JSON.stringify(skill.parameters);
        for (const pattern of maliciousPatterns) {
            if (pattern.test(codeToCheck)) {
                errors.push('Skill contains potentially malicious code');
                break;
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
