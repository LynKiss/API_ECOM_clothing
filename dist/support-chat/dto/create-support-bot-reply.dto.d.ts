export declare class SupportBotHistoryItemDto {
    role: 'user' | 'assistant';
    content: string;
}
export declare class CreateSupportBotReplyDto {
    message: string;
    history?: SupportBotHistoryItemDto[];
}
