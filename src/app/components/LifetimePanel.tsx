import { TyreIssue } from '../types';
import { useMemo } from 'react';
import { CheckCircle2, TrendingDown } from 'lucide-react';

interface LifetimePanelProps {
  tyreData: TyreIssue[];
}

export function LifetimePanel({ tyreData }: LifetimePanelProps) {
  const stats = useMemo(() => {
    const belowTarget = tyreData.filter(t => t.lifetimeStatus === 'below_target').length;
    const nearTarget = tyreData.filter(t => t.lifetimeStatus === 'near_target').length;
    const onTrack = tyreData.filter(t => t.lifetimeStatus === 'on_track').length;
    
    const total = tyreData.length;
    const belowPercentage = total > 0 ? Math.round((belowTarget / total) * 100) : 0;
    const nearPercentage = total > 0 ? Math.round((nearTarget / total) * 100) : 0;
    const onTrackPercentage = total > 0 ? Math.round((onTrack / total) * 100) : 0;

    return { belowTarget, nearTarget, onTrack, belowPercentage, nearPercentage, onTrackPercentage, total };
  }, [tyreData]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">Lifetime Distribution</h2>
      
      <div className="space-y-4">
        {/* Distribution Bar */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-center mb-3">
            <div className="text-sm text-slate-400 uppercase mb-2">Lifetime Status</div>
            <div className="h-4 bg-slate-900 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500"
                style={{ width: `${stats.belowPercentage}%` }}
                title={`Below Target (Normal): ${stats.belowPercentage}%`}
              />
              <div 
                className="bg-blue-500"
                style={{ width: `${stats.onTrackPercentage}%` }}
                title={`On Track: ${stats.onTrackPercentage}%`}
              />
              <div 
                className="bg-yellow-500"
                style={{ width: `${stats.nearPercentage}%` }}
                title={`Near Target: ${stats.nearPercentage}%`}
              />
            </div>
          </div>
        </div>

        {/* Below Target - Normal (New Tyres) */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 border-2 border-emerald-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-9 h-9 text-emerald-300 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-4xl font-bold text-emerald-200 tabular-nums mb-1">{stats.belowTarget}</div>
              <div className="text-sm text-emerald-200 uppercase font-bold mb-2">Below Target</div>
              <div className="text-xs text-emerald-300">NORMAL - Recently Installed</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-emerald-950 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400"
                    style={{ width: `${stats.belowPercentage}%` }}
                  />
                </div>
                <div className="text-lg font-bold text-emerald-200 tabular-nums">{stats.belowPercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Near Target - Requires Monitoring */}
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-9 h-9 text-yellow-300 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-4xl font-bold text-yellow-200 tabular-nums mb-1">{stats.nearTarget}</div>
              <div className="text-sm text-yellow-200 uppercase font-bold mb-2">Near Target</div>
              <div className="text-xs text-yellow-300">REQUIRES MONITORING</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-yellow-950 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400"
                    style={{ width: `${stats.nearPercentage}%` }}
                  />
                </div>
                <div className="text-lg font-bold text-yellow-200 tabular-nums">{stats.nearPercentage}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
