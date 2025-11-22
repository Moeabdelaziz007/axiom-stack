export class FacebookClient {
  private baseUrl: string = 'https://graph.facebook.com/v19.0/';
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Posts content to the Facebook page feed
   * @param message The text content of the post
   * @param link Optional link to include in the post
   * @returns The ID of the created post
   */
  async postFeed(message: string, link?: string): Promise<string> {
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
  async getComments(postId: string): Promise<any[]> {
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
  async replyToComment(commentId: string, message: string): Promise<string> {
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
  async getPageInsights(): Promise<any> {
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