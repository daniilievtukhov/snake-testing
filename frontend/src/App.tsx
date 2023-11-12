import Game from ".//game/Game";
import "./App.css";
import { Outlet } from "react-router";
import { UserProvider } from "./context/UserContext";

function App() {
    return (
        <UserProvider>
            <Outlet />
        </UserProvider>
    );
}

export default App;
