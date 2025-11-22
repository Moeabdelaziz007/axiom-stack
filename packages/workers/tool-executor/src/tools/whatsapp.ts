// packages/workers/tool-executor/src/tools/whatsapp.ts - WhatsApp Business API Client
export class WhatsAppClient {
    private baseUrl: string;
    private phoneId: string;
    private accessToken: string;

    constructor(phoneId: string, accessToken: string) {
        this.phoneId = phoneId;
        this.accessToken = accessToken;
        this.baseUrl = `https://graph.facebook.com/v17.0/${this.phoneId}`;
    }

    /**
     * Send a text message
     * @param to - Recipient phone number (with country code)
     * @param body - Message text
     */
    async sendMessage(to: string, body: string): Promise<any> {
        return this.makeRequest('messages', {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'text',
            text: { preview_url: false, body }
        });
    }

    /**
     * Send a template message
     * @param to - Recipient phone number
     * @param templateName - Name of the template
     * @param languageCode - Language code (e.g., 'en_US')
     * @param components - Template components (optional)
     */
    async sendTemplate(to: string, templateName: string, languageCode: string = 'en_US', components: any[] = []): Promise<any> {
        return this.makeRequest('messages', {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: languageCode },
                components
            }
        });
    }

    /**
     * Mark a message as read
     * @param messageId - ID of the message to mark as read
     */
    async markAsRead(messageId: string): Promise<any> {
        return this.makeRequest('messages', {
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: messageId
        });
    }

    /**
     * Helper to make API requests
     */
    private async makeRequest(endpoint: string, payload: any): Promise<any> {
        try {
            const url = `${this.baseUrl}/${endpoint}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data: any = await response.json();

            if (!response.ok) {
                const errorMsg = data.error?.message || 'Unknown WhatsApp API error';
                throw new Error(`WhatsApp API Error: ${errorMsg}`);
            }

            return data;
        } catch (error: any) {
            console.error('WhatsApp Request Failed:', error);
            throw new Error(`WhatsApp request failed: ${error.message}`);
        }
    }
}
