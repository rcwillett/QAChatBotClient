const baseURL = import.meta.env.APP_API_URL;

const useAPI = () => {
    const send = async <Output,>(event: string, data?: any) => {
        // TODO: add ability to accomodate websocket requests
        return {} as Output;
    };

    const addListener = (event: string, callback: (data: any) => void) => {
        // TODO: add ability to accomodate websocket events receieved
    };

    return {
        send,
        addListener
    }
};

export { useAPI };