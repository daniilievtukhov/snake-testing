import { Position } from "../game/useGameLogic";

interface DrawArgs {
    ctx: CanvasRenderingContext2D;
    snakeBody: Position[];
    foodPosition?: Position;
}

export const SEGMENT_SIZE = 5;

const draw = ({ ctx, snakeBody, foodPosition }: DrawArgs) => {
    if (foodPosition) {
        ctx.fillStyle = foodPosition.type.color;
        ctx.fillRect(
            foodPosition.x,
            foodPosition.y,
            SEGMENT_SIZE,
            SEGMENT_SIZE
        );
    }
    ctx.fillStyle = "rgb(200,0,0)";
    snakeBody.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
    });
};

export default draw;
