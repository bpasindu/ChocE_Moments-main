import { useEffect } from 'react';
import './ClickSpark.css';

interface ClickSparkProps {
  color?: string;
  particleCount?: number;
  sparkSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  color = '#C7A07A',
  particleCount = 8,
  sparkSize = 8,
  minSpeed = 50,
  maxSpeed = 150
}) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Create container for sparks
      const container = document.createElement('div');
      container.className = 'click-spark';
      container.style.left = `${clientX}px`;
      container.style.top = `${clientY}px`;
      document.body.appendChild(container);

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-spark__particle';
        
        // Random angle and distance
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = minSpeed + Math.random() * (maxSpeed - minSpeed);
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.width = `${sparkSize}px`;
        particle.style.height = `${sparkSize}px`;
        particle.style.backgroundColor = color;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        container.appendChild(particle);
      }

      // Remove after animation
      setTimeout(() => {
        document.body.removeChild(container);
      }, 800);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [color, particleCount, sparkSize, minSpeed, maxSpeed]);

  return null;
};

export default ClickSpark;
