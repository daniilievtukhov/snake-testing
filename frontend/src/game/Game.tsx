import React, { useEffect, useRef, useState } from "react";
import Canvas from "../canvas/Canvas";
import draw from "../draw/draw";
import { GameWrapper, Score } from "./Game.styles";
import useGameLogic from "./useGameLogic";
import players from "../players.json";
import { getOneUser, getUsers } from "../services/api";
import "./Game.css";
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
    const [currentUser, setCurrentUser] = useState<PlayersData | null>(null);
    const [gameState, setGameState] = useState<GameState>(GameState.RUNNING);
    const [players, setPlayers] = useState<PlayersData[]>([]);
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
        getUsers()
            .then((response) => {
                setPlayers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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
                        }}
                    >
                        Play Again
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

            <Score>{`Your Score: ${score}`}</Score>
            <h1 className="players">Best players:</h1>
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
