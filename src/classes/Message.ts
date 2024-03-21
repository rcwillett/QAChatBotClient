export class Message {
    id: string;
    senderUserId: string;
    senderUsername: string;
    sent: Date;
    content: string;
    isAnswered: boolean;
    isReplyTo?: Message;

    constructor(id: string, senderUserId: string, senderUsername: string, sent: Date, content: string, isAnswered:boolean = false, isReplyTo?: Message) {
        this.id = id;
        this.senderUserId = senderUserId;
        this.senderUsername = senderUsername;
        this.sent = sent;
        this.content = content;
        this.isAnswered = isAnswered;
        this.isReplyTo = isReplyTo;
    }
}