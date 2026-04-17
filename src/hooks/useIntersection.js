import { useEffect, useRef, useState } from 'react';

/**
 * Observe when an element enters the viewport.
 *
 * @param {object} options
 * @param {number} options.threshold - Ratio of element visible to trigger (0-1).
 * @param {string} options.rootMargin - Margin around root (e.g. "100px").
 * @param {boolean} options.once - If true, stop observing after first visible.
 * @returns {{ ref: React.MutableRefObject, isVisible: boolean }}
 */
export function useIntersection({
  threshold = 0.15,
  rootMargin = '100px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
