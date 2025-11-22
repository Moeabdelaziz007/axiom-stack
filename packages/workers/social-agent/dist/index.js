// packages/workers/social-agent/src/index.ts - Social Agent Worker for Facebook Page Management
import { Hono } from 'hono';
// Initialize Hono app with CORS middleware
const app = new Hono();
// Add CORS middleware
app.use('*', async (c, next) => {
    c.res.headers.set('Access-Control-Allow-Origin', '*');
    c.res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Handle preflight requests
    if (c.req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }
    await next();
});
// Facebook Client class (defined inline to avoid import issues)
class FacebookClient {
    constructor(accessToken) {
        this.baseUrl = 'https://graph.facebook.com/v19.0/';
        this.accessToken = accessToken;
    }
    /**
     * Posts content to the Facebook page feed
     * @param message The text content of the post
     * @param link Optional link to include in the post
     * @returns The ID of the created post
     */
    async postFeed(message, link) {
        const url = `${this.baseUrl}me/feed`;
        const params = new URLSearchParams({
            message: message,
            access_token: this.accessToken
        });
        if (link) {
            params.append('link', link);
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to post to feed: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        return data.id;
    }
    /**
     * Fetches comments for a specific post
     * @param postId The ID of the post to fetch comments for
     * @returns Array of comments
     */
    async getComments(postId) {
        const url = `${this.baseUrl}${postId}/comments`;
        const params = new URLSearchParams({
            access_token: this.accessToken,
            fields: 'id,message,from,created_time,like_count'
        });
        const response = await fetch(`${url}?${params}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        return data.data || [];
    }
    /**
     * Replies to a specific comment
     * @param commentId The ID of the comment to reply to
     * @param message The reply message
     * @returns The ID of the created reply
     */
    async replyToComment(commentId, message) {
        const url = `${this.baseUrl}${commentId}/comments`;
        const params = new URLSearchParams({
            message: message,
            access_token: this.accessToken
        });
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to reply to comment: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        return data.id;
    }
    /**
     * Fetches page insights and engagement metrics
     * @returns Object containing engagement metrics
     */
    async getPageInsights() {
        const url = `${this.baseUrl}me/insights`;
        const params = new URLSearchParams({
            access_token: this.accessToken,
            metric: 'page_fans,page_engaged_users,page_post_engagements,page_consumptions'
        });
        const response = await fetch(`${url}?${params}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch page insights: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        return data.data || [];
    }
}
// Health check endpoint
app.get('/', (c) => {
    return c.json({
        message: 'Social Agent Worker is running',
        timestamp: new Date().toISOString()
    });
});
// Facebook Client instance
const getFacebookClient = (c) => {
    const { PAGE_ACCESS_TOKEN } = c.env;
    return new FacebookClient(PAGE_ACCESS_TOKEN);
};
// RPC method to create a post
app.post('/rpc/createPost', async (c) => {
    try {
        const { topic } = await c.req.json();
        const { PAGE_ID, AXIOM_BRAIN_URL } = c.env;
        if (!topic) {
            return c.json({ error: 'Topic is required' }, 400);
        }
        // Call axiom-brain to generate engaging content
        const brainResponse = await fetch(`${AXIOM_BRAIN_URL}/generate-content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `Create an engaging Facebook post about ${topic}. Keep it concise and interesting.`
            })
        });
        if (!brainResponse.ok) {
            throw new Error('Failed to generate content from Axiom Brain');
        }
        const brainData = await brainResponse.json();
        const postContent = brainData.content || `Check out this interesting update about ${topic}!`;
        // Post to Facebook
        const facebookClient = getFacebookClient(c);
        const postId = await facebookClient.postFeed(postContent);
        // Log to Firestore (simulated - in a real implementation this would connect to Firestore)
        console.log(`Posted to Facebook with ID: ${postId}`);
        return c.json({
            success: true,
            postId: postId,
            content: postContent
        });
    }
    catch (error) {
        console.error('Error creating post:', error);
        return c.json({ error: 'Failed to create post', details: error.message }, 500);
    }
});
// Endpoint to get comments for a post
app.get('/comments/:postId', async (c) => {
    try {
        const postId = c.req.param('postId');
        const facebookClient = getFacebookClient(c);
        const comments = await facebookClient.getComments(postId);
        return c.json({ comments });
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        return c.json({ error: 'Failed to fetch comments', details: error.message }, 500);
    }
});
// Endpoint to reply to a comment
app.post('/comments/:commentId/reply', async (c) => {
    try {
        const commentId = c.req.param('commentId');
        const { message } = await c.req.json();
        if (!message) {
            return c.json({ error: 'Message is required' }, 400);
        }
        const facebookClient = getFacebookClient(c);
        const replyId = await facebookClient.replyToComment(commentId, message);
        return c.json({
            success: true,
            replyId: replyId
        });
    }
    catch (error) {
        console.error('Error replying to comment:', error);
        return c.json({ error: 'Failed to reply to comment', details: error.message }, 500);
    }
});
// Endpoint to get page insights
app.get('/insights', async (c) => {
    try {
        const facebookClient = getFacebookClient(c);
        const insights = await facebookClient.getPageInsights();
        return c.json({ insights });
    }
    catch (error) {
        console.error('Error fetching insights:', error);
        return c.json({ error: 'Failed to fetch insights', details: error.message }, 500);
    }
});
export default app;
