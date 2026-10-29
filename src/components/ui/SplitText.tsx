import React from 'react';
import { motion } from 'framer-motion';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  className = '',
  delay = 0,
  stagger = 0.03,
}) => {
  const words = children.split(' ');

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <React.Fragment key={wordIndex}>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => {
              const overallIndex = wordIndex * 6 + charIndex;
              return (
                <motion.span
                  key={charIndex}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: delay + overallIndex * stagger,
                    ease: [0.19, 1, 0.22, 1], // New Engen's signature snappy Expo Out
                  }}
                  className="inline-block origin-bottom"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </React.Fragment>
      ))}
    </span>
  );
};
