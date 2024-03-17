import { SocketEvents } from "../types";
import { Message } from "../classes";
import { useAPI } from "./useAPI";
import { useEffect } from "react";

interface IChatServiceInput {
    messageHandler: (newMessage: Message) => void;
    errorHandler: () => void;
};

const useChatService = ({ messageHandler, errorHandler }: IChatServiceInput) => {
    const { send, addListener, removeListener } = useAPI();

    const sendMessage = async (message: Message) => {
        return send(SocketEvents.sendMessage, message);
    };

    useEffect(() => {
        addListener(SocketEvents.newMessage, messageHandler);
        addListener(SocketEvents.error, errorHandler);
        addListener(SocketEvents.connectError, errorHandler);
        return () => {
            removeListener(SocketEvents.newMessage, messageHandler);
            removeListener(SocketEvents.error, errorHandler);
        };
    }, []);

    return {
        sendMessage,
    };
};

export { useChatService };