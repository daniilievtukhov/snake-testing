import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Game from "../game/Game";
import NameInputForm from "../nameInputForm/NameInputForm";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: (
                    <NameInputForm
                        onSubmit={function (name: string): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                ),
            },
            { path: "game", element: <Game /> },
        ],
    },
]);
