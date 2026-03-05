import { PressureQuality } from '../types';

interface Props {
  data: PressureQuality;
}

export function PressureQualitySummary({ data }: Props) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-3 uppercase tracking-wide">
        Tyre Pressure Summary
      </h2>

      {/* Main Stat - Tyres Need Follow-Up */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-red-600 dark:text-red-500 tabular-nums">
          {data.totalTyresNeedingFollowUp} Tyre Pressure Need Follow Up
        </div>
        <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300 tabular-nums mt-1">
          {data.totalAffectedVehicles} Vehicles
        </div>
      </div>

      {/* Pressure Quality Breakdown */}
      <div className="space-y-3 flex-1">
        {/* Low Pressure */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Low Pressure</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 tabular-nums">
                {data.countLow} tyres
              </span>
              <span className="text-xl font-bold text-red-600 dark:text-red-500 tabular-nums">
                {data.percentLow}%
              </span>
            </div>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 dark:bg-red-500 transition-all"
              style={{ width: `${data.percentLow}%` }}
            />
          </div>
        </div>

        {/* Over Pressure */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Over Pressure</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 tabular-nums">
                {data.countOver} tyres
              </span>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-500 tabular-nums">
                {data.percentOver}%
              </span>
            </div>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-600 dark:bg-orange-500 transition-all"
              style={{ width: `${data.percentOver}%` }}
            />
          </div>
        </div>

        {/* In Range */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">In Range</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 tabular-nums">
                {data.countInRange} tyres
              </span>
              <span className="text-xl font-bold text-green-600 dark:text-green-500 tabular-nums">
                {data.percentInRange}%
              </span>
            </div>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 dark:bg-green-500 transition-all"
              style={{ width: `${data.percentInRange}%` }}
            />
          </div>
        </div>

        {/* Total Tyres */}
        <div className="pt-2 border-t border-neutral-300 dark:border-neutral-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Total Tyres:</span>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 tabular-nums">
              {data.countLow + data.countOver + data.countInRange} tyres
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}