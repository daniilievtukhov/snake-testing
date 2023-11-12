import React, { useContext, useEffect, useRef, useState } from "react";
import Canvas from "../canvas/Canvas";
import draw from "../draw/draw";
import { GameWrapper, Score } from "./Game.styles";
import useGameLogic from "./useGameLogic";
import { getUsers, updateUserScore } from "../services/api";
import "./Game.css";
import { UserContext } from "../context/UserContext";

interface GameProps {}

export enum GameState {
    RUNNING,
    GAME_OVER,
    PAUSED,
}

type PlayersData = {
    id: number;
    username: string;
    score: number;
};

const Game: React.FC<GameProps> = ({}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScoreUpdated, setIsScoreUpdated] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [gameState, setGameState] = useState<GameState>(GameState.RUNNING);
    const [players, setPlayers] = useState<PlayersData[]>([]); // Локальний стан для гравців

    const onGameOver = () => setGameState(GameState.GAME_OVER);
    const { snakeBody, onKeyDownHandler, foodPosition, resetGameState, score } =
        useGameLogic({
            canvasHeight: 200,
            canvasWidth: 400,
            onGameOver,
            gameState,
        });

    const drawGame = (ctx: CanvasRenderingContext2D) => {
        draw({ ctx, snakeBody, foodPosition });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsers();
                setPlayers(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [isScoreUpdated]);

    const sendScore = () => {
        if (gameState === GameState.GAME_OVER && user) {
            const updatedScore = score;

            // Локально оновити користувача
            setUser((prevUser: { score: number }) => ({
                ...prevUser,
                score: updatedScore,
            }));

            updateUserScore(user.id, updatedScore)
                .then(() => {
                    // Оновити гравців після успішного оновлення на сервері
                    setPlayers((prevPlayers) =>
                        prevPlayers.map((player) =>
                            player.id === user.id
                                ? { ...player, score: updatedScore }
                                : player
                        )
                    );
                    setIsScoreUpdated(true);
                })
                .catch((error) => {
                    setUser((prevUser: any) => ({
                        ...prevUser,
                        score: user.score,
                    })); // Відновити попередній стан користувача у випадку помилки
                    console.error("Error updating user score:", error);
                });
        }
    };

    return (
        <GameWrapper tabIndex={0} onKeyDown={onKeyDownHandler}>
            <Canvas ref={canvasRef} draw={drawGame} />
            <div className="btns">
                {gameState === GameState.GAME_OVER ? (
                    <button
                        className="btn"
                        onClick={() => {
                            setGameState(GameState.RUNNING);
                            resetGameState();
                            sendScore();
                        }}
                    >
                        Send your score and play again
                    </button>
                ) : (
                    <button
                        className="btn"
                        onClick={() => {
                            setGameState(
                                gameState === GameState.RUNNING
                                    ? GameState.PAUSED
                                    : GameState.RUNNING
                            );
                        }}
                    >
                        {gameState === GameState.RUNNING ? "Pause" : "Play!"}
                    </button>
                )}
            </div>

            <Score>{`Hi, ${user.username}, your Score: ${score}`}</Score>
            <h1 className="players">TOP-10 players:</h1>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <tr key={index}>
                            <td>{player.username}</td>
                            <td>{player.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </GameWrapper>
    );
};

export default Game;
