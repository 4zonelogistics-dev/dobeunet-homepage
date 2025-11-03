import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  debounceMs?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true, debounceMs = 50 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);

  const handleVisibilityChange = useCallback((isIntersecting: boolean) => {
    if (isUnmountedRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isUnmountedRef.current) return;

      if (isIntersecting) {
        setIsVisible(true);
        if (triggerOnce && observerRef.current && elementRef.current) {
          observerRef.current.unobserve(elementRef.current);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    }, debounceMs);
  }, [triggerOnce, debounceMs]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    isUnmountedRef.current = false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        handleVisibilityChange(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(element);

    return () => {
      isUnmountedRef.current = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, handleVisibilityChange]);

  return { elementRef, isVisible };
}
