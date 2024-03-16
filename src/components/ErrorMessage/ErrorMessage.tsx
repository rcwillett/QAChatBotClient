import { FunctionComponent } from "react";

interface IProps {
    message?: string;
};

const ErrorMessage: FunctionComponent<IProps> = ({ message }) => {
    return (
        <div>{message || 'Unexpected Error! Please refresh to try again!'}</div>
    );
};

export { ErrorMessage };