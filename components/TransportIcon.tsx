import { TransportMode } from '@/lib/data';

interface TransportIconProps {
  mode?: TransportMode;
  className?: string;
}

export default function TransportIcon({ mode, className = "w-6 h-6" }: TransportIconProps) {
  const iconClass = `${className} text-gray-700`;
  
  // 圖標文件映射
  const iconMap: Record<string, string> = {
    'airplane': '/icons/plane-alt.svg',
    'bus': '/icons/bus-alt.svg',
    'car': '/icons/car-alt.svg',
    'walking': '/icons/walking-alt.svg',
    'train': '/icons/train.svg',
    'boat': '/icons/ship-alt.svg',
  };

  if (!mode || !iconMap[mode]) {
    // 默認位置圖標
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    );
  }

  return (
    <img
      src={iconMap[mode]}
      alt={mode}
      className={iconClass}
      style={{ 
        filter: 'brightness(0) invert(1)',
        objectFit: 'contain'
      }}
    />
  );
}
