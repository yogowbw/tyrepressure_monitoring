import { TyreIssue } from '../types';
import { useMemo } from 'react';
import { Gauge } from 'lucide-react';

interface PressurePanelProps {
  tyreData: TyreIssue[];
}

export function PressurePanel({ tyreData }: PressurePanelProps) {
  const stats = useMemo(() => {
    const total = tyreData.length;
    const low = tyreData.filter(t => t.pressureStatus === 'low').length;
    const over = tyreData.filter(t => t.pressureStatus === 'over').length;
    const normal = tyreData.filter(t => t.pressureStatus === 'normal').length;
    
    const compliance = total > 0 ? Math.round((normal / total) * 100) : 0;
    const lowPercentage = total > 0 ? Math.round((low / total) * 100) : 0;
    const overPercentage = total > 0 ? Math.round((over / total) * 100) : 0;

    return { low, over, normal, compliance, lowPercentage, overPercentage, total };
  }, [tyreData]);

  const abnormalPressureTyres = useMemo(() => {
    return tyreData
      .filter(t => t.pressureStatus !== 'normal')
      .sort((a, b) => {
        // Sort by status: low first (critical), then over
        if (a.pressureStatus === 'low' && b.pressureStatus !== 'low') return -1;
        if (a.pressureStatus !== 'low' && b.pressureStatus === 'low') return 1;
        return 0;
      })
      .slice(0, 8); // Show top 8 issues
  }, [tyreData]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left: Pressure Status Summary */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide flex items-center gap-2">
          <Gauge className="w-7 h-7" />
          Pressure Status
        </h2>
        
        <div className="space-y-4">
          {/* Compliance Gauge */}
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-6xl font-bold mb-2 tabular-nums" style={{
              color: stats.compliance >= 80 ? '#10b981' : stats.compliance >= 60 ? '#f59e0b' : '#ef4444'
            }}>
              {stats.compliance}%
            </div>
            <div className="text-base text-slate-300 uppercase tracking-wide mb-3">Compliance Rate</div>
            <div className="bg-slate-900 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  stats.compliance >= 80 ? 'bg-emerald-500' : 
                  stats.compliance >= 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${stats.compliance}%` }}
              />
            </div>
          </div>

          {/* Pressure Breakdown */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-emerald-900/30 border border-emerald-600 rounded p-3 text-center">
              <div className="text-3xl font-bold text-emerald-400 tabular-nums">{stats.normal}</div>
              <div className="text-xs text-emerald-200 uppercase mt-1">Normal</div>
              <div className="text-xs text-emerald-400 font-bold mt-1">{Math.round((stats.normal / stats.total) * 100)}%</div>
            </div>
            <div className="bg-red-900/30 border border-red-600 rounded p-3 text-center">
              <div className="text-3xl font-bold text-red-400 tabular-nums">{stats.low}</div>
              <div className="text-xs text-red-200 uppercase mt-1">Low</div>
              <div className="text-xs text-red-400 font-bold mt-1">{stats.lowPercentage}%</div>
            </div>
            <div className="bg-orange-900/30 border border-orange-600 rounded p-3 text-center">
              <div className="text-3xl font-bold text-orange-400 tabular-nums">{stats.over}</div>
              <div className="text-xs text-orange-200 uppercase mt-1">Over</div>
              <div className="text-xs text-orange-400 font-bold mt-1">{stats.overPercentage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Abnormal Pressure Details */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">Pressure Alerts</h2>
        
        <div className="space-y-2 max-h-[320px] overflow-y-auto">
          {abnormalPressureTyres.length === 0 ? (
            <div className="text-center text-slate-500 py-8 italic">
              All tyres within normal pressure range
            </div>
          ) : (
            abnormalPressureTyres.map(tyre => (
              <div 
                key={tyre.id}
                className={`p-3 rounded-lg border-2 ${
                  tyre.pressureStatus === 'low' 
                    ? 'bg-red-950/50 border-red-800' 
                    : 'bg-orange-950/50 border-orange-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-base font-bold text-emerald-400">{tyre.serialNumber}</div>
                  <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    tyre.pressureStatus === 'low' 
                      ? 'bg-red-600 text-red-100' 
                      : 'bg-orange-600 text-orange-100'
                  }`}>
                    {tyre.pressureStatus === 'low' ? '⚠ LOW' : '⚠ OVER'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-400">Unit: {tyre.unitId}</span>
                  <span className="font-mono text-slate-400">{tyre.tyreSize}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Current:</span>
                  <span className={`text-xl font-bold font-mono ${
                    tyre.pressureStatus === 'low' ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    {tyre.currentPressure} PSI
                  </span>
                </div>
                
                <div className="text-xs text-slate-500 mt-1">
                  Range: {tyre.recommendedPressureMin}-{tyre.recommendedPressureMax} PSI
                </div>
              </div>
            ))
          )}
        </div>
        
        {abnormalPressureTyres.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700 text-center text-sm text-slate-400">
            Showing {abnormalPressureTyres.length} of {stats.low + stats.over} abnormal pressure tyres
          </div>
        )}
      </div>
    </div>
  );
}