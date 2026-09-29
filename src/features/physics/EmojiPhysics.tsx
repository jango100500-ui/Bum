import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const { Engine, Runner, Bodies, Composite, Body, Sleeping } = Matter;

const ALL_EMOJIS: string[] = [
  "🤡", "🤠", "😈", "👿", "👽",
  "👻", "💀", "☠️", "🤖", "🎃", "👾",
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
  "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅",
  "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌",
  "🐞", "🐜", "🦟", "🐢", "🐍", "🦎", "🐙", "🦑", "🦐", "🦞",
  "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🦈", "🐊", "🐅", "🐆",
  "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘",
  "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌",
  "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛", "🐓", "🦃", "🦚", "🦜",
  "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡", "🦦", "🦥", "🐁",
  "🐀", "🐿️", "🦔", "🐉", "🐲", "🦖", "🦕", "🌵", "🎄", "🌲",
  "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂",
  "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼",
  "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘",
  "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "🪐", "💫",
  "⭐", "🌟", "✨", "⚡", "☄️", "💥", "🔥", "🌪️", "🌈", "☀️",
  "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "🌨️", "🌩️", "❄️", "☃️",
  "⛄", "🌬️", "💨", "💧", "💦", "🫧", "🌊", "🍏", "🍎", "🍐",
  "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑",
  "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒",
  "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐",
  "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇",
  "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪",
  "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥫", "🍝",
  "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚",
  "🍘", "🍥", "🍢", "🥠", "🥡", "🍦", "🍧", "🍨", "🍩", "🍪",
  "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼",
  "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺",
  "🍻", "🥂", "🥃", "🫗", "🥤", "🧋", "🧃", "🧉", "🧊", "🥢",
  "🍽️", "🍴", "🥄", "🏺", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾",
  "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍",
  "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋",
  "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂",
  "🏋️", "🤼", "🤸", "🤺", "🧗", "🏇", "🚴", "🚵", "🏆", "🥇",
  "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️", "🎫", "🎟️", "🎪", "🤹",
  "🎭", "🩰", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🪘",
  "🎷", "🎺", "🪗", "🎸", "🪕", "🎻", "🎲", "♟️", "🎯", "🎳",
  "🎮", "🎰", "🧩", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓",
  "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵",
  "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟",
  "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇",
  "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚀", "🛸",
  "🚁", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "⚓", "🛟",
  "🪝", "⛽", "🚧", "🚦", "🚥", "🗺️", "🗿", "🗽", "🗼", "🏰",
  "🏯", "🏟️", "🎡", "🎢", "🎠", "⛲", "⛱️", "🏖️", "🏝️", "🏜️",
  "🌋", "⛰️", "🏔️", "🗻", "🏕️", "⛺", "🛖", "🏠", "🏡", "🏘️",
  "🏚️", "🏗️", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨",
  "🏪", "🏫", "🏩", "💒", "🏛️", "⛪", "🕌", "🛕", "🕍", "⛩️",
  "🕋", "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🕹️",
  "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥",
  "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️",
  "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋",
  "🪫", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵",
  "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰",
  "🪛", "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪚", "🔩", "⚙️", "🪤",
  "🧱", "⛓️", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️",
  "🛡️", "🚬", "⚰️", "🪦", "⚱️", "🔮", "📿", "🧿", "🪬", "💈",
  "⚗️", "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉", "🩸", "🧬",
  "🦠", "🧫", "🧪", "🌡️", "🧹", "🪠", "🧺", "🧻", "🚽", "🚰",
  "🚿", "🛁", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🔑", "🗝️",
  "🚪", "🪑", "🛋️", "🛏️", "🛌", "🧸", "🪆", "🖼️", "🪞", "🪟",
  "🛍️", "🛒", "🎁", "🎈", "🎏", "🎀", "🪄", "🪅", "🎊", "🎉",
  "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📮",
  "📯", "📦", "🏷️", "🪪", "📄", "📃", "📑", "📊", "📈", "📉",
  "🗒️", "🗓️", "📆", "📅", "📇", "🗃️", "🗳️", "🗄️", "📋", "📁",
  "📂", "🗂️", "🗞️", "📰", "📓", "📕", "📗", "📘", "📙", "📚",
  "📖", "🔖", "🧷", "🔗", "📎", "🖇️", "📐", "📏", "🧮", "📌",
  "📍", "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️", "📝", "✏️", "🔍",
  "🔎", "🔏", "🔐", "🔒", "🔓", "❤️", "🧡", "💛", "💚", "💙",
  "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞",
  "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️",
  "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉",
  "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓",
  "🆔", "⚛️", "☣️", "☢️", "📴", "📳", "🈶", "🈚", "🈸", "🈺",
  "🈷️", "✴️", "💮", "🉐", "㊙️", "㊗️", "🈴", "🈵", "🈹", "🈲",
  "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌", "⭕", "🛑", "⛔",
  "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱", "🔞",
  "📵", "🚭", "❗", "❕", "❓", "❔", "‼️", "⁉️", "🔅", "🔆",
  "〽️", "⚠️", "🚸", "🔱", "⚜️", "🔰", "♻️", "✅", "🈯", "💹",
  "❇️", "✳️", "❎", "🌐", "💠", "Ⓜ️", "🌀", "💤", "🏧"
];

