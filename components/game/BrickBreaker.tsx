"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface Props {
  onGameEnd: (score: number) => void;
  isPractice?: boolean;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function BrickBreaker({ onGameEnd, isPractice = false }: Props) {
  const stageRef = useRef<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 second game
  const [gameOver, setGameOver] = useState(false);

  // Game state
  const [paddleX, setPaddleX] = useState(0);
  const [ballX, setBallX] = useState(0);
  const [ballY, setBallY] = useState(0);
  const [ballVX, setBallVX] = useState(0);
  const [ballVY, setBallVY] = useState(0);
  const [bricks, setBricks] = useState<Brick[]>([]);

  const router = useRouter();
  const stageWidth = typeof window !== "undefined" ? window.innerWidth : 375;
  const stageHeight =
    typeof window !== "undefined" ? window.innerHeight - 150 : 600; // Account for HUD
  const paddleWidth = 80;
  const paddleHeight = 15;
  const ballRadius = 8;
  const paddleY = stageHeight - 50;
  const brickWidth = 50;
  const brickHeight = 20;
  const brickCols = Math.floor(stageWidth / (brickWidth + 10));
  const brickRows = 5;

  // Initialize game
  const initGame = useCallback(() => {
    // Reset game state
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setIsPaused(false);

    // Paddle in center
    setPaddleX((stageWidth - paddleWidth) / 2);

    // Ball starting position and velocity
    setBallX(stageWidth / 2);
    setBallY(paddleY - ballRadius);
    setBallVX((Math.random() - 0.5) * 400); // Random horizontal start
    setBallVY(-300); // Upward

    // Generate bricks
    const newBricks: Brick[] = [];
    for (let row = 0; row < brickRows; row++) {
      for (let col = 0; col < brickCols; col++) {
        newBricks.push({
          x: col * (brickWidth + 10) + 20,
          y: row * (brickHeight + 10) + 50,
          width: brickWidth,
          height: brickHeight,
        });
      }
    }
    setBricks(newBricks);
  }, [stageWidth, paddleY]);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    let timerInterval: NodeJS.Timeout;

    const animate = (time: number) => {
      if (isPaused || gameOver) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = time - lastTime;
      lastTime = time;

      // Update ball position
      setBallX((prev) => prev + ballVX * (deltaTime / 1000));
      setBallY((prev) => prev + ballVY * (deltaTime / 1000));

      // Ball collisions
      let newBallVX = ballVX;
      let newBallVY = ballVY;
      let newBricks = bricks;

      // Wall collisions
      if (ballX - ballRadius <= 0 || ballX + ballRadius >= stageWidth) {
        newBallVX = -ballVX;
      }
      if (ballY - ballRadius <= 0) {
        newBallVY = -ballVY;
      }

      // Paddle collision
      if (
        ballY + ballRadius >= paddleY &&
        ballY - ballRadius <= paddleY + paddleHeight &&
        ballX >= paddleX &&
        ballX <= paddleX + paddleWidth
      ) {
        newBallVY = -Math.abs(newBallVY); // Bounce up
        // Angle based on hit position
        const hitPos = (ballX - paddleX) / paddleWidth - 0.5;
        newBallVX += hitPos * 200;
      }

      // Brick collisions
      for (let i = newBricks.length - 1; i >= 0; i--) {
        const brick = newBricks[i];
        if (
          ballX + ballRadius > brick.x &&
          ballX - ballRadius < brick.x + brick.width &&
          ballY + ballRadius > brick.y &&
          ballY - ballRadius < brick.y + brick.height
        ) {
          // Remove brick
          newBricks.splice(i, 1);
          setScore((prev) => prev + 100); // Points per brick
          newBallVY = -newBallVY; // Bounce
          break;
        }
      }

      // Ball missed paddle (game over if not time-based only)
      if (ballY > stageHeight) {
        setGameOver(true);
        onGameEnd(score);
        return;
      }

      setBallVX(newBallVX);
      setBallVY(newBallVY);
      setBricks(newBricks);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start timer
    timerInterval = setInterval(() => {
      if (!isPaused && !gameOver) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            onGameEnd(score);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    // Start animation after init
    initGame();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(timerInterval);
    };
  }, [
    isPaused,
    gameOver,
    ballVX,
    ballVY,
    paddleX,
    bricks,
    stageWidth,
    stageHeight,
    paddleY,
    paddleWidth,
    onGameEnd,
    score,
    initGame,
  ]);

  // Paddle movement
  const handlePointerMove = useCallback(
    (e: any) => {
      const stage = stageRef.current;
      if (stage) {
        const pos = stage.getPointerPosition();
        if (pos) {
          const newX = Math.max(
            0,
            Math.min(stageWidth - paddleWidth, pos.x - paddleWidth / 2)
          );
          setPaddleX(newX);
        }
      }
    },
    [stageWidth, paddleWidth]
  );

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      // Re-init on resize for mobile rotation
      initGame();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initGame]);

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
        <h2 className="text-2xl mb-4">Game Over!</h2>
        <p className="text-xl mb-8">Final Score: {score}</p>
        <Button onClick={() => router.push("/match-entry")}>Play Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 relative overflow-hidden">
      {/* HUD */}
      <div className="flex justify-between p-4 text-white text-xl font-bold z-10">
        <div>Score: {score.toLocaleString()}</div>
        <div>Time: {timeLeft}</div>
      </div>
      {isPractice && (
        <div className="absolute top-20 left-4 bg-yellow-500 text-black px-4 py-2 rounded z-10">
          Practice Mode - No Gems Used
        </div>
      )}
      {/* Pause Button */}
      <Button
        className="absolute top-4 right-4 z-20 bg-gray-800 hover:bg-gray-700"
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? "Resume" : "Pause"}
      </Button>

      {/* Canvas */}
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        className="mx-auto"
      >
        <Layer>
          {/* Bricks */}
          {bricks.map((brick, i) => (
            <Rect
              key={i}
              x={brick.x}
              y={brick.y}
              width={brick.width}
              height={brick.height}
              fill="#ff6b6b"
              stroke="white"
              strokeWidth={1}
            />
          ))}
          {/* Paddle */}
          <Rect
            x={paddleX}
            y={paddleY}
            width={paddleWidth}
            height={paddleHeight}
            fill="#4ecdc4"
            stroke="white"
            strokeWidth={2}
          />
          {/* Ball */}
          <Circle
            x={ballX}
            y={ballY}
            radius={ballRadius}
            fill="#ffe66d"
            stroke="black"
            strokeWidth={2}
          />
        </Layer>
      </Stage>
    </div>
  );
}
