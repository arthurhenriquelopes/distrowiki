import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

export const useCountUp = ({ end, duration = 2000, delay = 0, suffix = "", prefix = "" }: UseCountUpOptions) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, end, duration, delay]);

  const formattedValue = `${prefix}${count}${suffix}`;
  
  return { count, formattedValue, ref, isVisible };
};
