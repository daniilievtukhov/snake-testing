import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextValue {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextValue>({
    user: "",
    setUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
