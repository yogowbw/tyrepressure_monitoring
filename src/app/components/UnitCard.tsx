import { Unit } from '../types';
import { TyreVisual } from './TyreVisual';

interface Props {
  unit: Unit;
  onTooltipChange: (isVisible: boolean) => void;
}

export function UnitCard({ unit, onTooltipChange }: Props) {
  const issueCount = unit.tyres.filter(t => t.status !== 'normal').length;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg p-5 w-full transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{unit.unitCode}</h3>
        {issueCount > 0 && (
          <div className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold">
            {issueCount} ALERT{issueCount > 1 ? 'S' : ''}
          </div>
        )}
      </div>

      {/* Truck Layout - New Design */}
      <div className="flex flex-col items-center relative">
        {/* Front Axle - 2 tyres */}
        <div className="relative flex items-center justify-center gap-4">
          {/* Left Front Tyre */}
          <TyreVisual tyre={unit.tyres[0]} onTooltipChange={onTooltipChange} />
          
          {/* Horizontal connecting line with center dot */}
          <div className="relative flex items-center justify-center" style={{ width: '100px' }}>
            <div className="absolute w-full h-0.5 bg-neutral-800 dark:bg-neutral-300"></div>
            <div className="relative w-3.5 h-3.5 bg-neutral-800 dark:bg-neutral-300 rounded-full z-10"></div>
          </div>
          
          {/* Right Front Tyre */}
          <TyreVisual tyre={unit.tyres[1]} onTooltipChange={onTooltipChange} />
        </div>

        {/* Vertical Connector between axles - Absolute positioned to overlap */}
        <div className="absolute w-0.5 bg-neutral-800 dark:bg-neutral-300 z-0" style={{ height: '220px', top: '50%', transform: 'translateY(-50%)' }}></div>

        {/* Rear Axle - 4 tyres */}
        <div className="relative flex items-center justify-center gap-4 mt-20">
          {/* Left dual tyres */}
          <div className="flex gap-2">
            <TyreVisual tyre={unit.tyres[2]} onTooltipChange={onTooltipChange} />
            <TyreVisual tyre={unit.tyres[3]} onTooltipChange={onTooltipChange} />
          </div>
          
          {/* Horizontal connecting line with center dot */}
          <div className="relative flex items-center justify-center" style={{ width: '100px' }}>
            <div className="absolute w-full h-0.5 bg-neutral-800 dark:bg-neutral-300"></div>
            <div className="relative w-3.5 h-3.5 bg-neutral-800 dark:bg-neutral-300 rounded-full z-10"></div>
          </div>
          
          {/* Right dual tyres */}
          <div className="flex gap-2">
            <TyreVisual tyre={unit.tyres[4]} onTooltipChange={onTooltipChange} />
            <TyreVisual tyre={unit.tyres[5]} onTooltipChange={onTooltipChange} />
          </div>
        </div>
      </div>
    </div>
  );
}