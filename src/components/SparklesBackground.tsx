import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SparklesBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

interface SparkleProps {
  size: number;
  color: string;
  style: React.CSSProperties;
}

export const SparklesBackground = ({
  className = "",
  children,
}: SparklesBackgroundProps) => {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const newSparkles = [];
    
    for (let i = 0; i < 50; i++) {
      newSparkles.push({
        size: Math.random() * 4 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 2 + 1}s`,
        },
      });
    }
    
    setSparkles(newSparkles);
    
    // Re-generate sparkles on window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSparkles(prev => {
        return prev.map(sparkle => ({
          ...sparkle,
          style: {
            ...sparkle.style,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          },
        }));
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden ${className}`}
    >
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            ...sparkle.style,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: Number(sparkle.style.animationDuration.replace('s', '')),
            delay: Number(sparkle.style.animationDelay.replace('s', '')),
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 