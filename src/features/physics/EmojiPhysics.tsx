import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const { Engine, Runner, Bodies, Composite } = Matter;

const EMOJI_SIZE = 28;
const BODY_RADIUS = 14;
const TOTAL_EMOJIS = 220;
const SPAWN_INTERVAL_MS = 20;
const SPAWN_BATCH = 3;
const DROP_DELAY_MS = 700;

interface EmojiBody {
  body: Matter.Body;
  emoji: string;
}

export const EmojiPhysics = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 }
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    const WALL_THICKNESS = 200;

    let ground = Bodies.rectangle(
      width / 2,
      height + WALL_THICKNESS / 2,
      width * 2,
      WALL_THICKNESS,
      { isStatic: true, friction: 0.3, restitution: 0.2 }
    );

    let leftWall = Bodies.rectangle(
      -WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height * 3,
      { isStatic: true, friction: 0.1, restitution: 0.2 }
    );

    let rightWall = Bodies.rectangle(
      width + WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height * 3,
      { isStatic: true, friction: 0.1, restitution: 0.2 }
    );

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    const items: EmojiBody[] = [];
    let animationFrameId: number;
    let spawnTimerId: number;
    let startTimeoutId: number;

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${EMOJI_SIZE}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const { x, y } = item.body.position;
        const angle = item.body.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(item.emoji, 0, 0);
        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const spawnEmojis = (emojiList: string[]) => {
      let spawned = 0;

      spawnTimerId = window.setInterval(() => {
        if (spawned >= TOTAL_EMOJIS) {
          clearInterval(spawnTimerId);
          return;
        }

        const countToSpawn = Math.min(SPAWN_BATCH, TOTAL_EMOJIS - spawned);

        for (let i = 0; i < countToSpawn; i++) {
          const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
          const padding = 20;
          const x = padding + Math.random() * (width - padding * 2);
          const y = -BODY_RADIUS * 2 - Math.random() * 80;

          const body = Bodies.circle(x, y, BODY_RADIUS, {
            restitution: 0.35,
            friction: 0.15,
            frictionAir: 0.015,
            density: 0.002
          });

          Composite.add(engine.world, body);
          items.push({ body, emoji: randomEmoji });
          spawned++;
        }
      }, SPAWN_INTERVAL_MS);
    };

    fetch('/emojis.json')
      .then((res) => res.json())
      .then((emojiList: string[]) => {
        startTimeoutId = window.setTimeout(() => {
          spawnEmojis(emojiList);
        }, DROP_DELAY_MS);
      })
      .catch(() => {});

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      const tiltX = Math.min(Math.max(e.gamma / 35, -1.2), 1.2);
      const tiltY = Math.min(Math.max((e.beta - 40) / 35, 0.4), 1.4);

      engine.gravity.x = tiltX;
      engine.gravity.y = tiltY;
    };

    const enableOrientation = async () => {
      const anyEvent = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof anyEvent.requestPermission === 'function') {
        try {
          const state = await anyEvent.requestPermission();
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch {}
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    window.addEventListener('pointerdown', enableOrientation, { once: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      Matter.Body.setPosition(ground, {
        x: width / 2,
        y: height + WALL_THICKNESS / 2
      });

      Matter.Body.setPosition(leftWall, {
        x: -WALL_THICKNESS / 2,
        y: height / 2
      });

      Matter.Body.setPosition(rightWall, {
        x: width + WALL_THICKNESS / 2,
        y: height / 2
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointerdown', enableOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('resize', handleResize);
      clearTimeout(startTimeoutId);
      clearInterval(spawnTimerId);
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: '#f3f3f5'
      }}
    />
  );
};
