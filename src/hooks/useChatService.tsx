import { SocketEvents } from "../types";
import { Message } from "../classes";
import { useAPI } from "./useAPI";

interface IChatServiceInput {
    messageHandler: (newMessage: Message) => void;
    typingHandler: (isTyping: boolean) => void;
};

const useChatService = ({ messageHandler, typingHandler }: IChatServiceInput) => {
    const { send, addListener } = useAPI();

    const sendMessage = async (message: Message) => {

        return send(SocketEvents.sendMessage, message);
    };

    const setUserTyping = async ({
        tempUserId,
        isTyping,
    } : {
        tempUserId: string;
        isTyping: boolean;
    }) => {
        try {
            return await send(SocketEvents.sendTyping, { tempUserId, isTyping});
        } catch (error) {
            // Do nothing this should not cause an error
        }
    };

    addListener(SocketEvents.newMessage, messageHandler);
    addListener(SocketEvents.typing, typingHandler);

    return {
        sendMessage,
        setUserTyping,
    };
};

export { useChatService };