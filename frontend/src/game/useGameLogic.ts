import { useEffect, useState } from "react";
import { SEGMENT_SIZE } from "../draw/draw";
import randomPositionOnGrid from "../utils/randomPositionOnGrid";
import useInterval from "../utils/useInterval";
import { GameState } from "./Game";
import createSnakeMovement, {
    hasSnakeEatenItself,
    willSnakeHitTheFood,
} from "./movement";

export interface Position {
    x: number;
    y: number;
    type: FoodType;
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

const BASE_MOVEMENT_SPEED = 100; // Початкова швидкість гри
const MOVEMENT_SPEED_DECREMENT = 30; // Зменшення швидкості гри
const SCORE_DECREMENT = 50; // Зменшення швидкості кожні 50 балів

interface UseGameLogicArgs {
    canvasWidth?: number;
    canvasHeight?: number;
    onGameOver: () => void;
    gameState: GameState;
}
interface FoodType {
    color: string;
    score: number;
}

const FoodTypes = {
    GREEN: { color: "rgb(0, 200, 0)", score: 1 },
    BLUE: { color: "rgb(0, 0, 200)", score: 5 },
    WHITE: { color: "rgb(255, 255, 255)", score: 10 },
};

const getRandomFoodType = (): FoodType => {
    const foodTypes = Object.values(FoodTypes);
    return foodTypes[Math.floor(Math.random() * foodTypes.length)];
};

const useGameLogic = ({
    canvasHeight,
    canvasWidth,
    onGameOver,
    gameState,
}: UseGameLogicArgs) => {
    const [direction, setDirection] = useState<Direction | undefined>();
    const [snakeBody, setSnakeBody] = useState<Position[]>([
        {
            x: 0,
            y: 0,
            type: FoodTypes.GREEN,
        },
    ]);
    const [movementSpeed, setMovementSpeed] = useState(BASE_MOVEMENT_SPEED);

    // Рахунок гравця
    const [score, setScore] = useState(0);

    const resetGameState = () => {
        setDirection(undefined);
        setFoodPosition({
            x: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasWidth!,
            }),
            y: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasHeight!,
            }),
            type: getRandomFoodType(),
        });

        setSnakeBody([
            {
                x: randomPositionOnGrid({
                    gridSize: SEGMENT_SIZE,
                    threshold: canvasWidth!,
                }),
                y: randomPositionOnGrid({
                    gridSize: SEGMENT_SIZE,
                    threshold: canvasHeight!,
                }),
                type: FoodTypes.GREEN,
            },
        ]);

        // Повернути швидкість до початкового значення (100)
        setMovementSpeed(BASE_MOVEMENT_SPEED);
        setScore(0);
    };

    const [foodPosition, setFoodPosition] = useState<Position | undefined>();

    const snakeHeadPosition = snakeBody[snakeBody.length - 1];

    const { moveDown, moveUp, moveLeft, moveRight } = createSnakeMovement();

    useEffect(() => {
        if (!canvasHeight || !canvasWidth) {
            return;
        }
        setFoodPosition({
            x: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasWidth,
            }),
            y: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasHeight,
            }),
            type: getRandomFoodType(),
        });

        setSnakeBody([
            {
                x: randomPositionOnGrid({
                    gridSize: SEGMENT_SIZE,
                    threshold: canvasWidth,
                }),
                y: randomPositionOnGrid({
                    gridSize: SEGMENT_SIZE,
                    threshold: canvasHeight,
                }),
                type: FoodTypes.GREEN,
            },
        ]);
    }, [canvasHeight, canvasWidth]);

    const onKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
        switch (event.code) {
            case "KeyS":
                if (direction !== Direction.UP) {
                    setDirection(Direction.DOWN);
                }
                break;
            case "KeyW":
                if (direction !== Direction.DOWN) {
                    setDirection(Direction.UP);
                }
                break;
            case "KeyD":
                if (direction !== Direction.LEFT) {
                    setDirection(Direction.RIGHT);
                }
                break;
            case "KeyA":
                if (direction !== Direction.RIGHT) {
                    setDirection(Direction.LEFT);
                }
                break;
        }
    };

    const moveSnake = () => {
        let snakeBodyAfterMovement: Position[] | undefined;
        switch (direction) {
            case Direction.UP:
                if (snakeHeadPosition.y > 0) {
                    snakeBodyAfterMovement = moveUp(snakeBody);
                } else if (
                    canvasWidth &&
                    snakeHeadPosition.x > canvasWidth / 2
                ) {
                    setDirection(Direction.LEFT);
                } else {
                    setDirection(Direction.RIGHT);
                }
                break;
            case Direction.DOWN:
                if (
                    canvasHeight &&
                    snakeHeadPosition.y < canvasHeight - SEGMENT_SIZE
                ) {
                    snakeBodyAfterMovement = moveDown(snakeBody);
                } else if (
                    canvasWidth &&
                    snakeHeadPosition.x > canvasWidth / 2
                ) {
                    setDirection(Direction.LEFT);
                } else {
                    setDirection(Direction.RIGHT);
                }
                break;
            case Direction.RIGHT:
                if (
                    canvasWidth &&
                    snakeHeadPosition.x < canvasWidth - SEGMENT_SIZE
                ) {
                    snakeBodyAfterMovement = moveRight(snakeBody);
                } else if (
                    canvasHeight &&
                    snakeHeadPosition.y < canvasHeight / 2
                ) {
                    setDirection(Direction.DOWN);
                } else {
                    setDirection(Direction.UP);
                }
                break;
            case Direction.LEFT:
                if (snakeHeadPosition.x > 0) {
                    snakeBodyAfterMovement = moveLeft(snakeBody);
                } else if (
                    canvasHeight &&
                    snakeHeadPosition.y < canvasHeight / 2
                ) {
                    setDirection(Direction.DOWN);
                } else {
                    setDirection(Direction.UP);
                }
                break;
        }

        // Якщо гра закінчилася
        if (snakeBodyAfterMovement) {
            const isGameOver = hasSnakeEatenItself(snakeBodyAfterMovement);
            if (isGameOver) {
                onGameOver();
            }
        }

        // Логіка збільшення рахунку гравця та зменшення швидкості гри
        if (direction !== undefined && foodPosition) {
            if (
                willSnakeHitTheFood({
                    foodPosition,
                    snakeHeadPosition,
                    direction,
                })
            ) {
                changeFoodType();
                generateFood();
                setScore(score + foodPosition.type.score);
                console.log(score);
                // Якщо рахунок гравця кратний SCORE_DECREMENT (50), зменшити швидкість гри
                if (score > 0 && score % SCORE_DECREMENT === 0) {
                    setMovementSpeed((prevSpeed) =>
                        Math.max(prevSpeed - MOVEMENT_SPEED_DECREMENT, 0)
                    );
                }

                setSnakeBody([
                    ...snakeBodyAfterMovement!,
                    {
                        x: foodPosition.x,
                        y: foodPosition.y,
                        type: foodPosition.type,
                    },
                ]);
            } else if (snakeBodyAfterMovement) {
                setSnakeBody(snakeBodyAfterMovement);
            }
        }
    };
    const changeFoodType = () => {
        const newFoodType = getRandomFoodType();
        setFoodPosition({ ...foodPosition!, type: newFoodType });
    };
    const generateFood = () => {
        const newFoodType = getRandomFoodType();
        const newPosition: Position = {
            x: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasWidth!,
            }),
            y: randomPositionOnGrid({
                gridSize: SEGMENT_SIZE,
                threshold: canvasHeight!,
            }),
            type: newFoodType,
        };
        setFoodPosition(newPosition);
    };
    // Використання зміненої швидкості гри
    useInterval(
        moveSnake,
        gameState === GameState.RUNNING ? movementSpeed : null
    );

    return {
        snakeBody,
        onKeyDownHandler,
        foodPosition,
        resetGameState,
        score, // Повернути рахунок гравця
    };
};

export default useGameLogic;
