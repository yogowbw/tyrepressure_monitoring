import { TyreIssue } from '../types';
import { useMemo } from 'react';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface LifetimeRiskMonitoringProps {
  tyreIssues: TyreIssue[];
}

export function LifetimeRiskMonitoring({ tyreIssues }: LifetimeRiskMonitoringProps) {
  const stats = useMemo(() => {
    const belowTarget = tyreIssues.filter(t => t.lifetimeStatus === 'below_target');
    const nearTarget = tyreIssues.filter(t => t.lifetimeStatus === 'near_target');
    
    const totalAtRisk = belowTarget.length + nearTarget.length;
    const belowPercentage = totalAtRisk > 0 ? Math.round((belowTarget.length / totalAtRisk) * 100) : 0;
    const nearPercentage = totalAtRisk > 0 ? Math.round((nearTarget.length / totalAtRisk) * 100) : 0;

    return { 
      belowTarget: belowTarget.length, 
      nearTarget: nearTarget.length,
      belowPercentage,
      nearPercentage,
      totalAtRisk
    };
  }, [tyreIssues]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">Lifetime Risk</h2>
      
      <div className="flex-1 space-y-4">
        {/* Risk Distribution */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-white tabular-nums">{stats.totalAtRisk}</div>
            <div className="text-sm text-slate-400 uppercase">Tyres At Risk</div>
          </div>

          {/* Visual Distribution */}
          <div className="space-y-3">
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden flex">
              <div 
                className="bg-red-500 transition-all"
                style={{ width: `${stats.belowPercentage}%` }}
                title="Below Target"
              />
              <div 
                className="bg-yellow-500 transition-all"
                style={{ width: `${stats.nearPercentage}%` }}
                title="Near Target"
              />
            </div>
          </div>
        </div>

        {/* Below Target - High Attention */}
        <div className="bg-gradient-to-br from-red-900 to-red-950 border-2 border-red-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-10 h-10 text-red-300 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-4xl font-bold text-red-200 tabular-nums mb-1">{stats.belowTarget}</div>
              <div className="text-sm text-red-200 uppercase font-bold mb-2">Below Target</div>
              <div className="text-xs text-red-300">HIGH ATTENTION REQUIRED</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-red-950 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-red-400"
                    style={{ width: `${stats.belowPercentage}%` }}
                  />
                </div>
                <div className="text-lg font-bold text-red-200 tabular-nums">{stats.belowPercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Near Target - Monitor Closely */}
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-10 h-10 text-yellow-300 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-4xl font-bold text-yellow-200 tabular-nums mb-1">{stats.nearTarget}</div>
              <div className="text-sm text-yellow-200 uppercase font-bold mb-2">Near Target</div>
              <div className="text-xs text-yellow-300">MONITOR CLOSELY</div>
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

        {/* Risk Indicator */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase mb-1">Risk Level</div>
            <div className={`text-2xl font-bold uppercase ${
              stats.belowTarget > stats.nearTarget ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {stats.belowTarget > stats.nearTarget ? 'CRITICAL' : 'ELEVATED'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
