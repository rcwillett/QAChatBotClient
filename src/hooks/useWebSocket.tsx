import { io } from 'socket.io-client';
import { API_BASE_URL } from '../constants/ENV';


const useWebSocket = () => {
    const socket = io(API_BASE_URL);

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
    };
};

export { useWebSocket };