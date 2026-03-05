import { StockData } from '../types';
import { Package } from 'lucide-react';
import { useMemo } from 'react';

interface StockMonitoringProps {
  stockData: StockData[];
}

function getStockStatus(quantity: number, minimum: number): 'shortage' | 'low' | 'adequate' {
  if (quantity < minimum) return 'shortage';
  if (quantity < minimum * 1.2) return 'low';
  return 'adequate';
}

export function StockMonitoring({ stockData }: StockMonitoringProps) {
  // Group stock data by jobsite
  const groupedStock = useMemo(() => {
    const groups = new Map<string, StockData[]>();
    stockData.forEach(stock => {
      if (!groups.has(stock.jobsite)) {
        groups.set(stock.jobsite, []);
      }
      groups.get(stock.jobsite)!.push(stock);
    });
    return Array.from(groups.entries());
  }, [stockData]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide flex items-center gap-2">
        <Package className="w-7 h-7" />
        Stock Availability
      </h2>
      
      <div className="flex-1 overflow-auto space-y-4">
        {groupedStock.map(([jobsite, stocks]) => (
          <div key={jobsite} className="bg-slate-800 rounded-lg p-3">
            {/* Jobsite Header */}
            <div className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-700">
              {jobsite}
            </div>
            
            {/* Tyre Sizes Grid */}
            <div className="space-y-2">
              {stocks.map((stock, idx) => {
                const status = getStockStatus(stock.quantity, stock.minimumRequired);
                return (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded ${
                      status === 'shortage' ? 'bg-red-950/50 border border-red-800' : 
                      status === 'low' ? 'bg-yellow-950/30 border border-yellow-800/50' : 
                      'bg-slate-900/50'
                    }`}
                  >
                    {/* Tyre Size */}
                    <div className="flex-1">
                      <div className="font-mono text-sm font-bold text-emerald-400">{stock.tyreSize}</div>
                    </div>
                    
                    {/* Stock vs Min */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-2xl font-bold tabular-nums ${
                          status === 'shortage' ? 'text-red-400' :
                          status === 'low' ? 'text-yellow-400' :
                          'text-emerald-400'
                        }`}>
                          {stock.quantity}
                        </div>
                        <div className="text-xs text-slate-500">/ {stock.minimumRequired} min</div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-2 py-1 rounded text-xs font-bold uppercase min-w-[70px] text-center ${
                        status === 'shortage' ? 'bg-red-600 text-red-100' :
                        status === 'low' ? 'bg-yellow-600 text-yellow-100' :
                        'bg-emerald-600 text-emerald-100'
                      }`}>
                        {status === 'shortage' ? 'Shortage' :
                         status === 'low' ? 'Low' :
                         'OK'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className={`text-2xl font-bold tabular-nums ${
              stockData.filter(s => getStockStatus(s.quantity, s.minimumRequired) === 'shortage').length > 0 
                ? 'text-red-400' 
                : 'text-slate-500'
            }`}>
              {stockData.filter(s => getStockStatus(s.quantity, s.minimumRequired) === 'shortage').length}
            </div>
            <div className="text-xs text-slate-400 uppercase">Shortages</div>
          </div>
          <div>
            <div className={`text-2xl font-bold tabular-nums ${
              stockData.filter(s => getStockStatus(s.quantity, s.minimumRequired) === 'low').length > 0 
                ? 'text-yellow-400' 
                : 'text-slate-500'
            }`}>
              {stockData.filter(s => getStockStatus(s.quantity, s.minimumRequired) === 'low').length}
            </div>
            <div className="text-xs text-slate-400 uppercase">Low Stock</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              {stockData.filter(s => getStockStatus(s.quantity, s.minimumRequired) === 'adequate').length}
            </div>
            <div className="text-xs text-slate-400 uppercase">Adequate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
