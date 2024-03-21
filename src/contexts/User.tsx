import { createContext } from "react";
import { User } from "../classes";

interface IUserContext {
    user: User | undefined;
    updateUser(tempUser: User | undefined): void;
}

const UserContext = createContext<IUserContext>({
    user: undefined,
    updateUser: () => { throw new Error('Context has not been defined!')},
});

export {
    UserContext
};