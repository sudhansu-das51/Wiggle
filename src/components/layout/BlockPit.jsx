import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './BlockPit.css';

const BLOCK_COLORS = ['#FFD400', '#FF5FA2', '#38BDF8', '#2FD88A', '#A78BFA', '#FFD400']; // W-I-G-G-L-E
const DARKER_COLORS = {
  '#FFD400': '#D4A700', // Sunny dark under-bevel
  '#FF5FA2': '#D93680', // Bubblegum dark under-bevel
  '#38BDF8': '#0284C7', // Sky dark under-bevel
  '#2FD88A': '#059669', // Meadow dark under-bevel
  '#A78BFA': '#7C3AED', // Grape dark under-bevel
};

/**
 * Footer BlockPit component using Matter.js physics engine.
 * 3D tactile preschool toy blocks centered inside the outer playbox tray.
 */
export function BlockPit() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const hasInitialized = useRef(false);

  const brandName = (siteConfig?.brand?.name || 'Wiggle').toUpperCase();
  const letters = brandName.split('');

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined' || !containerRef.current) return;

    let engine, render, runner;

    const initPhysics = () => {
      if (hasInitialized.current || !canvasRef.current) return;
      hasInitialized.current = true;

      const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

      const containerWidth = containerRef.current.clientWidth || 560;
      const width = Math.min(Math.max(containerWidth, 340), 580);
      const height = 130;

      engine = Engine.create({
        gravity: { y: 0.8 },
      });

      render = Render.create({
        canvas: canvasRef.current,
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

      const blockSize = 46;
      // Vertically center the blocks: block center at 65px (height/2), block bottom at 65 + 23 = 88px
      const groundY = 88;
      const wallThickness = 200; // Thick walls completely prevent any block escaping

      // Boundaries: ground at 88px puts the blocks in the exact vertical center of the 130px box
      const ground = Bodies.rectangle(width / 2, groundY + wallThickness / 2, width * 3, wallThickness, {
        isStatic: true,
        render: { visible: false },
      });
      const leftWall = Bodies.rectangle(-wallThickness / 2 + 4, height / 2, wallThickness, height * 4, {
        isStatic: true,
        render: { visible: false },
      });
      const rightWall = Bodies.rectangle(width + wallThickness / 2 - 4, height / 2, wallThickness, height * 4, {
        isStatic: true,
        render: { visible: false },
      });
      const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2 + 4, width * 3, wallThickness, {
        isStatic: true,
        render: { visible: false },
      });

      Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

      // Calculate initial horizontal centering for all 6 blocks
      const spacing = 12;
      const totalSpan = letters.length * blockSize + (letters.length - 1) * spacing;
      const startX = (width - totalSpan) / 2 + blockSize / 2;

      const blocks = [];

      letters.forEach((letter, index) => {
        const xPos = startX + index * (blockSize + spacing);
        const yPos = 24 - index * 6; // Gentle staggered drop directly onto the centered shelf

        const block = Bodies.rectangle(xPos, yPos, blockSize, blockSize, {
          chamfer: { radius: 8 },
          restitution: 0.45,
          friction: 0.4,
          render: {
            visible: false, // We render custom rich 3D tactile blocks in afterRender!
          },
        });
        blocks.push(block);
      });

      Composite.add(engine.world, blocks);

      // Keep blocks strictly inside the tray boundaries even on vigorous tosses
      Events.on(engine, 'beforeUpdate', () => {
        blocks.forEach((b) => {
          if (b.position.x < blockSize / 2 + 4) {
            Body.setPosition(b, { x: blockSize / 2 + 6, y: b.position.y });
            Body.setVelocity(b, { x: Math.abs(b.velocity.x) * 0.5, y: b.velocity.y });
          } else if (b.position.x > width - blockSize / 2 - 4) {
            Body.setPosition(b, { x: width - blockSize / 2 - 6, y: b.position.y });
            Body.setVelocity(b, { x: -Math.abs(b.velocity.x) * 0.5, y: b.velocity.y });
          }
          if (b.position.y < blockSize / 2 + 4) {
            Body.setPosition(b, { x: b.position.x, y: blockSize / 2 + 6 });
            Body.setVelocity(b, { x: b.velocity.x, y: Math.abs(b.velocity.y) * 0.5 });
          } else if (b.position.y > groundY - blockSize / 2 + 2) {
            Body.setPosition(b, { x: b.position.x, y: groundY - blockSize / 2 });
          }
        });
      });

      // Mouse Dragging Constraint
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.25,
          render: { visible: false },
        },
      });

      Composite.add(engine.world, mouseConstraint);
      render.mouse = mouse;

      // Remove wheel listeners so Matter does not interfere with page scrolling
      if (mouse.element) {
        mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
        mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      }

      // Render 3D tactile toy blocks & centered shelf on each physics frame
      Events.on(render, 'afterRender', () => {
        const ctx = render.context;
        if (!ctx) return;

        // 1. Draw subtle playroom shelf baseline under the resting blocks
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 247, 234, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(startX - 24, groundY + 1);
        ctx.lineTo(startX + totalSpan - blockSize + 24, groundY + 1);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // 2. Draw each 3D toy block
        blocks.forEach((body, idx) => {
          const { x, y } = body.position;
          const angle = body.angle;
          const letter = letters[idx];
          const color = BLOCK_COLORS[idx % BLOCK_COLORS.length];
          const darkerColor = DARKER_COLORS[color] || '#333';
          const size = blockSize;
          const r = 8;
          const half = size / 2;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);

          // A. Soft Drop Shadow underneath block
          ctx.save();
          ctx.fillStyle = 'rgba(15, 20, 50, 0.35)';
          ctx.beginPath();
          ctx.roundRect(-half + 2, -half + 5, size, size, r);
          ctx.fill();
          ctx.restore();

          // B. Outer Ink Border
          ctx.fillStyle = '#1E1B4B';
          ctx.beginPath();
          ctx.roundRect(-half - 1.5, -half - 1.5, size + 3, size + 5, r);
          ctx.fill();

          // C. 3D Under-bevel for tactile block thickness
          ctx.fillStyle = darkerColor;
          ctx.beginPath();
          ctx.roundRect(-half, -half + 3, size, size - 1, r);
          ctx.fill();

          // D. Main Face of Block
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(-half, -half, size, size - 3.5, r);
          ctx.fill();

          // E. Glossy Top-Left Highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.lineWidth = 1.75;
          ctx.beginPath();
          ctx.moveTo(-half + r, -half + 2);
          ctx.lineTo(half - r, -half + 2);
          ctx.moveTo(-half + 2, -half + r);
          ctx.lineTo(-half + 2, half - r - 4);
          ctx.stroke();

          // F. Inner Inset Border
          ctx.strokeStyle = 'rgba(30, 27, 75, 0.22)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-half + 4, -half + 4, size - 8, size - 11, r - 3);
          ctx.stroke();

          // G. Embossed Typography
          ctx.font = '800 23px "Bricolage Grotesque", system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Light highlight reflection below letter
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText(letter, 0.5, 0);

          // Deep ink letter
          ctx.fillStyle = '#1E1B4B';
          ctx.fillText(letter, 0, -1.5);

          ctx.restore();
        });
      });
    };

    // IntersectionObserver to initialize physics when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initPhysics();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (render) Matter.Render.stop(render);
      if (runner) Matter.Runner.stop(runner);
      if (engine) {
        Matter.Composite.clear(engine.world, false);
        Matter.Engine.clear(engine);
      }
    };
  }, [reducedMotion, brandName, letters]);

  return (
    <div ref={containerRef} className="block-pit-wrapper" aria-hidden="true">
      <div className="block-pit-canvas-container">
        {reducedMotion ? (
          <div className="block-pit-static">
            {letters.map((char, i) => (
              <div
                key={i}
                className="block-pit-static-cube"
                style={{
                  backgroundColor: BLOCK_COLORS[i % BLOCK_COLORS.length],
                  borderBottomColor: DARKER_COLORS[BLOCK_COLORS[i % BLOCK_COLORS.length]],
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
      <span className="block-pit-hint">Wiggle blocks! Pick them up and toss them.</span>
    </div>
  );
}
