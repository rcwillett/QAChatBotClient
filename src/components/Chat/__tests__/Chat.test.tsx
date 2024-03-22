// src/components/Chat/__tests__/Chat.test.tsx
import '@testing-library/jest-dom';
import { Chat } from "../Chat";
import { render, screen, act, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { SocketEvents } from '../../../types';
import { Message } from '../../../classes';

const mockUser = {
    id: "ABC123",
    username: "Test McTest",
};

const listenerCallbacksByEvent: Record<string, (params: any) => void> = {};

const webSocketSendMock = jest.fn();
const addListenerMock = jest.fn((event: string, cb) => { listenerCallbacksByEvent[event] = cb; });
const removeListenerMock = jest.fn();

jest.mock("../../../hooks", () => ({
    useUser: () => ({
        user: mockUser,
        updateUser: () => {},
    }),
    useWebSocket: () => ({
        send: webSocketSendMock,
        addListener: addListenerMock,
        removeListener: removeListenerMock,
    }),
}));

// jest.mock("react", () => ({
//     ...jest.requireActual("react"),
//     useEffect: (f: () => void) => f(),
// }));

describe("Chat", () => {
    afterEach(() => {
        addListenerMock.mockClear();
        delete listenerCallbacksByEvent[SocketEvents.connect];
        delete listenerCallbacksByEvent[SocketEvents.newMessage];
        delete listenerCallbacksByEvent[SocketEvents.error];
        delete listenerCallbacksByEvent[SocketEvents.connectError];
    });

    it("Shows loader while chat is connecting to websocket", () => {
        render(<Chat />);
        expect(screen.getByTestId("Loader")).toBeInTheDocument();
    });

    it("Expect socket listeners to be added on load", () => {
        render(<Chat />);
        expect(addListenerMock).toHaveBeenCalledTimes(4);
        expect(addListenerMock).toHaveBeenCalledWith(SocketEvents.connect, expect.any(Function));
        expect(addListenerMock).toHaveBeenCalledWith(SocketEvents.newMessage, expect.any(Function));
        expect(addListenerMock).toHaveBeenCalledWith(SocketEvents.error, expect.any(Function));
        expect(addListenerMock).toHaveBeenCalledWith(SocketEvents.connectError, expect.any(Function));
    });

    it("Expect chat to display with chat ui when connected", () => {
        render(<Chat />);
        act(() => listenerCallbacksByEvent[SocketEvents.connect](null));
        const chatWindow = screen.getByTestId("chat-window");
        expect(chatWindow).toBeInTheDocument();
        expect(screen.getByTestId("chat-welcome")).toBeInTheDocument();
        const messageInput = screen.getByRole("textbox", { name: "message" });
        expect(messageInput).toBeInTheDocument();
        const submitButton = screen.getByTestId("submit-button");
        expect(submitButton).toBeInTheDocument();
    });

    it("Expect chat to display error message when connection error", () => {
        render(<Chat />);
        act(() => listenerCallbacksByEvent[SocketEvents.connectError]("error"));
        const errorMessage = screen.getByTestId("critical-error");
        expect(errorMessage).toBeInTheDocument();
    });

    it("Expect chat to display error message when error", () => {
        render(<Chat />);
        act(() => listenerCallbacksByEvent[SocketEvents.error]("error"));
        const errorMessage = screen.getByTestId("critical-error");
        expect(errorMessage).toBeInTheDocument();
    });

    it("Expect chat to display new message when new message received", async () => {
        render(<Chat />);
        act(() => listenerCallbacksByEvent[SocketEvents.connect](null));
        const testMessage = new Message("1234", "4321", "Test McTest", new Date(), "Test Message");
        act(() => listenerCallbacksByEvent[SocketEvents.newMessage](testMessage));
        const message = await waitFor(() => screen.getByText("Test Message"));
        expect(message).toBeInTheDocument();
    });

    it("Expect chat to send message when submit button clicked", async () => {
        render(<Chat />);
        act(() => listenerCallbacksByEvent[SocketEvents.connect](null));
        const messageInput = screen.getByRole("textbox", { name: "message" });
        const submitButton = screen.getByTestId("submit-button");
        fireEvent.change(messageInput, { target: { value: "Test Message" } });
        act(() => fireEvent.click(submitButton));
        expect(webSocketSendMock).toHaveBeenCalled();
        await waitForElementToBeRemoved(() => screen.queryByTestId("loading-indicator"));
    });

    it("Expect chat to send message when enter key pressed", async () => {
        render(<Chat />);
        act(() => listenerCallbacksByEvent[SocketEvents.connect](null));
        const messageInput = screen.getByRole("textbox", { name: "message" });
        fireEvent.change(messageInput, { target: { value: "Test Message" } });
        act(() => fireEvent.keyDown(messageInput, { key: "Enter", code: "Enter" }));
        expect(webSocketSendMock).toHaveBeenCalled();
    });

    it("Expect chat to show error when message is too long", () => {
        render(<Chat />);
        act(() => listenerCallbacksByEvent[SocketEvents.connect](null));
        const messageInput = screen.getByRole("textbox", { name: "message" });
        const submitButton = screen.getByTestId("submit-button");
        fireEvent.change(messageInput, { target: { value: 'x'.repeat(501) } });
        expect(submitButton).toBeDisabled();
        const errorMessage = screen.getByTestId("message-error");
        expect(errorMessage).toBeInTheDocument();
    });
});
