import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_APP_API_URL;
const socket = io(baseURL);

const useAPI = () => {
    const send = (event: string, data?: any) => {
        return new Promise((resolve) => {
            socket.emit(event, data, (resp: any) => {
                resolve(resp);
            });
        });
    };

    const addListener = (event: string, callback: (data: any) => void) => {
        socket.on(event, callback);
    };

    const removeListener = (event: string, callback: (data: any) => void) => {
        socket.off(event, callback);
    };

    return {
        send,
        addListener,
        removeListener
    }
};

export { useAPI };