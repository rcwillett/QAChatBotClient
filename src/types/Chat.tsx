export interface IMessage {
    id: string;
    sender_user_id: string;
    sent: Date;
    content: string;
    isReplyTo?: IMessage;
}

export interface IChatStatus {
    newMessages: IMessage[];
    isTyping: boolean;
    isActive: boolean;
}