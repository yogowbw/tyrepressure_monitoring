import { StockData } from '../types';
import { Package } from 'lucide-react';

interface SiteStockPanelProps {
  stockData: StockData[];
}

function getStockStatus(quantity: number, minimum: number): 'shortage' | 'low' | 'adequate' {
  if (quantity < minimum) return 'shortage';
  if (quantity < minimum * 1.2) return 'low';
  return 'adequate';
}

export function SiteStockPanel({ stockData }: SiteStockPanelProps) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide flex items-center gap-2">
        <Package className="w-7 h-7" />
        Stock Status
      </h2>
      
      <div className="flex-1 space-y-3">
        {stockData.map((stock, idx) => {
          const status = getStockStatus(stock.quantity, stock.minimumRequired);
          return (
            <div 
              key={idx}
              className={`p-3 rounded-lg ${
                status === 'shortage' ? 'bg-red-950/50 border-2 border-red-800' : 
                status === 'low' ? 'bg-yellow-950/30 border-2 border-yellow-800/50' : 
                'bg-emerald-950/30 border-2 border-emerald-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-lg font-bold text-emerald-400">{stock.tyreSize}</div>
                <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                  status === 'shortage' ? 'bg-red-600 text-red-100' :
                  status === 'low' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-emerald-600 text-emerald-100'
                }`}>
                  {status === 'shortage' ? '⚠ Shortage' :
                   status === 'low' ? 'Low Stock' :
                   'Available'}
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <div className={`text-4xl font-bold tabular-nums ${
                  status === 'shortage' ? 'text-red-400' :
                  status === 'low' ? 'text-yellow-400' :
                  'text-emerald-400'
                }`}>
                  {stock.quantity}
                </div>
                <div className="text-base text-slate-400">
                  / {stock.minimumRequired} min required
                </div>
              </div>
            </div>
          );
        })}
        
        {stockData.length === 0 && (
          <div className="text-center text-slate-500 py-8 italic">
            No stock data for this site
          </div>
        )}
      </div>
    </div>
  );
}
