import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { MiniBus } from './MiniBus';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const STOPS = [
  { id: 1, label: 'You' },
  { id: 2, label: 'Your child' },
  { id: 3, label: 'Your visit' },
  { id: 4, label: 'Send' },
];

// Positions along the road in percentages (0% to 80%, leaving room for school gate on the right)
const STOP_POSITIONS = [4, 28, 54, 78];
const GATE_POSITION = 96;

/**
 * BusProgress stepper showing road, stops, sticker school bus, and school gate.
 * @param {{
 *   currentStep: number, // 1 to 4
 *   isEnteringGate?: boolean,
 *   onGateEnterComplete?: () => void,
 *   className?: string
 * }} props
 */
export function BusProgress({
  currentStep = 1,
  isEnteringGate = false,
  onGateEnterComplete,
  className = '',
}) {
  const [wheelRotation, setWheelRotation] = useState(0);
  const wheelRotationRef = useRef(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const roadRef = useRef(null);
  const busRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const stopsRef = useRef([]);
  const tripTlRef = useRef(null);

  const prevStepRef = useRef(currentStep);
  const reducedMotion = useReducedMotion();

  // Escape key skips final gate animation
  useEffect(() => {
    if (!isEnteringGate) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        tripTlRef.current?.progress(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnteringGate]);

  // Handle bus travel when step changes
  useEffect(() => {
    const prev = prevStepRef.current;
    const next = currentStep;
    prevStepRef.current = next;

    const busEl = busRef.current;
    if (!busEl) return;

    const targetIndex = Math.min(Math.max(next - 1, 0), 3);
    const targetPos = STOP_POSITIONS[targetIndex];

    if (reducedMotion) {
      gsap.set(busEl, { left: `${targetPos}%` });
      return;
    }

    // Kill any ongoing trip immediately
    if (tripTlRef.current) {
      tripTlRef.current.kill();
    }

    const isBackward = next < prev;
    if (isBackward) {
      setIsFlipped(true);
    }

    const distanceUnits = Math.abs(next - prev);
    const rotationDelta = (isBackward ? -1 : 1) * distanceUnits * 360;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsFlipped(false);
        // Pop the newly reached stop dot
        const reachedStopEl = stopsRef.current[targetIndex];
        if (reachedStopEl) {
          gsap.fromTo(
            reachedStopEl,
            { scale: 1.4 },
            { scale: 1, duration: 0.25, ease: 'back.out(2)' }
          );
        }
      },
    });
    tripTlRef.current = tl;

    // Wheel rotation state tracker proxy
    const startRot = wheelRotationRef.current;
    const proxy = { rot: startRot, left: parseFloat(busEl.style.left) || STOP_POSITIONS[prev - 1] };

    tl.to(proxy, {
      left: targetPos,
      rot: startRot + rotationDelta,
      duration: 0.65,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (busEl) {
          busEl.style.left = `${proxy.left}%`;
        }
        wheelRotationRef.current = proxy.rot;
        setWheelRotation(proxy.rot);
      },
    });

    // Subtle start dip and arrival settle
    tl.fromTo(
      busEl,
      { y: -3 },
      { y: 0, duration: 0.35, ease: 'bounce.out' },
      '<'
    );

    return () => {
      tl.kill();
    };
  }, [currentStep, reducedMotion]);

  // Handle final gate entry sequence
  useEffect(() => {
    if (!isEnteringGate) return;

    if (reducedMotion) {
      onGateEnterComplete?.();
      return;
    }

    const busEl = busRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        onGateEnterComplete?.();
      },
    });
    tripTlRef.current = tl;

    // 1. Bus rolls past stop 4 towards the gate
    tl.to(busEl, {
      left: `${GATE_POSITION}%`,
      duration: 0.75,
      ease: 'power1.inOut',
      onUpdate: () => {
        setWheelRotation((prev) => prev + 15);
      },
    });

    // 2. Gate doors swing open outward (+/- 100deg)
    if (leftDoor && rightDoor) {
      tl.to(
        leftDoor,
        {
          rotateY: -100,
          duration: 0.5,
          ease: 'power2.out',
          transformOrigin: '0% 50%',
        },
        '-=0.35'
      );
      tl.to(
        rightDoor,
        {
          rotateY: 100,
          duration: 0.5,
          ease: 'power2.out',
          transformOrigin: '100% 50%',
        },
        '<'
      );
    }

    // 3. Bus enters school gate, shrinks and fades out
    tl.to(
      busEl,
      {
        scale: 0.65,
        opacity: 0,
        x: 10,
        duration: 0.45,
        ease: 'power1.in',
      },
      '-=0.15'
    );

    return () => {
      tl.kill();
    };
  }, [isEnteringGate, onGateEnterComplete, reducedMotion]);

  return (
    <nav className={`enq-progress ${className}`} aria-label="Enquiry progress">
      <div ref={roadRef} className="enq-road">
        {/* Road Surface and Center Dashed Stripe */}
        <div className="enq-road__track" aria-hidden="true">
          <div className="enq-road__line enq-road__line--solid" />
          <div
            className="enq-road__line enq-road__line--visited"
            style={{ width: `${STOP_POSITIONS[currentStep - 1]}%` }}
          />
        </div>

        {/* Bus Actor */}
        <div
          ref={busRef}
          className="enq-road__bus-holder"
          style={{ left: `${STOP_POSITIONS[currentStep - 1]}%` }}
        >
          <MiniBus wheelRotation={wheelRotation} isFlipped={isFlipped} />
        </div>

        {/* Stops (Ordered List for screen readers) */}
        <ol className="enq-stops">
          {STOPS.map((stop, idx) => {
            const isCompleted = currentStep > stop.id;
            const isCurrent = currentStep === stop.id;

            return (
              <li
                key={stop.id}
                className={`enq-stop ${isCompleted ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''}`}
                style={{ left: `${STOP_POSITIONS[idx]}%` }}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  ref={(el) => (stopsRef.current[idx] = el)}
                  className="enq-stop__sign sticker"
                  aria-hidden="true"
                >
                  <span className="enq-stop__dot" />
                </div>
                <span className="enq-stop__label note">
                  <span className="enq-stop__number">{stop.id}. </span>
                  {stop.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* School Building & Gate at Road End */}
        <div className="enq-school-gate" aria-hidden="true">
          <div className="enq-school-building">
            <div className="enq-school-roof" />
            <div className="enq-school-flag" />
          </div>

          <div className="enq-gate-doors">
            <div ref={leftDoorRef} className="enq-gate-door enq-gate-door--left" />
            <div ref={rightDoorRef} className="enq-gate-door enq-gate-door--right" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BusProgress;
