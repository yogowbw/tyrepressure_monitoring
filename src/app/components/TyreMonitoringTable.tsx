import { TyreIssue, TyreStatus } from '../types';
import { useMemo } from 'react';

interface TyreMonitoringTableProps {
  tyreData: TyreIssue[];
}

function getStatusColor(status: TyreStatus): string {
  switch (status) {
    case 'critical': return 'bg-red-600 text-red-100';
    case 'monitor': return 'bg-yellow-600 text-yellow-100';
    case 'normal': return 'bg-emerald-600 text-emerald-100';
  }
}

function getWheelPositionLabel(position: number): string {
  if (position <= 2) return `F-${position}`;
  return `R-${position}`;
}

export function TyreMonitoringTable({ tyreData }: TyreMonitoringTableProps) {
  // Filter: Only show tyres that are near target AND (have abnormal pressure OR have removal history)
  const filteredTyres = useMemo(() => {
    return tyreData.filter(tyre => 
      tyre.lifetimeStatus === 'near_target' && 
      (tyre.pressureStatus !== 'normal' || tyre.removalReasonHistory.length > 0)
    );
  }, [tyreData]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-5 h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-4 text-white uppercase tracking-wide">Tyre Condition Monitoring</h2>
      <p className="text-base text-slate-400 mb-4">Showing tyres near target lifetime with abnormal pressure or damage history</p>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-800 text-slate-300 z-10">
            <tr className="border-b-2 border-slate-600">
              <th className="p-2 text-base font-bold uppercase">Serial Number</th>
              <th className="p-2 text-base font-bold uppercase">Unit ID</th>
              <th className="p-2 text-base font-bold uppercase">Tyre Size</th>
              <th className="p-2 text-base font-bold uppercase text-center">Wheel</th>
              <th className="p-2 text-base font-bold uppercase">Lifetime</th>
              <th className="p-2 text-base font-bold uppercase">Pressure</th>
              <th className="p-2 text-base font-bold uppercase">History</th>
              <th className="p-2 text-base font-bold uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTyres.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 italic text-xl">
                  No tyres requiring special attention at this time
                </td>
              </tr>
            ) : (
              filteredTyres.map((tyre) => (
                <tr 
                  key={tyre.id} 
                  className={`border-b border-slate-700 hover:bg-slate-800/50 transition-colors ${
                    tyre.overallStatus === 'critical' ? 'bg-red-950/20' : 
                    tyre.overallStatus === 'monitor' ? 'bg-yellow-950/20' : ''
                  }`}
                >
                  <td className="p-2">
                    <div className="font-mono text-lg font-bold text-emerald-400">{tyre.serialNumber}</div>
                  </td>
                  
                  <td className="p-2">
                    <div className="font-mono text-base font-bold text-white">{tyre.unitId}</div>
                  </td>
                  
                  <td className="p-2">
                    <div className="font-mono text-base font-bold text-emerald-400">{tyre.tyreSize}</div>
                    <div className="text-xs text-slate-500">
                      Target: {tyre.targetLifetime.toLocaleString()}h
                    </div>
                  </td>
                  
                  <td className="p-2 text-center">
                    <div className="inline-block bg-slate-800 px-3 py-1 rounded font-mono text-base font-bold text-white border border-slate-600">
                      {getWheelPositionLabel(tyre.wheelPosition)}
                    </div>
                  </td>
                  
                  <td className="p-2">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-mono font-bold text-yellow-400">
                          {tyre.currentLifetime.toLocaleString()}h
                        </span>
                        <span className="text-xs text-slate-500">/ {tyre.targetLifetime.toLocaleString()}h</span>
                      </div>
                      <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500"
                          style={{ width: `${Math.min((tyre.currentLifetime / tyre.targetLifetime) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs font-bold uppercase text-yellow-400">
                        {Math.round((tyre.currentLifetime / tyre.targetLifetime) * 100)}% - NEAR TARGET
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-2">
                    <div className="space-y-1">
                      <div className={`text-lg font-mono font-bold ${
                        tyre.pressureStatus === 'normal' ? 'text-emerald-400' :
                        tyre.pressureStatus === 'low' ? 'text-red-400' :
                        'text-orange-400'
                      }`}>
                        {tyre.currentPressure} PSI
                      </div>
                      <div className="text-xs text-slate-500">
                        {tyre.recommendedPressureMin}-{tyre.recommendedPressureMax} PSI
                      </div>
                      {tyre.pressureStatus !== 'normal' && (
                        <div className={`text-xs font-bold uppercase ${
                          tyre.pressureStatus === 'low' ? 'text-red-400' : 'text-orange-400'
                        }`}>
                          {tyre.pressureStatus === 'low' ? '⚠ LOW' : '⚠ OVER'}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-2">
                    {tyre.removalReasonHistory.length > 0 ? (
                      <div className="space-y-1">
                        {tyre.removalReasonHistory.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                            {reason}
                          </div>
                        ))}
                        {tyre.removalReasonHistory.length > 2 && (
                          <div className="text-xs text-slate-500 italic">
                            +{tyre.removalReasonHistory.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 italic">No history</div>
                    )}
                  </td>
                  
                  <td className="p-2 text-center">
                    <div className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase ${getStatusColor(tyre.overallStatus)}`}>
                      {tyre.overallStatus}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700 text-center">
        <span className="text-slate-400 text-sm">Tyres Requiring Attention: </span>
        <span className="text-white font-bold text-lg tabular-nums">{filteredTyres.length}</span>
        <span className="text-slate-500 text-sm ml-2">/ {tyreData.length} total</span>
      </div>
    </div>
  );
}