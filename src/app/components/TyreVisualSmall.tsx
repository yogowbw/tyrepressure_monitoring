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

export function TyreVisualSmall({ tyre, onTooltipChange }: Props) {
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
    if (tyre.status === 'low') return 'border-red-500';
    if (tyre.status === 'over') return 'border-orange-500';
    return 'border-green-500';
  };

  const getBgColor = () => {
    if (tyre.status === 'low') return 'bg-red-50';
    if (tyre.status === 'over') return 'bg-orange-50';
    return 'bg-green-50';
  };

  const getPressureColor = () => {
    if (tyre.status === 'low') return 'text-red-600';
    if (tyre.status === 'over') return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div 
      className={`${getBgColor()} border-2 ${getBorderColor()} rounded-md p-1.5 w-[60px] h-[100px] flex flex-col relative cursor-pointer hover:shadow-md transition-shadow`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      {showTooltip && <TyreTooltip tyre={tyre} />}

      {/* Position and Brand Code */}
      <div className="flex items-center justify-between text-[8px] font-medium text-neutral-600 mb-1">
        <span>P{tyre.position}</span>
        <span>{getBrandCode(tyre.brand)}</span>
      </div>
      
      {/* Pressure */}
      <div className="mb-1 leading-none text-center">
        <span className={`text-lg font-bold tabular-nums ${getPressureColor()}`}>
          {tyre.pressure}
        </span>
        <span className="text-[8px] text-neutral-500 ml-0.5">PSI</span>
      </div>

      {/* Lifetime */}
      <div className="text-[8px] text-neutral-600 mb-1 text-center">
        {(tyre.lifetime / 1000).toFixed(1)}k
      </div>

      {/* Status Badge */}
      <div className={`mt-auto text-[8px] font-bold uppercase text-center py-0.5 rounded ${ 
        tyre.status === 'low' ? 'bg-red-500 text-white' : 
        tyre.status === 'over' ? 'bg-orange-500 text-white' : 
        'bg-green-500 text-white'
      }`}>
        {tyre.status === 'low' ? 'LOW' : tyre.status === 'over' ? 'OVER' : 'OK'}
      </div>
    </div>
  );
}