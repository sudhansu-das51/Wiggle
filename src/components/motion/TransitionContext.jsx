import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const TransitionContext = createContext(null);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check sessionStorage safely for whether the intro has already played
  const [introDone, setIntroDone] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return window.sessionStorage.getItem('wiggle_intro_seen') === 'true';
      }
    } catch {
      // Ignore sessionStorage exceptions
    }
    return false;
  });

  const markIntroDone = useCallback(() => {
    setIntroDone(true);
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('wiggle_intro_seen', 'true');
      }
    } catch {
      // Ignore sessionStorage exceptions
    }
  }, []);

  // Ref to hold the curtain transition callback registered by PageTransition
  const transitionRunnerRef = useRef(null);

  const registerTransitionRunner = useCallback((runner) => {
    transitionRunnerRef.current = runner;
  }, []);

  const go = useCallback((to) => {
    if (!to) return;

    const pageTransitionEnabled = siteConfig?.animations?.pageTransition !== false;

    // Direct navigation if reduced motion, disabled in config, or no runner registered
    if (reducedMotion || !pageTransitionEnabled || !transitionRunnerRef.current || isTransitioning) {
      navigate(to);
      return;
    }

    setIsTransitioning(true);
    transitionRunnerRef.current(to, () => {
      setIsTransitioning(false);
    });
  }, [navigate, reducedMotion, isTransitioning]);

  const value = {
    go,
    isTransitioning,
    introDone,
    markIntroDone,
    registerTransitionRunner,
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}
