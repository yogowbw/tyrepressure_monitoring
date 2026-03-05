import { TyreIssue, StockData, Jobsite } from '../types';
import { useMemo } from 'react';

interface AllSitesViewProps {
  tyreData: TyreIssue[];
  stockData: StockData[];
}

const jobsites: Jobsite[] = ['ADMO Mining', 'ADMO Hauling', 'SERA', 'MACO Mining', 'MACO Hauling'];

export function AllSitesView({ tyreData, stockData }: AllSitesViewProps) {
  const siteComparison = useMemo(() => {
    return jobsites.map(jobsite => {
      const siteTyres = tyreData.filter(t => t.jobsite === jobsite);
      const siteStock = stockData.filter(s => s.jobsite === jobsite);
      
      const totalTyres = siteTyres.length;
      const nearTarget = siteTyres.filter(t => t.lifetimeStatus === 'near_target').length;
      const abnormalPressure = siteTyres.filter(t => t.pressureStatus !== 'normal').length;
      const lowPressure = siteTyres.filter(t => t.pressureStatus === 'low').length;
      const stockShortages = siteStock.filter(s => s.quantity < s.minimumRequired).length;
      const compliance = totalTyres > 0 ? Math.round((siteTyres.filter(t => t.pressureStatus === 'normal').length / totalTyres) * 100) : 0;
      const healthIndex = totalTyres > 0 ? Math.round(((totalTyres - nearTarget - abnormalPressure) / totalTyres) * 100) : 100;

      return {
        jobsite,
        totalTyres,
        nearTarget,
        abnormalPressure,
        lowPressure,
        stockShortages,
        compliance,
        healthIndex,
      };
    });
  }, [tyreData, stockData]);

  const fleetTotals = useMemo(() => {
    return {
      totalTyres: tyreData.length,
      nearTarget: tyreData.filter(t => t.lifetimeStatus === 'near_target').length,
      abnormalPressure: tyreData.filter(t => t.pressureStatus !== 'normal').length,
      stockShortages: stockData.filter(s => s.quantity < s.minimumRequired).length,
    };
  }, [tyreData, stockData]);

  return (
    <div className="space-y-6">
      {/* Tyre Overview */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6">
        <h2 className="text-4xl font-bold mb-6 text-white uppercase tracking-wide">Tyre Overview - All Sites</h2>
        
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 text-center">
            <div className="text-6xl font-bold text-white tabular-nums mb-2">{fleetTotals.totalTyres}</div>
            <div className="text-xl text-slate-400 uppercase">Total Running Tyres</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-600 rounded-lg p-6 text-center">
            <div className="text-6xl font-bold text-yellow-200 tabular-nums mb-2">{fleetTotals.nearTarget}</div>
            <div className="text-xl text-yellow-200 uppercase font-bold">Near Target</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-900 to-orange-950 border-2 border-orange-600 rounded-lg p-6 text-center">
            <div className="text-6xl font-bold text-orange-200 tabular-nums mb-2">{fleetTotals.abnormalPressure}</div>
            <div className="text-xl text-orange-200 uppercase font-bold">Abnormal Pressure</div>
          </div>
          
          <div className={`rounded-lg p-6 text-center border-2 ${
            fleetTotals.stockShortages > 0 
              ? 'bg-gradient-to-br from-red-900 to-red-950 border-red-600' 
              : 'bg-gradient-to-br from-emerald-900 to-emerald-950 border-emerald-600'
          }`}>
            <div className={`text-6xl font-bold tabular-nums mb-2 ${
              fleetTotals.stockShortages > 0 ? 'text-red-200' : 'text-emerald-200'
            }`}>
              {fleetTotals.stockShortages}
            </div>
            <div className={`text-xl uppercase font-bold ${
              fleetTotals.stockShortages > 0 ? 'text-red-200' : 'text-emerald-200'
            }`}>
              Stock Shortages
            </div>
          </div>
        </div>
      </div>

      {/* Site Comparison Table */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-white uppercase tracking-wide">Site Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-300">
              <tr className="border-b-2 border-slate-600">
                <th className="p-4 text-xl font-bold uppercase">Jobsite</th>
                <th className="p-4 text-xl font-bold uppercase text-center">Total Tyres</th>
                <th className="p-4 text-xl font-bold uppercase text-center">Near Target</th>
                <th className="p-4 text-xl font-bold uppercase text-center">Abnormal Pressure</th>
                <th className="p-4 text-xl font-bold uppercase text-center">Low Pressure</th>
                <th className="p-4 text-xl font-bold uppercase text-center">Compliance</th>
                <th className="p-4 text-xl font-bold uppercase text-center">Stock Issues</th>
                <th className="p-4 text-xl font-bold uppercase text-center">Health Index</th>
              </tr>
            </thead>
            <tbody>
              {siteComparison.map((site) => (
                <tr key={site.jobsite} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                  <td className="p-4">
                    <div className="text-2xl font-bold text-white">{site.jobsite}</div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className="text-3xl font-bold text-white tabular-nums">{site.totalTyres}</div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className={`inline-block px-5 py-2 rounded-lg text-3xl font-bold tabular-nums ${
                      site.nearTarget > 0 ? 'bg-yellow-600 text-yellow-100' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {site.nearTarget}
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className={`inline-block px-5 py-2 rounded-lg text-3xl font-bold tabular-nums ${
                      site.abnormalPressure > 0 ? 'bg-orange-600 text-orange-100' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {site.abnormalPressure}
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className={`inline-block px-5 py-2 rounded-lg text-3xl font-bold tabular-nums ${
                      site.lowPressure > 0 ? 'bg-red-600 text-red-100' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {site.lowPressure}
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className="space-y-2">
                      <div className={`text-3xl font-bold tabular-nums ${
                        site.compliance >= 80 ? 'text-emerald-400' :
                        site.compliance >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {site.compliance}%
                      </div>
                      <div className="bg-slate-800 rounded-full h-2 overflow-hidden mx-auto" style={{ width: '120px' }}>
                        <div 
                          className={`h-full ${
                            site.compliance >= 80 ? 'bg-emerald-500' :
                            site.compliance >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${site.compliance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className={`inline-block px-5 py-2 rounded-lg text-3xl font-bold tabular-nums ${
                      site.stockShortages > 0 ? 'bg-red-600 text-red-100' : 'bg-emerald-600 text-emerald-100'
                    }`}>
                      {site.stockShortages}
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className={`text-4xl font-bold tabular-nums ${
                      site.healthIndex >= 80 ? 'text-emerald-400' :
                      site.healthIndex >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {site.healthIndex}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}