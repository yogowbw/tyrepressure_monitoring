import { Tyre } from '../types';
import { useState } from 'react';
import { TyreTooltip } from './TyreTooltip';

interface Props {
  tyre: Tyre;
  onTooltipChange: (isVisible: boolean) => void;
}

export function TyreVisualMinimal({ tyre, onTooltipChange }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    onTooltipChange(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onTooltipChange(false);
  };

  const getBgColor = () => {
    if (tyre.status === 'low') return 'bg-red-500';
    if (tyre.status === 'over') return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div 
      className={`${getBgColor()} rounded w-[32px] h-[32px] flex items-center justify-center relative cursor-pointer hover:opacity-80 transition-opacity`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      {showTooltip && <TyreTooltip tyre={tyre} />}

      {/* Pressure Only */}
      <span className="text-white text-xs font-bold tabular-nums">
        {tyre.pressure}
      </span>
    </div>
  );
}
