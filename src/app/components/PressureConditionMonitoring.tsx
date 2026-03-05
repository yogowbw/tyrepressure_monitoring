import { TyreIssue } from '../types';
import { useMemo } from 'react';
import { Gauge } from 'lucide-react';

interface PressureConditionMonitoringProps {
  tyreIssues: TyreIssue[];
}

export function PressureConditionMonitoring({ tyreIssues }: PressureConditionMonitoringProps) {
  const stats = useMemo(() => {
    const total = tyreIssues.length;
    const low = tyreIssues.filter(t => t.pressureStatus === 'low').length;
    const over = tyreIssues.filter(t => t.pressureStatus === 'over').length;
    const normal = tyreIssues.filter(t => t.pressureStatus === 'normal').length;
    
    const lowPercentage = total > 0 ? Math.round((low / total) * 100) : 0;
    const overPercentage = total > 0 ? Math.round((over / total) * 100) : 0;
    const normalPercentage = total > 0 ? Math.round((normal / total) * 100) : 0;

    return { low, over, normal, lowPercentage, overPercentage, normalPercentage, total };
  }, [tyreIssues]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide flex items-center gap-2">
        <Gauge className="w-7 h-7" />
        Pressure Condition
      </h2>
      
      <div className="space-y-4">
        {/* Pressure Distribution Chart */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-center mb-3">
            <div className="text-sm text-slate-400 uppercase mb-2">At-Risk Tyres Pressure Status</div>
            <div className="h-4 bg-slate-900 rounded-full overflow-hidden flex">
              <div 
                className="bg-red-500"
                style={{ width: `${stats.lowPercentage}%` }}
                title={`Low: ${stats.lowPercentage}%`}
              />
              <div 
                className="bg-orange-500"
                style={{ width: `${stats.overPercentage}%` }}
                title={`Over: ${stats.overPercentage}%`}
              />
              <div 
                className="bg-emerald-500"
                style={{ width: `${stats.normalPercentage}%` }}
                title={`Normal: ${stats.normalPercentage}%`}
              />
            </div>
          </div>
        </div>

        {/* Low Pressure Alert */}
        <div className="bg-gradient-to-br from-red-900 to-red-950 border-2 border-red-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-red-200 uppercase font-bold">Low Pressure</div>
            <div className="text-4xl font-bold text-red-200 tabular-nums">{stats.low}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-red-950 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-red-400"
                style={{ width: `${stats.lowPercentage}%` }}
              />
            </div>
            <div className="text-xl font-bold text-red-200 tabular-nums min-w-[3rem] text-right">{stats.lowPercentage}%</div>
          </div>
          <div className="mt-2 text-xs text-red-300 uppercase">Critical Attention Required</div>
        </div>

        {/* Over Pressure Alert */}
        <div className="bg-gradient-to-br from-orange-900 to-orange-950 border-2 border-orange-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-orange-200 uppercase font-bold">Over Pressure</div>
            <div className="text-4xl font-bold text-orange-200 tabular-nums">{stats.over}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-orange-950 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-orange-400"
                style={{ width: `${stats.overPercentage}%` }}
              />
            </div>
            <div className="text-xl font-bold text-orange-200 tabular-nums min-w-[3rem] text-right">{stats.overPercentage}%</div>
          </div>
          <div className="mt-2 text-xs text-orange-300 uppercase">Monitor & Adjust</div>
        </div>

        {/* Normal Pressure */}
        <div className="bg-emerald-900/30 border border-emerald-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-emerald-200 uppercase font-bold">Acceptable Range</div>
            <div className="text-4xl font-bold text-emerald-200 tabular-nums">{stats.normal}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-emerald-500"
                style={{ width: `${stats.normalPercentage}%` }}
              />
            </div>
            <div className="text-xl font-bold text-emerald-200 tabular-nums min-w-[3rem] text-right">{stats.normalPercentage}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
