export declare class TelegramBot {
    private bot;
    private brain;
    constructor();
    private setupHandlers;
    start(): Promise<void>;
    stop(): Promise<void>;
}
