// packages/web-ui/src/lib/SkillsRegistry.ts

import { AixSkill } from './schema/AixSchema';

/**
 * AxiomSkills - Composite workflows that combine multiple tools
 * Inspired by Anthropic Skills and Obra Superpowers
 */
export const AxiomSkills: AixSkill[] = [
    //=== TRADING SKILLS ===
    {
        skill_id: 'flash_arbitrage',
        skill_name: 'Flash Arbitrage Execution',
        category: 'Trading',
        description: 'Detect price discrepancies across DEXs and execute arbitrage trades automatically',
        reasoning_protocol: `
1. Fetch current prices for target token from Binance using binance_get_current_price
2. Calculate arbitrage opportunity (price delta percentage)
3. IF delta > min_profit_threshold:
     a. Execute buy order on lower-price exchange using binance_execute_limit_order
     b. Execute sell order on higher-price exchange
     c. Log trade execution details
4. ELSE:
     Return "No arbitrage opportunity found"
5. Calculate and report profit/loss
    `,
        required_tools: ['binance_get_current_price', 'binance_execute_limit_order'],
        parameters: {
            min_profit_threshold: 0.005, // 0.5%
            max_trade_size_usd: 1000,
            target_symbols: ['SOLUSDT', 'ETHUSDT']
        },
        example_usage: "Execute flash arbitrage on SOL/USDT if opportunity > 0.5%"
    },

    {
        skill_id: 'market_sentiment_trader',
        skill_name: 'Market Sentiment-Based Trader',
        category: 'Trading',
        description: 'Analyze  market sentiment from news and execute trades based on sentiment score',
        reasoning_protocol: `
1. Use newsdata_get_latest to fetch recent news about target cryptocurrency
2. Use groq_fast_inference to analyze sentiment of news articles (score: -1 to 1)
3. Use coingecko_get_price to get current price
4. IF sentiment_score > 0.6 (very positive):
     Execute buy order using binance_execute_limit_order
5. ELSE IF sentiment_score < -0.6 (very negative):
     Execute sell order
6. ELSE:
     Hold position (no action)
7. Log decision and reasoning
    `,
        required_tools: ['newsdata_get_latest', 'groq_fast_inference', 'coingecko_get_price', 'binance_execute_limit_order'],
        parameters: {
            sentiment_buy_threshold: 0.6,
            sentiment_sell_threshold: -0.6,
            trade_size_multiplier: 1.0
        },
        example_usage: "Trade BTC based on news sentiment analysis"
    },

    // ===== CONTENT SKILLS =====
    {
        skill_id: 'seo_content_optimizer',
        skill_name: 'SEO Content Generator & Optimizer',
        category: 'Content',
        description: 'Research trending topics, generate SEO-optimized content, and create visuals',
        reasoning_protocol: `
1. Use google_search to find trending keywords in the specified niche
2. Use newsdata_get_latest to get recent news for additional context
3. Use hf_text_generation (Llama 3.1 model) to draft article outline
4. Generate full article content with target word count and keyword density
5. Use imagen_generate to create a featured image based on article topic
6. Return complete blog post package (title, content, metadata, image URL)
    `,
        required_tools: ['google_search', 'newsdata_get_latest', 'hf_text_generation', 'imagen_generate'],
        parameters: {
            target_word_count: 1500,
            keyword_density: 0.02,
            include_images: true,
            tone: 'professional'
        },
        example_usage: "Create an SEO-optimized article about DeFi trends in 2025"
    },

    {
        skill_id: 'social_media_campaign',
        skill_name: 'Multi-Platform Social Media Campaign',
        category: 'Content',
        description: 'Generate coordinated content for multiple social platforms with optimized formats',
        reasoning_protocol: `
1. Use google_search to research trending topics in niche
2. Use hf_text_generation to create:
     - Twitter/X thread (10 tweets, 280 chars each)
     - LinkedIn post (professional tone, 1300 chars)
     - Instagram caption (engaging, hashtags, 2200 chars)
3. Use hf_image_generation to create platform-specific visuals:
     - Twitter: 16:9 aspect ratio
     - Instagram: 1:1 aspect ratio
4. Schedule optimal posting times based on platform
5. Return complete campaign package
    `,
        required_tools: ['google_search', 'hf_text_generation', 'hf_image_generation'],
        parameters: {
            platforms: ['twitter', 'linkedin', 'instagram'],
            tone: 'engaging',
            include_hashtags: true
        },
        example_usage: "Create a coordinated social media campaign about our new AI product launch"
    },

    // ===== RESEARCH SKILLS =====
    {
        skill_id: 'multi_source_research',
        skill_name: 'Multi-Source Research & Synthesis',
        category: 'Research',
        description: 'Gather data from multiple sources, analyze sentiment, and synthesize insights into a comprehensive report',
        reasoning_protocol: `
1. Use google_search to conduct broad web research on the topic
2. Use newsdata_get_latest to fetch recent news articles
3. IF topic is crypto-related:
     Use coingecko_get_price for market data
4. Use groq_fast_inference for:
     - Sentiment analysis of collected articles
     - Key point extraction
     - Relationship mapping
5. Synthesize all data sources into structured report with:
     - Executive summary
     - Key findings
     - Data visualizations (text-based)
     - Sources and citations
6. Return comprehensive research report
    `,
        required_tools: ['google_search', 'newsdata_get_latest', 'coingecko_get_price', 'groq_fast_inference'],
        parameters: {
            max_sources: 20,
            include_sentiment: true,
            report_format: 'markdown'
        },
        example_usage: "Research the current state of AI regulation in the European Union"
    },

    {
        skill_id: 'competitive_analysis',
        skill_name: 'Competitive Intelligence Gathering',
        category: 'Research',
        description: 'Analyze competitors by gathering public data, news, and market positioning',
        reasoning_protocol: `
1. Use google_search to find competitor websites and information
2. Use newsdata_get_latest to track competitor mentions in news
3. Use openweather_current for location-based context (if applicable)
4. Use groq_fast_inference to analyze:
     - Competitive strengths/weaknesses
     - Market positioning
     - Pricing strategies
     - Recent developments
5. Generate SWOT analysis matrix
6. Provide strategic recommendations
    `,
        required_tools: ['google_search', 'newsdata_get_latest', 'groq_fast_inference'],
        parameters: {
            competitor_count: 5,
            include_swot: true,
            depth: 'comprehensive'
        },
        example_usage: "Analyze top 5 competitors in the AI coding assistant space"
    },

    // ===== META SKILLS =====
    {
        skill_id: 'skill_composer',
        skill_name: 'Dynamic Skill Composer',
        category: 'Meta',
        description: 'Create new custom skills dynamically by composing existing tools and analyzing user requirements',
        reasoning_protocol: `
1. Analyze user request to identify:
     - Desired outcome
     - Required capabilities
     - Input/output specifications
2. Search available tools in ToolRegistry that match capabilities
3. Use github_llm_inference (GPT-4o) for meta-reasoning to:
     - Design optimal tool sequence
     - Generate step-by-step reasoning_protocol
     - Define appropriate parameters
     - Create example usage
4. Construct AixSkill object with all fields
5. Validate that all required_tools exist in ToolRegistry
6. Return new skill definition for user approval/modification
    `,
        required_tools: ['github_llm_inference'],
        parameters: {
            creativity_level: 0.7,
            include_error_handling: true,
            generate_examples: true
        },
        example_usage: "Create a skill that monitors Twitter sentiment and automatically executes trades"
    }
];

/**
 * Get skill by ID
 */
export function getSkillById(skill_id: string): AixSkill | undefined {
    return AxiomSkills.find(skill => skill.skill_id === skill_id);
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: AixSkill['category']): AixSkill[] {
    return AxiomSkills.filter(skill => skill.category === category);
}

/**
 * Get all skill categories
 */
export function getSkillCategories(): AixSkill['category'][] {
    const categories = new Set(AxiomSkills.map(skill => skill.category));
    return Array.from(categories);
}