const EMOJI_SIZE = 26;
const BODY_RADIUS = 13;
const SPAWN_INTERVAL_MS = 18;
const SPAWN_BATCH = 3;
const DROP_DELAY_MS = 500;
const WALL_THICKNESS = 150;

interface EmojiItem {
  body: Matter.Body;
  emoji: string;
}

const getOptimalEmojiCount = (width: number, height: number): number => {
  const area = width * height;
  const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency
    : 4;

  let baseCount = Math.round(area / 1800);

  if (cores <= 2) {
    baseCount = Math.round(baseCount * 0.65);
  } else if (cores <= 4) {
    baseCount = Math.round(baseCount * 0.85);
  } else if (cores >= 8) {
    baseCount = Math.round(baseCount * 1.25);
  }

  return Math.max(90, Math.min(baseCount, 280));
};

const getRandomEmojis = (count: number): string[] => {
  const shuffled = [...ALL_EMOJIS].sort(() => Math.random() - 0.5);
  const result: string[] = [];
  while (result.length < count) {
    const pick = shuffled[result.length % shuffled.length];
    result.push(pick);
  }
  return result;
};

export const EmojiPhysics = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth || document.documentElement.clientWidth || 390;
    let height = window.innerHeight || document.documentElement.clientHeight || 844;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    const totalCount = getOptimalEmojiCount(width, height);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const engine = Engine.create({
      enableSleeping: true,
      positionIterations: 8,
      velocityIterations: 8,
      gravity: { x: 0, y: 1.1, scale: 0.001 }
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    const ground = Bodies.rectangle(
      width / 2,
      height + WALL_THICKNESS / 2,
      width * 2,
      WALL_THICKNESS,
      { isStatic: true, friction: 0.8, restitution: 0.05 }
    );

    const leftWall = Bodies.rectangle(
      -WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height * 3,
      { isStatic: true, friction: 0.1, restitution: 0.1 }
    );

    const rightWall = Bodies.rectangle(
      width + WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height * 3,
      { isStatic: true, friction: 0.1, restitution: 0.1 }
    );

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    const activeList: EmojiItem[] = [];
    const pool = getRandomEmojis(totalCount);

    let animationFrameId: number;
    let spawnTimerId: number;
    let startTimeoutId: number;

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#f2f2f7';
      ctx.fillRect(0, 0, width, height);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${EMOJI_SIZE}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

      for (let i = 0; i < activeList.length; i++) {
        const item = activeList[i];
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

    const startSpawning = () => {
      let index = 0;

      spawnTimerId = window.setInterval(() => {
        if (index >= totalCount) {
          clearInterval(spawnTimerId);
          return;
        }

        const toSpawn = Math.min(SPAWN_BATCH, totalCount - index);

        for (let i = 0; i < toSpawn; i++) {
          const emoji = pool[index];
          const padding = 24;
          const x = padding + Math.random() * (width - padding * 2);
          const y = -BODY_RADIUS * 2 - Math.random() * 60;

          const body = Bodies.circle(x, y, BODY_RADIUS, {
            restitution: 0.1,
            friction: 0.5,
            frictionAir: 0.02,
            frictionStatic: 0.8,
            density: 0.002,
            sleepThreshold: 25
          });

          Composite.add(engine.world, body);
          activeList.push({ body, emoji });
          index++;
        }
      }, SPAWN_INTERVAL_MS);
    };

    startTimeoutId = window.setTimeout(startSpawning, DROP_DELAY_MS);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      const tiltX = Math.min(Math.max(e.gamma / 30, -1.2), 1.2);
      const tiltY = Math.min(Math.max((e.beta - 35) / 30, 0.4), 1.3);

      engine.gravity.x = tiltX;
      engine.gravity.y = tiltY;

      for (let i = 0; i < activeList.length; i++) {
        if (activeList[i].body.isSleeping) {
          Sleeping.set(activeList[i].body, false);
        }
      }
    };

    const enableOrientation = async () => {
      if (typeof window === 'undefined') return;

      const hasOrientation = 'DeviceOrientationEvent' in window;
      if (!hasOrientation) return;

      const anyEvent = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof anyEvent?.requestPermission === 'function') {
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
      width = window.innerWidth || document.documentElement.clientWidth || 390;
      height = window.innerHeight || document.documentElement.clientHeight || 844;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      Body.setPosition(ground, {
        x: width / 2,
        y: height + WALL_THICKNESS / 2
      });

      Body.setPosition(leftWall, {
        x: -WALL_THICKNESS / 2,
        y: height / 2
      });

      Body.setPosition(rightWall, {
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
        backgroundColor: '#f2f2f7'
      }}
    />
  );
};
