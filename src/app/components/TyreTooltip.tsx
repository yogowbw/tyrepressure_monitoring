import { Tyre } from '../types';

interface Props {
  tyre: Tyre;
}

export function TyreTooltip({ tyre }: Props) {
  const isWarning = tyre.status !== 'normal';
  const borderColor = tyre.status === 'low' ? 'border-red-500 dark:border-red-600' : 
                      tyre.status === 'over' ? 'border-orange-500 dark:border-orange-600' : 
                      'border-neutral-300 dark:border-neutral-600';

  return (
    <div 
      className={`absolute z-50 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border-2 ${borderColor} p-3 min-w-[200px] pointer-events-none`}
      style={{
        bottom: '120%',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Arrow */}
      <div 
        className={`absolute w-3 h-3 bg-white dark:bg-neutral-800 border-r-2 border-b-2 ${borderColor}`}
        style={{
          bottom: '-7px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
        }}
      />

      {/* Content */}
      <div className="space-y-2">
        {/* Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-600 pb-2">
          <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
            Position {tyre.position}
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-neutral-600 dark:text-neutral-400">Serial Number:</span>
            <span className="text-xs font-mono text-neutral-800 dark:text-neutral-200">{tyre.serialNumber}</span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-neutral-600 dark:text-neutral-400">Brand:</span>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">{tyre.brand}</span>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-600 pt-1.5 mt-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-neutral-600 dark:text-neutral-400">Recommended:</span>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100">{tyre.recommendedPressure} PSI</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-neutral-600 dark:text-neutral-400">Current:</span>
              <span className={`text-xs font-bold ${
                tyre.status === 'low' ? 'text-red-600 dark:text-red-500' :
                tyre.status === 'over' ? 'text-orange-600 dark:text-orange-500' :
                'text-neutral-800 dark:text-neutral-100'
              }`}>
                {tyre.pressure} PSI
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-neutral-600 dark:text-neutral-400">Lifetime:</span>
            <span className="text-xs text-neutral-800 dark:text-neutral-200">{(tyre.lifetime / 1000).toFixed(3)}h</span>
          </div>
        </div>

        {/* Status Warning */}
        {isWarning && (
          <div className={`text-[10px] font-bold uppercase text-center py-1 rounded mt-2 ${
            tyre.status === 'low' ? 'bg-red-500 dark:bg-red-600 text-white' : 'bg-orange-500 dark:bg-orange-600 text-white'
          }`}>
            {tyre.status === 'low' ? '⚠ LOW PRESSURE' : '⚠ OVER PRESSURE'}
          </div>
        )}
      </div>
    </div>
  );
}
