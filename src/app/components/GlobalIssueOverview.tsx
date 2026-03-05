import { TyreIssue } from '../types';
import { Activity, AlertTriangle, TrendingDown, Gauge } from 'lucide-react';
import { useMemo } from 'react';

interface GlobalIssueOverviewProps {
  tyreIssues: TyreIssue[];
}

export function GlobalIssueOverview({ tyreIssues }: GlobalIssueOverviewProps) {
  const stats = useMemo(() => {
    const totalRunning = 150; // Total fleet size
    const belowTarget = tyreIssues.filter(t => t.lifetimeStatus === 'below_target').length;
    const nearTarget = tyreIssues.filter(t => t.lifetimeStatus === 'near_target').length;
    const abnormalPressure = tyreIssues.filter(t => t.pressureStatus !== 'normal').length;
    const issueRate = Math.round((tyreIssues.length / totalRunning) * 100);

    return { totalRunning, belowTarget, nearTarget, abnormalPressure, issueRate };
  }, [tyreIssues]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">Issue Overview</h2>
      
      <div className="space-y-3">
        {/* Total Running */}
        <div className="bg-slate-800 border border-slate-600 rounded p-3">
          <div className="flex items-center justify-between">
            <Activity className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-4xl font-bold text-white tabular-nums">{stats.totalRunning}</div>
              <div className="text-sm text-slate-400 uppercase">Running Tyres</div>
            </div>
          </div>
        </div>

        {/* Below Target */}
        <div className="bg-gradient-to-br from-red-900 to-red-950 border-2 border-red-600 rounded p-3">
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-8 h-8 text-red-300" />
            <div className="text-right">
              <div className="text-4xl font-bold text-red-200 tabular-nums">{stats.belowTarget}</div>
              <div className="text-sm text-red-200 uppercase font-bold">Below Target</div>
            </div>
          </div>
        </div>

        {/* Near Target */}
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-600 rounded p-3">
          <div className="flex items-center justify-between">
            <TrendingDown className="w-8 h-8 text-yellow-300" />
            <div className="text-right">
              <div className="text-4xl font-bold text-yellow-200 tabular-nums">{stats.nearTarget}</div>
              <div className="text-sm text-yellow-200 uppercase font-bold">Near Target</div>
            </div>
          </div>
        </div>

        {/* Abnormal Pressure */}
        <div className="bg-gradient-to-br from-orange-900 to-orange-950 border-2 border-orange-600 rounded p-3">
          <div className="flex items-center justify-between">
            <Gauge className="w-8 h-8 text-orange-300" />
            <div className="text-right">
              <div className="text-4xl font-bold text-orange-200 tabular-nums">{stats.abnormalPressure}</div>
              <div className="text-sm text-orange-200 uppercase font-bold">Abnormal Pressure</div>
            </div>
          </div>
        </div>

        {/* Issue Rate */}
        <div className="bg-slate-800 border border-slate-600 rounded p-3">
          <div className="text-center">
            <div className="text-sm text-slate-400 uppercase mb-2">Fleet Issue Rate</div>
            <div className={`text-4xl font-bold tabular-nums ${
              stats.issueRate > 30 ? 'text-red-400' : 
              stats.issueRate > 15 ? 'text-yellow-400' : 
              'text-emerald-400'
            }`}>
              {stats.issueRate}%
            </div>
            <div className="mt-2 bg-slate-900 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  stats.issueRate > 30 ? 'bg-red-500' : 
                  stats.issueRate > 15 ? 'bg-yellow-500' : 
                  'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(stats.issueRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
