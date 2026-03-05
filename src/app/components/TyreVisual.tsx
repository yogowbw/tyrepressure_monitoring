import { Tyre } from '../types';
import { TyreTooltip } from './TyreTooltip';
import { useState } from 'react';

interface Props {
  tyre: Tyre;
  onTooltipChange: (isVisible: boolean) => void;
}

function getBrandCode(brand: string): string {
  const brandCodes: { [key: string]: string } = {
    'Bridgestone': 'BS',
    'Michelin': 'MI',
    'Goodyear': 'GY',
    'Triangle': 'TR',
    'Tianli': 'TL',
    'Westlake': 'WL',
    'Maxam': 'MX'
  };
  return brandCodes[brand] || brand.substring(0, 2).toUpperCase();
}

export function TyreVisual({ tyre, onTooltipChange }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    onTooltipChange(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onTooltipChange(false);
  };

  const getBorderColor = () => {
    if (tyre.status === 'low') return 'border-red-500 dark:border-red-600';
    if (tyre.status === 'over') return 'border-orange-500 dark:border-orange-600';
    return 'border-green-500 dark:border-green-600';
  };

  const getBgColor = () => {
    if (tyre.status === 'low') return 'bg-red-50 dark:bg-red-950';
    if (tyre.status === 'over') return 'bg-orange-50 dark:bg-orange-950';
    return 'bg-green-50 dark:bg-green-950';
  };

  const getPressureColor = () => {
    if (tyre.status === 'low') return 'text-red-600 dark:text-red-500';
    if (tyre.status === 'over') return 'text-orange-600 dark:text-orange-500';
    return 'text-green-600 dark:text-green-500';
  };

  return (
    <div 
      className={`${getBgColor()} border-2 ${getBorderColor()} rounded-lg p-3 w-[110px] h-[170px] flex flex-col relative cursor-pointer hover:shadow-md transition-all`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      {showTooltip && <TyreTooltip tyre={tyre} />}

      {/* Position and Brand Code */}
      <div className="flex items-center justify-between text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
        <span>Pos {tyre.position}</span>
        <span>{getBrandCode(tyre.brand)}</span>
      </div>
      
      {/* Pressure */}
      <div className="mb-2 leading-none text-center">
        <span className={`text-3xl font-bold tabular-nums ${getPressureColor()}`}>
          {tyre.pressure}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">PSI</span>
      </div>

      {/* Lifetime */}
      <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 text-center">
        {(tyre.lifetime / 1000).toFixed(3)} hrs
      </div>

      {/* Status Badge */}
      <div className={`mt-auto text-xs font-bold uppercase text-center py-1.5 rounded ${
        tyre.status === 'low' ? 'bg-red-500 text-white' : 
        tyre.status === 'over' ? 'bg-orange-500 text-white' : 
        'bg-green-500 text-white'
      }`}>
        {tyre.status === 'low' ? 'LOW' : tyre.status === 'over' ? 'OVER' : 'OK'}
      </div>
    </div>
  );
}