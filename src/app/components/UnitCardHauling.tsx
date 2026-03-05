import { Unit } from '../types';
import { TyreVisualMinimal } from './TyreVisualMinimal';

interface Props {
  unit: Unit;
  onTooltipChange: (isVisible: boolean) => void;
}

export function UnitCardHauling({ unit, onTooltipChange }: Props) {
  const issueCount = unit.tyres.filter(t => t.status !== 'normal').length;

  // Safety check - ensure we have 54 tyres
  if (unit.tyres.length < 54) {
    return (
      <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-5 w-full">
        <div className="text-center text-neutral-600">
          Invalid tyre data: Expected 54 tyres, got {unit.tyres.length}
        </div>
      </div>
    );
  }

  // Helper to render a single axle
  const renderAxle = (startIndex: number, isSingle: boolean) => {
    if (isSingle) {
      // Single tyres (Axle 1)
      return (
        <div className="relative flex items-center justify-center gap-1.5">
          <TyreVisualMinimal tyre={unit.tyres[startIndex]} onTooltipChange={onTooltipChange} />
          <div className="relative flex items-center justify-center" style={{ width: '40px' }}>
            <div className="absolute w-full h-0.5 bg-neutral-800"></div>
            <div className="relative w-2 h-2 bg-neutral-800 rounded-full z-10"></div>
          </div>
          <TyreVisualMinimal tyre={unit.tyres[startIndex + 1]} onTooltipChange={onTooltipChange} />
        </div>
      );
    } else {
      // Dual tyres
      return (
        <div className="relative flex items-center justify-center gap-1.5">
          <div className="flex gap-0.5">
            <TyreVisualMinimal tyre={unit.tyres[startIndex]} onTooltipChange={onTooltipChange} />
            <TyreVisualMinimal tyre={unit.tyres[startIndex + 1]} onTooltipChange={onTooltipChange} />
          </div>
          <div className="relative flex items-center justify-center" style={{ width: '40px' }}>
            <div className="absolute w-full h-0.5 bg-neutral-800"></div>
            <div className="relative w-2 h-2 bg-neutral-800 rounded-full z-10"></div>
          </div>
          <div className="flex gap-0.5">
            <TyreVisualMinimal tyre={unit.tyres[startIndex + 2]} onTooltipChange={onTooltipChange} />
            <TyreVisualMinimal tyre={unit.tyres[startIndex + 3]} onTooltipChange={onTooltipChange} />
          </div>
        </div>
      );
    }
  };

  // Helper to render a section separator
  const renderSeparator = () => (
    <div className="flex items-center justify-center my-0.5">
      <div className="w-24 h-0.5 bg-neutral-400" style={{ borderTop: '1px dashed #a3a3a3' }}></div>
    </div>
  );

  return (
    <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-neutral-800">{unit.unitCode}</h3>
        {issueCount > 0 && (
          <div className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">
            {issueCount} ALERT{issueCount > 1 ? 'S' : ''}
          </div>
        )}
      </div>

      {/* Hauling Trailer Layout - 54 tyres, 14 axles */}
      <div className="flex flex-col items-center relative">
        {/* PRIME MOVER Section Label */}
        <div className="text-[9px] font-bold text-neutral-600 uppercase mb-0.5">Prime Mover</div>
        
        {/* Axle 1 - Front (2 tyres, single) */}
        {renderAxle(0, true)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 2 (4 tyres, dual) */}
        {renderAxle(2, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 3 (4 tyres, dual) */}
        {renderAxle(6, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* VESSEL 1 Section Label */}
        <div className="text-[9px] font-bold text-neutral-600 uppercase mb-0.5">Vessel 1</div>
        
        {/* Axle 4 (4 tyres, dual) */}
        {renderAxle(10, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 5 (4 tyres, dual) */}
        {renderAxle(14, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 6 (4 tyres, dual) */}
        {renderAxle(18, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 7 (4 tyres, dual) */}
        {renderAxle(22, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* DOLLY Section Label */}
        <div className="text-[9px] font-bold text-neutral-600 uppercase mb-0.5">Dolly</div>
        
        {/* Axle 8 (4 tyres, dual) */}
        {renderAxle(26, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 9 (4 tyres, dual) */}
        {renderAxle(30, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 10 (4 tyres, dual) */}
        {renderAxle(34, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* VESSEL 2 Section Label */}
        <div className="text-[9px] font-bold text-neutral-600 uppercase mb-0.5">Vessel 2</div>
        
        {/* Axle 11 (4 tyres, dual) */}
        {renderAxle(38, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 12 (4 tyres, dual) */}
        {renderAxle(42, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 13 (4 tyres, dual) */}
        {renderAxle(46, false)}
        <div className="w-0.5 h-1 bg-neutral-800"></div>
        
        {/* Axle 14 (4 tyres, dual) */}
        {renderAxle(50, false)}
      </div>
    </div>
  );
}