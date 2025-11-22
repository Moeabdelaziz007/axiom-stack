require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cron = require('node-cron');

const app = express();
app.use(express.json());

// ------------------- 1. CONFIGURATION -------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Gemini system prompt
const SYSTEM_PROMPT = `You are a professional tech journalist covering AI news.
Write a concise, engaging post about the given topic. Use emojis sparingly.`;

// ------------------- 2. CORE LOGIC -------------------
async function generatePostContent(topic) {
    console.log('🧠 Generating content for:', topic);
    try {
        const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nWrite a social media post about: ${topic}. Keep it under 280 characters for Facebook/Instagram.`);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        // Fallback to simple content if API fails
        return `🤖 ${topic} - Stay tuned for updates!`;
    }
}

async function publishToAll(topic) {
    try {
        const content = await generatePostContent(topic);
        console.log('📝 Generated:', content);
        const results = {};

        // ---- Facebook (Meta Graph API) ----
        try {
            const fbResponse = await axios.post(
                `https://graph.facebook.com/v18.0/${process.env.META_PAGE_ID}/feed`,
                {
                    message: content,
                    access_token: process.env.META_ACCESS_TOKEN,
                }
            );
            console.log('✅ Posted to Facebook');
            results.facebook = fbResponse.data.id;
        } catch (e) {
            console.error('❌ Facebook Error:', e.response?.data || e.message);
            results.facebook = 'Failed';
        }

        // ---- Instagram (via Graph API) ----
        // Note: Requires Instagram Business Account linked to Facebook Page
        try {
            // Get Instagram Business Account ID
            const igAccountResponse = await axios.get(
                `https://graph.facebook.com/v18.0/${process.env.META_PAGE_ID}?fields=instagram_business_account&access_token=${process.env.META_ACCESS_TOKEN}`
            );

            const igAccountId = igAccountResponse.data.instagram_business_account?.id;

            if (igAccountId) {
                // Create media container (for image posts - requires image_url)
                // For text-only, Instagram doesn't support via API
                console.log('⚠️ Instagram posting requires image URL (not implemented yet)');
                results.instagram = 'Skipped (requires image)';
            } else {
                console.log('⚠️ No Instagram Business Account linked to this Page');
                results.instagram = 'Not linked';
            }
        } catch (e) {
            console.error('❌ Instagram Error:', e.response?.data || e.message);
            results.instagram = 'Failed';
        }

        // ---- WhatsApp (Cloud API) ----
        // Note: Requires WhatsApp Business API setup
        try {
            if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
                const waResponse = await axios.post(
                    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
                    {
                        messaging_product: 'whatsapp',
                        to: process.env.TARGET_WHATSAPP_NUMBER || '1234567890', // Replace with actual recipient
                        type: 'text',
                        text: { body: content }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('✅ Sent WhatsApp message');
                results.whatsapp = waResponse.data.messages?.[0]?.id || 'Sent';
            } else {
                console.log('⚠️ WhatsApp credentials not configured');
                results.whatsapp = 'Not configured';
            }
        } catch (e) {
            console.error('❌ WhatsApp Error:', e.response?.data || e.message);
            results.whatsapp = 'Failed';
        }

        return results;
    } catch (error) {
        console.error('Major Error:', error);
        return { error: error.message };
    }
}

// ------------------- 3. SERVER & TRIGGERS -------------------
// Manual trigger endpoint
app.post('/trigger', async (req, res) => {
    const { topic } = req.body;
    const result = await publishToAll(topic || 'The future of AI Agents');
    res.json(result);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Daily scheduled post at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log('⏰ Running scheduled post...');
    publishToAll('Daily AI Tech Update');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🤖 Social Agent Server running on port ${PORT}`));
