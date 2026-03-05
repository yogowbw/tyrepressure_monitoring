import { Jobsite, TyreIssue, StockData } from '../types';
import { Activity, TrendingDown, Gauge, Package, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

interface JobsiteOverviewProps {
  jobsite: Jobsite;
  tyreData: TyreIssue[];
  stockData: StockData[];
}

export function JobsiteOverview({ jobsite, tyreData, stockData }: JobsiteOverviewProps) {
  const stats = useMemo(() => {
    const totalTyres = tyreData.length;
    const nearTarget = tyreData.filter(t => t.lifetimeStatus === 'near_target').length;
    const abnormalPressure = tyreData.filter(t => t.pressureStatus !== 'normal').length;
    const stockShortages = stockData.filter(s => s.quantity < s.minimumRequired).length;
    const overallHealth = totalTyres > 0 
      ? Math.round(((totalTyres - nearTarget - abnormalPressure) / totalTyres) * 100)
      : 100;

    return { totalTyres, nearTarget, abnormalPressure, stockShortages, overallHealth };
  }, [tyreData, stockData]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-5">
      <h2 className="text-3xl font-bold mb-4 text-white uppercase tracking-wide">{jobsite} Overview</h2>
      
      <div className="grid grid-cols-5 gap-4">
        {/* Total Running Tyres */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-9 h-9 text-blue-400" />
            <div className="text-right">
              <div className="text-5xl font-bold text-white tabular-nums">{stats.totalTyres}</div>
            </div>
          </div>
          <div className="text-base text-slate-400 uppercase">Running Tyres</div>
        </div>

        {/* Near Target */}
        <div className={`rounded-lg p-4 border-2 ${
          stats.nearTarget > 0 
            ? 'bg-gradient-to-br from-yellow-900 to-yellow-950 border-yellow-600' 
            : 'bg-slate-800 border-slate-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className={`w-9 h-9 ${stats.nearTarget > 0 ? 'text-yellow-300' : 'text-slate-600'}`} />
            <div className="text-right">
              <div className={`text-5xl font-bold tabular-nums ${
                stats.nearTarget > 0 ? 'text-yellow-200' : 'text-slate-600'
              }`}>
                {stats.nearTarget}
              </div>
            </div>
          </div>
          <div className={`text-base uppercase font-bold ${
            stats.nearTarget > 0 ? 'text-yellow-200' : 'text-slate-500'
          }`}>
            Near Target
          </div>
        </div>

        {/* Abnormal Pressure */}
        <div className={`rounded-lg p-4 border-2 ${
          stats.abnormalPressure > 0 
            ? 'bg-gradient-to-br from-orange-900 to-orange-950 border-orange-600' 
            : 'bg-slate-800 border-slate-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <Gauge className={`w-9 h-9 ${stats.abnormalPressure > 0 ? 'text-orange-300' : 'text-slate-600'}`} />
            <div className="text-right">
              <div className={`text-5xl font-bold tabular-nums ${
                stats.abnormalPressure > 0 ? 'text-orange-200' : 'text-slate-600'
              }`}>
                {stats.abnormalPressure}
              </div>
            </div>
          </div>
          <div className={`text-base uppercase font-bold ${
            stats.abnormalPressure > 0 ? 'text-orange-200' : 'text-slate-500'
          }`}>
            Abnormal Pressure
          </div>
        </div>

        {/* Stock Status */}
        <div className={`rounded-lg p-4 border-2 ${
          stats.stockShortages > 0 
            ? 'bg-gradient-to-br from-red-900 to-red-950 border-red-600' 
            : 'bg-slate-800 border-slate-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <Package className={`w-9 h-9 ${stats.stockShortages > 0 ? 'text-red-300' : 'text-emerald-400'}`} />
            <div className="text-right">
              <div className={`text-5xl font-bold tabular-nums ${
                stats.stockShortages > 0 ? 'text-red-200' : 'text-emerald-400'
              }`}>
                {stats.stockShortages}
              </div>
            </div>
          </div>
          <div className={`text-base uppercase font-bold ${
            stats.stockShortages > 0 ? 'text-red-200' : 'text-emerald-300'
          }`}>
            {stats.stockShortages > 0 ? 'Stock Shortages' : 'Stock OK'}
          </div>
        </div>

        {/* Overall Health */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            <div className="text-right">
              <div className={`text-5xl font-bold tabular-nums ${
                stats.overallHealth >= 80 ? 'text-emerald-400' :
                stats.overallHealth >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {stats.overallHealth}%
              </div>
            </div>
          </div>
          <div className="text-base text-slate-400 uppercase">Health Index</div>
          <div className="mt-2 bg-slate-900 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all ${
                stats.overallHealth >= 80 ? 'bg-emerald-500' :
                stats.overallHealth >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${stats.overallHealth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
