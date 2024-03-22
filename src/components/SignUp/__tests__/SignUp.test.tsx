// src/components/Chat/__tests__/Chat.test.tsx
import '@testing-library/jest-dom';
import { SignUp } from "../SignUp";
import { render, screen, fireEvent } from "@testing-library/react";
import { CHATBOT_NAME } from '../../../constants';

const updateUserMock = jest.fn();

jest.mock("../../../hooks", () => ({
    useUser: () => ({
        user: undefined,
        updateUser: updateUserMock,
    }),
}));

describe("SignUp component", () => {
    afterEach(() => {
        updateUserMock.mockClear();
    });

    test("renders the SignUp component", () => {
        render(<SignUp />);
        const signUpComponent = screen.getByTestId("SignUp");
        expect(signUpComponent).toBeInTheDocument();
    });

    test("submits the form with valid input", () => {
        render(<SignUp />);
        const usernameInput = screen.getByRole("textbox", { name: "username" });
        const submitButton = screen.getByRole("button");
        fireEvent.change(usernameInput, { target: { value: "Test McTester" } });
        expect(submitButton).not.toBeDisabled();
        fireEvent.click(submitButton);
        expect(updateUserMock).toHaveBeenCalled();
    });
    
    test("shows error if form submitted with empty value", () => {
        render(<SignUp />);
        const usernameInput = screen.getByRole("textbox", { name: "username" });
        const submitButton = screen.getByRole("button");
        fireEvent.change(usernameInput, { target: { value: "" } });
        fireEvent.click(submitButton);
        expect(submitButton).toBeDisabled();
        const errorText = screen.getByTestId("error");
        expect(errorText).toBeInTheDocument();
    });

    test("shows error if form submitted with value that is too long", () => {
        render(<SignUp />);
        const usernameInput = screen.getByRole("textbox", { name: "username" });
        const submitButton = screen.getByRole("button");
        fireEvent.change(usernameInput, { target: { value: "kajspiurhewapiuheriuowaherpahreuiwahoiufheaoiehfihaiowuehroieauwherjjaf" } });
        fireEvent.click(submitButton);
        expect(submitButton).toBeDisabled();
        const errorText = screen.getByTestId("error");
        expect(errorText).toBeInTheDocument();
    });

    test("shows error if form submitted with a value that is equal to the chatbot name", () => {
        render(<SignUp />);
        const usernameInput = screen.getByRole("textbox", { name: "username" });
        const submitButton = screen.getByRole("button");
        fireEvent.change(usernameInput, { target: { value: CHATBOT_NAME } });
        fireEvent.click(submitButton);
        expect(submitButton).toBeDisabled();
        const errorText = screen.getByTestId("error");
        expect(errorText).toBeInTheDocument();
    });
});
