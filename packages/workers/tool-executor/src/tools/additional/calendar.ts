// packages/workers/tool-executor/src/tools/additional/calendar.ts - Google Calendar Integration

// Define types for Google Calendar responses
interface CalendarConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface CalendarTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  location?: string;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

interface Calendar {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
}

interface CalendarListResponse {
  items: Calendar[];
}

interface CalendarEventsResponse {
  items: CalendarEvent[];
}

export class CalendarClient {
  private config: CalendarConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: CalendarConfig) {
    this.config = config;
  }

  /**
   * Get access token for Google Calendar API
   * @returns Promise<string> - Access token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      // Exchange refresh token for access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar auth error: ${errorText}`);
      }

      const tokenData: CalendarTokenResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 minute early

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Calendar access token:', error);
      throw error;
    }
  }

  /**
   * List calendars
   * @returns Promise<Calendar[]> - Array of calendars
   */
  async listCalendars(): Promise<Calendar[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar list error: ${errorText}`);
      }

      const result: CalendarListResponse = await response.json();
      return result.items || [];
    } catch (error) {
      console.error('Error listing calendars:', error);
      throw error;
    }
  }

  /**
   * Get events from a calendar
   * @param calendarId - Calendar ID (use 'primary' for the user's primary calendar)
   * @param timeMin - Start time (ISO 8601 format)
   * @param timeMax - End time (ISO 8601 format)
   * @param maxResults - Maximum number of events to return (default: 250)
   * @returns Promise<CalendarEvent[]> - Array of events
   */
  async listEvents(calendarId: string = 'primary', timeMin?: string, timeMax?: string, maxResults: number = 250): Promise<CalendarEvent[]> {
    try {
      const token = await this.getAccessToken();
      
      const params = new URLSearchParams({
        maxResults: maxResults.toString()
      });
      
      if (timeMin) params.append('timeMin', timeMin);
      if (timeMax) params.append('timeMax', timeMax);
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar list events error: ${errorText}`);
      }

      const result: CalendarEventsResponse = await response.json();
      return result.items || [];
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  }

  /**
   * Create a new event
   * @param calendarId - Calendar ID (use 'primary' for the user's primary calendar)
   * @param event - Event data
   * @returns Promise<CalendarEvent> - Created event
   */
  async createEvent(calendarId: string, event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar create event error: ${errorText}`);
      }

      const createdEvent: CalendarEvent = await response.json();
      return createdEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   * @param calendarId - Calendar ID (use 'primary' for the user's primary calendar)
   * @param eventId - Event ID
   * @param event - Updated event data
   * @returns Promise<CalendarEvent> - Updated event
   */
  async updateEvent(calendarId: string, eventId: string, event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar update event error: ${errorText}`);
      }

      const updatedEvent: CalendarEvent = await response.json();
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   * @param calendarId - Calendar ID (use 'primary' for the user's primary calendar)
   * @param eventId - Event ID
   * @returns Promise<void>
   */
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar delete event error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Get a specific event
   * @param calendarId - Calendar ID (use 'primary' for the user's primary calendar)
   * @param eventId - Event ID
   * @returns Promise<CalendarEvent> - Event data
   */
  async getEvent(calendarId: string, eventId: string): Promise<CalendarEvent> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar get event error: ${errorText}`);
      }

      const event: CalendarEvent = await response.json();
      return event;
    } catch (error) {
      console.error('Error getting event:', error);
      throw error;
    }
  }

  /**
   * Create a new calendar
   * @param summary - Calendar name
   * @param description - Calendar description (optional)
   * @param timeZone - Calendar timezone (optional)
   * @returns Promise<Calendar> - Created calendar
   */
  async createCalendar(summary: string, description?: string, timeZone?: string): Promise<Calendar> {
    try {
      const token = await this.getAccessToken();
      
      const calendarData: any = {
        summary: summary
      };
      
      if (description) calendarData.description = description;
      if (timeZone) calendarData.timeZone = timeZone;
      
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(calendarData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar create error: ${errorText}`);
      }

      const calendar: Calendar = await response.json();
      return calendar;
    } catch (error) {
      console.error('Error creating calendar:', error);
      throw error;
    }
  }
}