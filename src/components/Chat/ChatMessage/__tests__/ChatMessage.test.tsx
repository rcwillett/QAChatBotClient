//src/components/Chat/ChatMessage/__tests__/ChatMessage.test.tsx
import '@testing-library/jest-dom';
import { ChatMessage } from "../ChatMessage";
import { Message } from "../../../../classes";
import { render, screen } from "@testing-library/react";

const mockUser = {
    id: "ABC123",
    username: "Test McTest",
};

jest.mock('../../../../hooks', () => ({
    useUser: () => ({
        user: mockUser,
        updateUser: () => {},
    }),
}));


describe("ChatMessage", () => {
    const mockMessage: Message = new Message(
        "1234",
        "4321",
        "Test McTest 2",
        new Date(),
        "Goodbye cruel world!"
    );

    const replyMessage = new Message(
        "1234",
        "4321",
        "Test McTest 2",
        new Date(),
        "Goodbye cruel world!",
        false,
        mockMessage
    );

    it("renders the MessageInfo component", () => {
        render(<ChatMessage message={mockMessage} replyClick={() => {}} />);
        const messageInfoComponent = screen.getByTestId("MessageInfo");
        expect(messageInfoComponent).toBeInTheDocument();
    });

    it("calls replyClick when the reply button is clicked", () => {
        const mockReplyClick = jest.fn();
        render(<ChatMessage message={mockMessage} replyClick={mockReplyClick} />);
        const replyButton = screen.getByRole("button");
        replyButton.click();
        expect(mockReplyClick).toHaveBeenCalledWith(mockMessage);
    });

    it("does not render the reply button if the message is answered", () => {
        const answeredMessage = new Message(
            "1234",
            "4321",
            "Test McTest",
            new Date(),
            "Goodbye cruel world!",
            true
        );
        render(<ChatMessage message={answeredMessage} replyClick={() => {}} />);
        const replyButton = screen.queryByRole("button");
        expect(replyButton).not.toBeInTheDocument();
    });

    it ("does not render the reply button if the message is a reply", () => {
        render(<ChatMessage message={replyMessage} replyClick={() => {}} />);
        const replyButton = screen.queryByRole("button");
        expect(replyButton).not.toBeInTheDocument();
    });

    it ("renders the reply message content if the message is a reply", () => {
        render(<ChatMessage message={replyMessage} replyClick={() => {}} />);
        const replyMessageContent = screen.getByText(mockMessage.content);
        expect(replyMessageContent).toBeInTheDocument();
    });

    it ("does not render the reply button if sent by the user", () => {
        const userMessage = new Message(
            "1234",
            mockUser.id,
            mockUser.username,
            new Date(),
            "Goodbye cruel world!"
        );
        render(<ChatMessage message={userMessage} replyClick={() => {}} />);
        const replyButton = screen.queryByRole("button");
        expect(replyButton).not.toBeInTheDocument();
    });
});
