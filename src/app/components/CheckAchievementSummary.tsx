import { CheckAchievement } from '../types';

interface Props {
  data: CheckAchievement;
}

export function CheckAchievementSummary({ data }: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* Header with Title and Legend Badges */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wide">
          Tyre Check
        </h2>
        
        {/* Legend as Badges */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-green-600 dark:bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold">
            <span>{data.unitsCheckedToday}</span>
            <span>Checked</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500 dark:bg-yellow-600 text-white px-2 py-1 rounded text-[10px] font-bold">
            <span>{data.unitsNotCheckedButInRange}</span>
            <span>In Range</span>
          </div>
          <div className="flex items-center gap-1 bg-red-600 dark:bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold">
            <span>{data.totalOverdue}</span>
            <span>Not Checked</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-neutral-600 dark:text-neutral-400">
          Target: 1 pressure check / 3 days per vehicle
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-[140px_1fr] gap-4">
        {/* Left: Vehicle Overdue Box and Accuracy Box */}
        <div className="flex flex-col gap-3">
          <div className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg p-3 transition-colors">
            <div className={`text-3xl font-bold tabular-nums mb-1 ${
              Math.round((data.unitsCheckedToday / data.totalUnits) * 100) < 95 
                ? 'text-red-600 dark:text-red-500' 
                : 'text-neutral-800 dark:text-neutral-100'
            }`}>
              {Math.round((data.unitsCheckedToday / data.totalUnits) * 100)}%
            </div>
            <div className="text-[10px] text-neutral-600 dark:text-neutral-400 uppercase tracking-tight leading-tight">
              Achievement Tyre Check
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg p-3 transition-colors">
            <div className={`text-3xl font-bold tabular-nums mb-1 ${
              data.accuracyPI < 95 
                ? 'text-red-600 dark:text-red-500' 
                : 'text-neutral-800 dark:text-neutral-100'
            }`}>
              {data.accuracyPI}%
            </div>
            <div className="text-[10px] text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Accuracy Tyre Check
            </div>
          </div>
        </div>

        {/* Right: Progress Bars */}
        <div className="flex flex-col justify-between">
          {/* Tyre Check Progress - Three Segments */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Ach. Tyre Check (Daily)</span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {data.unitsCheckedToday} / {data.totalUnits} units
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-6 rounded-full overflow-hidden relative flex">
              {/* Green: Checked Today */}
              <div 
                className="h-full transition-all flex items-center justify-center bg-green-600 dark:bg-green-500"
                style={{ width: `${(data.unitsCheckedToday / data.totalUnits) * 100}%` }}
              >
                {data.unitsCheckedToday > 0 && (
                  <span className="text-xs font-medium text-white px-1">{data.unitsCheckedToday}</span>
                )}
              </div>
              
              {/* Yellow: Not Checked But In Range */}
              <div 
                className="h-full transition-all flex items-center justify-center bg-yellow-500 dark:bg-yellow-600"
                style={{ width: `${(data.unitsNotCheckedButInRange / data.totalUnits) * 100}%` }}
              >
                {data.unitsNotCheckedButInRange > 0 && (
                  <span className="text-xs font-medium text-white px-1">{data.unitsNotCheckedButInRange}</span>
                )}
              </div>
              
              {/* Red: Overdue */}
              <div 
                className="h-full transition-all flex items-center justify-center bg-red-600 dark:bg-red-500"
                style={{ width: `${(data.totalOverdue / data.totalUnits) * 100}%` }}
              >
                {data.totalOverdue > 0 && (
                  <span className="text-xs font-medium text-white px-1">{data.totalOverdue}</span>
                )}
              </div>
            </div>
          </div>

          {/* Accuracy Tyre Check Progress */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Accuracy Tyre Check (per 3 Days)</span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {Math.round((data.accuracyPI / 100) * data.totalUnits)} / {data.totalUnits} units
              </span>
            </div>
            <div className="w-full bg-red-600 dark:bg-red-500 h-6 rounded-full overflow-hidden relative">
              <div 
                className="h-full transition-all flex items-center justify-start pl-3 bg-green-600 dark:bg-green-500"
                style={{ width: `${data.accuracyPI}%` }}
              >
                <span className="text-xs font-medium text-white">
                  {Math.round((data.accuracyPI / 100) * data.totalUnits)} checked
                </span>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-xs font-medium text-white">
                  {data.totalUnits - Math.round((data.accuracyPI / 100) * data.totalUnits)} not yet checked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}