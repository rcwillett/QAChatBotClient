import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_APP_API_URL;

const useAPI = () => {
    const socket = io(baseURL);

    const send = async (event: string, data?: any) => {
        return new Promise((resolve) => {
            socket.emit(event, data, () => resolve(undefined) );
        });
    };

    const addListener = (event: string, callback: (data: any) => void) => {
        socket.on(event, callback);
    };

    return {
        send,
        addListener
    }
};

export { useAPI };