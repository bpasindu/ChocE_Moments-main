import { useEffect, useRef, useState } from 'react';
import './SplitText.css';

interface SplitTextProps {
  text: string;
  delay?: number;
  charDelay?: number;
  className?: string;
}

const SplitText: React.FC<SplitTextProps> = ({ 
  text, 
  delay = 0, 
  charDelay = 0.03,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const words = text.split(' ');

  return (
    <span ref={ref} className={`split-text ${className}`}>
      {isVisible && words.map((word, wordIndex) => (
        <span key={wordIndex} className="split-text__word">
          {word.split('').map((char, charIndex) => {
            const totalDelay = (wordIndex * word.length + charIndex) * charDelay;
            return (
              <span
                key={charIndex}
                className="split-text__char"
                style={{
                  animationDelay: `${totalDelay}s`
                }}
              >
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
