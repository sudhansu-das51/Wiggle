import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const PALETTE = ['#FFD400', '#FF5FA2', '#38BDF8', '#2FD88A', '#A78BFA']; // Sunny, Bubblegum, Sky, Meadow, Grape (no tangerine)

const BLOCK_ITEMS = [
  { label: 'H', type: 'text' },
  { label: 'E', type: 'text' },
  { label: 'L', type: 'text' },
  { label: 'L', type: 'text' },
  { label: 'O', type: 'text' },
  { label: '★', type: 'symbol' },
  { label: '♥', type: 'symbol' },
  { label: '☺', type: 'symbol' },
  { label: '✿', type: 'symbol' },
];

/**
 * BlockRain physics celebration component using Matter.js.
 * Renders 9 alphabet and symbol blocks raining down, stacking, and draggable.
 * @param {{ className?: string }} props
 */
export function BlockRain({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
    const skipPhysics = reducedMotion || isSaveData;

    let engine = null;
    let render = null;
    let runner = null;
    let spawnTimers = [];

    const width = container.clientWidth || 600;
    const height = 220;

    // Handle Reduced Motion: draw static piled blocks on canvas
    if (skipPhysics) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = width;
        canvas.height = height;
        const blockSize = 44;
        const startX = Math.max((width - BLOCK_ITEMS.length * 36) / 2, 20);

        BLOCK_ITEMS.forEach((item, i) => {
          const x = startX + (i % 5) * 48 + (Math.floor(i / 5) * 24);
          const y = height - 28 - (Math.floor(i / 5) * 46);
          const color = PALETTE[i % PALETTE.length];

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((i % 2 === 0 ? 0.08 : -0.06) * (i + 1));
          ctx.fillStyle = color;
          ctx.strokeStyle = '#1E1B4B';
          ctx.lineWidth = 3;

          // Rounded rectangle block
          ctx.beginPath();
          ctx.roundRect(-blockSize / 2, -blockSize / 2, blockSize, blockSize, 8);
          ctx.fill();
          ctx.stroke();

          // Block Label
          ctx.fillStyle = '#1E1B4B';
          ctx.font = 'bold 22px Fredoka, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.label, 0, 1);
          ctx.restore();
        });
      }
      return;
    }

    // Dynamic Physics with Matter.js
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

    engine = Engine.create({
      gravity: { y: 0.95 },
    });

    render = Render.create({
      canvas,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      },
    });

    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);

    const wallThickness = 120;
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2 - 12, width * 2, wallThickness, {
      isStatic: true,
      render: { visible: false },
    });
    const leftWall = Bodies.rectangle(-wallThickness / 2 + 8, height / 2, wallThickness, height * 4, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width + wallThickness / 2 - 8, height / 2, wallThickness, height * 4, {
      isStatic: true,
      render: { visible: false },
    });

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Mouse Interaction for dragging blocks
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.3,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Remove wheel listeners to protect page scrolling
    if (mouse.element) {
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    }

    const blockSize = 44;
    const createdBlocks = [];

    // Stagger block spawning by 80ms
    BLOCK_ITEMS.forEach((item, idx) => {
      const timer = setTimeout(() => {
        if (!engine) return;

        const spawnX = Math.min(
          Math.max(width / 2 + (Math.random() - 0.5) * (width * 0.6), 50),
          width - 50
        );
        const spawnY = -30 - idx * 10;

        const body = Bodies.rectangle(spawnX, spawnY, blockSize, blockSize, {
          chamfer: { radius: 8 },
          restitution: 0.4,
          friction: 0.8,
          density: 0.002,
          render: { visible: false }, // custom rendered in afterRender
        });

        // Give slight initial spin
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);

        Composite.add(engine.world, body);
        createdBlocks.push({ body, item, color: PALETTE[idx % PALETTE.length] });
      }, idx * 80);

      spawnTimers.push(timer);
    });

    // Custom Canvas Rendering for 3D sticker look
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      if (!ctx) return;

      createdBlocks.forEach(({ body, item, color }) => {
        const { x, y } = body.position;
        const angle = body.angle;
        const half = blockSize / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Block background
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1E1B4B';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.roundRect(-half, -half, blockSize, blockSize, 8);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = '#1E1B4B';
        ctx.font = 'bold 22px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, 0, 1);

        ctx.restore();
      });
    });

    return () => {
      spawnTimers.forEach((t) => clearTimeout(t));
      if (render) Render.stop(render);
      if (runner) Runner.stop(runner);
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={`enq-block-rain ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="enq-block-rain__canvas"
        style={{ touchAction: 'pan-y' }}
      />
    </div>
  );
}

export default BlockRain;
