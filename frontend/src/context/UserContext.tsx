// import React, { createContext, useContext, useState } from "react";

// interface UserContextValue {
//     username: string;
//     setUsername: React.Dispatch<React.SetStateAction<string>>;
// }

// const UserContext = createContext<UserContextValue | undefined>(undefined);

// export const UserProvider: React.FC = ({ children }) => {
//     const [username, setUsername] = useState("");

//     return (
//         <UserContext.Provider value={{ username, setUsername }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUser = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//         throw new Error("useUser must be used within a UserProvider");
//     }
//     return context;
// };
