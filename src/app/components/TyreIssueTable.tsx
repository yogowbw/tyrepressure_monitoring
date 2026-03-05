import { TyreIssue, TyreStatus } from '../types';

interface TyreIssueTableProps {
  tyreIssues: TyreIssue[];
}

function getStatusColor(status: TyreStatus): string {
  switch (status) {
    case 'critical': return 'bg-red-600 text-red-100';
    case 'monitor': return 'bg-yellow-600 text-yellow-100';
    case 'normal': return 'bg-emerald-600 text-emerald-100';
  }
}

function getWheelPositionLabel(position: number): string {
  if (position <= 2) return `FR-${position}`;
  return `RR-${position}`;
}

export function TyreIssueTable({ tyreIssues }: TyreIssueTableProps) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-5 h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-4 text-white uppercase tracking-wide">Tyre Issues Requiring Attention</h2>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-800 text-slate-300 z-10">
            <tr className="border-b-2 border-slate-600">
              <th className="p-2 text-base font-bold uppercase">Jobsite</th>
              <th className="p-2 text-base font-bold uppercase">Unit</th>
              <th className="p-2 text-base font-bold uppercase">Tyre Size</th>
              <th className="p-2 text-base font-bold uppercase text-center">Wheel Pos</th>
              <th className="p-2 text-base font-bold uppercase">Lifetime</th>
              <th className="p-2 text-base font-bold uppercase">Pressure</th>
              <th className="p-2 text-base font-bold uppercase">Removal History</th>
              <th className="p-2 text-base font-bold uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {tyreIssues.map((tyre) => (
              <tr 
                key={tyre.id} 
                className={`border-b border-slate-700 hover:bg-slate-800/50 transition-colors ${
                  tyre.overallStatus === 'critical' ? 'bg-red-950/20' : 
                  tyre.overallStatus === 'monitor' ? 'bg-yellow-950/20' : ''
                }`}
              >
                <td className="p-2">
                  <div className="text-base text-white">{tyre.jobsite}</div>
                </td>
                
                <td className="p-2">
                  <div className="font-mono text-lg font-bold text-white">{tyre.unitId}</div>
                </td>
                
                <td className="p-2">
                  <div className="font-mono text-base font-bold text-emerald-400">{tyre.tyreSize}</div>
                  <div className="text-xs text-slate-500">
                    {tyre.tyreSize.includes('27.00') ? 'DT 100 Ton' :
                     tyre.tyreSize.includes('33.00') ? 'DT 150 Ton' :
                     tyre.tyreSize.includes('37.00') ? 'DT 180 Ton' : 'Hauler'}
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
                      <span className={`text-lg font-mono font-bold ${
                        tyre.lifetimeStatus === 'below_target' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {tyre.currentLifetime}h
                      </span>
                      <span className="text-xs text-slate-500">/ {tyre.targetLifetime}h</span>
                    </div>
                    <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full ${
                          tyre.lifetimeStatus === 'below_target' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((tyre.currentLifetime / tyre.targetLifetime) * 100, 100)}%` }}
                      />
                    </div>
                    <div className={`text-xs font-bold uppercase ${
                      tyre.lifetimeStatus === 'below_target' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {Math.round((tyre.currentLifetime / tyre.targetLifetime) * 100)}% - {
                        tyre.lifetimeStatus === 'below_target' ? 'BELOW' : 'NEAR'
                      }
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
                </td>
                
                <td className="p-2 text-center">
                  <div className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase ${getStatusColor(tyre.overallStatus)}`}>
                    {tyre.overallStatus}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700 text-center">
        <span className="text-slate-400 text-sm">Total Issues: </span>
        <span className="text-white font-bold text-lg tabular-nums">{tyreIssues.length}</span>
      </div>
    </div>
  );
}
