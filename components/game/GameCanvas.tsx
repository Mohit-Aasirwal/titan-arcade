"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Group, Path } from 'react-konva';
import { useGameStore } from '@/store/gameStore';

// Constants
// Constants
const PLAYER_SIZE = 40;
const BULLET_SPEED = 7;
const ENEMY_SPEED = 2.5;
const PLAYER_SPEED = 7; // Keyboard speed
const SPAWN_RATE = 60; // frames

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'player' | 'bullet' | 'enemy';
  variant?: '1' | '2' | '3';
  color?: string;
  vy?: number;
}

export const GameCanvas = () => {
  const { isPlaying, isPaused, addScore, loseLife, tickTimer } = useGameStore();
  const requestRef = useRef<number>(null);
  const frameCount = useRef(0);
  
  // Create refs for pre-loaded images to avoid flicker? 
  // Konva useImage handles caching well usually.
  
  // Dimensions state for SSR safety
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
    });
  }, []);

  const [stars, setStars] = useState<{x:number, y:number, radius:number, opacity:number}[]>([]);
  
  useEffect(() => {
    if (dimensions.width === 0) return;
    setStars([...Array(30)].map(() => ({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius: Math.random() * 2,
        opacity: 0.3
    })));
  }, [dimensions]);

  // Game State (Render)
  const [playerX, setPlayerX] = useState(200); 
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);

  // Refs for logic loop (Authoritative State)
  const gameState = useRef({
      playerX: 200,
      bullets: [] as GameObject[],
      enemies: [] as GameObject[],
      isPlaying,
      isPaused,
      keys: { left: false, right: false }
  });

  // Sync isPlaying/isPaused from store
  useEffect(() => {
    gameState.current.isPlaying = isPlaying;
    gameState.current.isPaused = isPaused;
  }, [isPlaying, isPaused]);

  // Sync PlayerX from Input (Touch/Mouse) to Ref
  const handleInput = useCallback((e: any) => {
      if (!isClient) return;
      const stage = e.target.getStage();
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      
      let nextX = pointer.x;
      if (nextX < PLAYER_SIZE/2) nextX = PLAYER_SIZE/2;
      if (nextX > dimensions.width - PLAYER_SIZE/2) nextX = dimensions.width - PLAYER_SIZE/2;
      
      setPlayerX(nextX);
      gameState.current.playerX = nextX;
  }, [dimensions, isClient]);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') gameState.current.keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') gameState.current.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') gameState.current.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') gameState.current.keys.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Loop Ref to avoid recursion dependency
  const loopRef = useRef<() => void>(() => {});

  const update = useCallback(() => {
    const state = gameState.current;
    if (!state.isPlaying || state.isPaused) {
        requestRef.current = requestAnimationFrame(() => loopRef.current());
        return;
    }

    frameCount.current++;
    const width = dimensions.width || 400; // fallback
    const height = dimensions.height || 800;

    // 1. Keyboard Movement Update
    if (state.keys.left) {
        state.playerX = Math.max(PLAYER_SIZE/2, state.playerX - PLAYER_SPEED);
    }
    if (state.keys.right) {
        state.playerX = Math.min(width - PLAYER_SIZE/2, state.playerX + PLAYER_SPEED);
    }

    // 2. Timer
    if (frameCount.current % 60 === 0) tickTimer();

    // 3. Spawning
    if (frameCount.current % SPAWN_RATE === 0) {
        // Use logic... 
        const size = 30 + Math.random() * 20;
        const variant = Math.random() < 0.33 ? '1' : Math.random() < 0.66 ? '2' : '3';
        state.enemies.push({
            id: Math.random().toString(),
            x: Math.random() * (width - size),
            y: -50,
            width: size,
            height: size,
            type: 'enemy',
            variant: variant,
            vy: ENEMY_SPEED + Math.random() * 2
        });
    }

    if (frameCount.current % 12 === 0) {
        state.bullets.push({
            id: Math.random().toString(),
            x: state.playerX,
            y: height - 120,
            width: 4,
            height: 12,
            type: 'bullet',
            vy: -BULLET_SPEED
        });
    }

    // 4. Movement
    state.bullets.forEach(b => b.y += (b.vy || 0));
    state.enemies.forEach(e => e.y += (e.vy || 0));

    // 5. Cleanup (Bounds)
    state.bullets = state.bullets.filter(b => b.y > -50);
    state.enemies = state.enemies.filter(e => e.y < height + 50);

    // 6. Collision Detection
    const bulletsToRemove = new Set<string>();
    const enemiesToRemove = new Set<string>();
    let scoreToAdd = 0;
    let playerHit = false;

    // Check Bullet-Enemy Collisions
    state.bullets.forEach(bullet => {
        if (bulletsToRemove.has(bullet.id)) return;
        
        state.enemies.forEach(enemy => {
             if (enemiesToRemove.has(enemy.id)) return;

             if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
             ) {
                 bulletsToRemove.add(bullet.id);
                 enemiesToRemove.add(enemy.id);
                 scoreToAdd += 100;
             }
        });
    });

    // Check Player-Enemy Collisions
    const px = state.playerX;
    const py = height - 100;
    state.enemies.forEach(enemy => {
        if (enemiesToRemove.has(enemy.id)) return;
        if (
            px - 20 < enemy.x + enemy.width &&
            px + 20 > enemy.x &&
            py - 20 < enemy.y + enemy.height &&
            py + 20 > enemy.y
        ) {
            enemiesToRemove.add(enemy.id);
            playerHit = true;
        }
    });

    // Apply Collision Results
    if (bulletsToRemove.size > 0) {
        state.bullets = state.bullets.filter(b => !bulletsToRemove.has(b.id));
    }
    if (enemiesToRemove.size > 0) {
        state.enemies = state.enemies.filter(e => !enemiesToRemove.has(e.id));
    }
    
    // Side Effects
    if (scoreToAdd > 0) addScore(scoreToAdd);
    if (playerHit) loseLife();

    // 7. Sync to React State for Render
    setPlayerX(state.playerX);
    setBullets([...state.bullets]); // Create new ref to trigger render
    setEnemies([...state.enemies]);

    requestRef.current = requestAnimationFrame(() => loopRef.current());
  }, [dimensions, addScore, loseLife, tickTimer]);

  useEffect(() => {
    loopRef.current = update;
  }, [update]);

  useEffect(() => {
    // Start or restart the loop whenever playing state changes
    if (isPlaying && !isPaused) {
       requestRef.current = requestAnimationFrame(() => loopRef.current());
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isPaused]);

  if (!isClient) return <div className="bg-slate-900 w-full h-full" />;

  return (
    <div 
        className="w-full h-full overflow-hidden touch-none"
        style={{
            backgroundColor: '#090A0F',
            backgroundImage: `
                radial-gradient(circle at 50% 30%, rgba(76, 29, 149, 0.25) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
                radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)
            `
        }}
    >
        <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-50" /> 
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-blue-900/5 pointer-events-none" />
        
        <Stage 
            width={dimensions.width} 
            height={dimensions.height}
            startDragDistance={0}
            onContentTouchStart={handleInput}
            onContentTouchMove={handleInput}
            onContentMouseMove={handleInput}
        >
            <Layer>
                {/* Stars */}
                {stars.map((star, i) => (
                    <Circle 
                        key={i}
                        x={star.x}
                        y={star.y}
                        radius={star.radius}
                        fill="white"
                        opacity={star.opacity}
                    />
                ))}

                {/* Bullets */}
                {bullets.map(b => (
                     <Rect 
                        key={b.id} x={b.x} y={b.y} width={4} height={12} 
                        fill="#60a5fa" 
                        shadowBlur={10} shadowColor="#3b82f6"
                    />
                ))}

                {/* Enemies */}
                {enemies.map(e => (
                    <EnemyShip 
                        key={e.id}
                        x={e.x}
                        y={e.y}
                        width={e.width}
                        height={e.height}
                        variant={e.variant || '1'}
                    />
                ))}

                {/* Player */}
                <Spaceship x={playerX} y={dimensions.height - 100} />
            </Layer>
        </Stage>
    </div>
  );
};

// Sub-component for Image to handle hook cleaner
import useImage from 'use-image';
import { Image as KonvaImage } from 'react-konva';

const Spaceship = ({ x, y }: { x: number, y: number }) => {
    const [image] = useImage('/spaceship_sprite.png');
    return (
        <KonvaImage 
            image={image} 
            x={x} 
            y={y} 
            width={60} 
            height={60} 
            offsetX={30} // Center pivot
            offsetY={30}
            shadowBlur={20} 
            shadowColor="#2563eb"
        />
    );
};

const EnemyShip = ({ x, y, width, height, variant }: { x: number, y: number, width: number, height: number, variant: string }) => {
    const [image] = useImage(`/enemy_${variant}.png`);
    return (
        <KonvaImage
            image={image}
            x={x + width/2}
            y={y + height/2}
            width={width}
            height={height}
            shadowBlur={10}
            shadowColor="#ef4444"
            // Rotate 180 deg if needed, or assume source is top down. 
            // Most "top down" assets point UP by default, so we might need rotation if they are coming down.
            rotation={180} 
            offsetX={width/2} // Pivot center
            offsetY={height/2}
        />
    );
};


