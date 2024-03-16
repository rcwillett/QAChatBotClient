import { IChatStatus, IMessage } from "../types";
import { useAPI } from "./useAPI";

interface IChatServiceInput {
    messageHandler: (newMessages: IMessage[]) => void;
    typingHandler: (isTyping: boolean) => void;
};

const useChatService = ({ messageHandler, typingHandler }: IChatServiceInput) => {
    const { send, addListener } = useAPI();

    const getChatMessages = async () => {
        return send<IMessage[]>('getMessages');
    };

    const sendMessage = async ({
        tempUserId,
        content,
        replyToId
    } : {
        tempUserId: string;
        content: string;
        replyToId?: string;
    }) => {
        return send('sendMessage', { tempUserId, content, replyToId });
    };

    const setUserTyping = async ({
        tempUserId,
        isTyping,
    } : {
        tempUserId: string;
        isTyping: boolean;
    }) => {
        try {
            return await send('/chat/typing', { tempUserId, isTyping});
        } catch (error) {
            // Do nothing this should not cause an error
        }
    };

    addListener('newMessages', messageHandler);
    addListener('typing', typingHandler);

    return {
        getChatMessages,
        sendMessage,
        setUserTyping,
    };
};

export { useChatService };