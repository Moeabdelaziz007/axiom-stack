import { Client } from 'discord.js';
export declare class DiscordBot {
    private client;
    private brain;
    constructor();
    private setupHandlers;
    private processMessage;
    login(token: string): Promise<void>;
    getClient(): Client;
}
