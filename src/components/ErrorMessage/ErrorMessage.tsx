import { FunctionComponent } from "react";

interface IProps {
    message?: string;
};

const ErrorMessage: FunctionComponent<IProps> = ({ message }) => {
    return (
        <div data-testid="ErrorMessage">{message || 'Unexpected Error! Please refresh to try again!'}</div>
    );
};

export { ErrorMessage };