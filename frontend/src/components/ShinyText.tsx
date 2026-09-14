import React, { CSSProperties, FC } from 'react';
import './ShinyText.css';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: 'left' | 'right';
  yoyo?: boolean;
  pauseOnHover?: boolean;
}

const ShinyText: FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
  delay = 0,
  color = '#27205F',
  shineColor = '#FFC94A',
  spread = 100,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${pauseOnHover ? 'pause-on-hover' : ''} ${className}`}
      style={{
        '--shiny-text-duration': animationDuration,
        '--shiny-text-delay': `${delay}s`,
        '--shiny-text-color': color,
        '--shiny-text-shine-color': shineColor,
        '--shiny-text-spread': `${spread}px`,
        '--shiny-text-dir': direction === 'left' ? '1' : '-1',
      } as CSSProperties}
    >
      {text}
    </span>
  );
};

export default ShinyText;
