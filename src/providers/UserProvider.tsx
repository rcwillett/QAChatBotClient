import { FunctionComponent, ReactNode, useState } from 'react';
import { UserContext } from '../contexts';
import { User } from '../classes';

interface iProps {
    children: ReactNode | ReactNode[],
}

const UserProvider: FunctionComponent<iProps> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>();

    const updateUser = (User: User) => {
        setUser(User);
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export {
    UserProvider
};