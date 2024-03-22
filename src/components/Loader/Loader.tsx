import { CircularProgress } from "@mui/material";
import { FunctionComponent } from "react";

interface IProps {
    size?: number;
}

const Loader: FunctionComponent<IProps> = ({ size }) => {
    return (
        <CircularProgress data-testid="Loader" size={size} />
    );
};

export { Loader };