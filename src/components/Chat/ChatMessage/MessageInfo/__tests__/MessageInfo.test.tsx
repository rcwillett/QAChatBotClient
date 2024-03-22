//src/components/Chat/ChatMessage/MessageInfo/__tests__/MessageInfo.test.tsx
import '@testing-library/jest-dom';
import { MessageInfo } from "../MessageInfo";
import { render, screen } from "@testing-library/react";

describe("MessageInfo", () => {
    const username = "TestMcTest";
    const timestamp = new Date("2022-01-01T12:00:00Z");

    it ("renders without crashing", () => {
        render(<MessageInfo username={username} timestamp={timestamp} />);
    });

    it("renders username correctly", () => {
        render(<MessageInfo username={username} timestamp={timestamp} />);
        const usernameElement = screen.getByText(username);
        expect(usernameElement).toBeInTheDocument();
    });

    it("renders timestamp correctly", () => {
        render(<MessageInfo username={username} timestamp={timestamp} />);
        const timestampElement = screen.getByText(timestamp.toLocaleTimeString());
        expect(timestampElement).toBeInTheDocument();
    });
});
