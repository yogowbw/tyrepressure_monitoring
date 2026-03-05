import { Unit } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Props {
  units: Unit[];
  onUnitSelect: (unitCode: string) => void;
}

const UNITS_PER_PAGE = 10;

export function VehicleFollowUpList({ units, onUnitSelect }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get only units that need follow-up (have tyres with issues)
  const unitsNeedingFollowUp = units.filter(u => 
    u.tyres.some(t => t.status !== 'normal')
  );

  const totalPages = Math.ceil(unitsNeedingFollowUp.length / UNITS_PER_PAGE);
  const startIndex = (currentPage - 1) * UNITS_PER_PAGE;
  const pageUnits = unitsNeedingFollowUp.slice(startIndex, startIndex + UNITS_PER_PAGE);

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wide">
            Vehicles Needing Follow-Up
          </h3>
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            ({unitsNeedingFollowUp.length} units)
          </span>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {pageUnits.length > 0 ? (
          pageUnits.map((unit) => {
            // Get tyres with their positions and status that need adjustment
            const issueTyres = unit.tyres
              .map((tyre, index) => ({ 
                position: index + 1, 
                status: tyre.status 
              }))
              .filter(item => item.status !== 'normal');
            
            return (
              <div
                key={unit.unitCode}
                className="bg-[#fff8ee] dark:bg-[#fff8ee] border border-[#e8d7bd] dark:border-[#e8d7bd] rounded px-3 py-2 cursor-pointer hover:bg-[#fff4e5] dark:hover:bg-[#fff4e5] hover:border-[#dcc39c] dark:hover:border-[#dcc39c] transition-colors"
                onClick={() => onUnitSelect(unit.unitCode)}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-neutral-800">
                    {unit.unitCode}
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {issueTyres.map((tyre) => (
                      <span
                        key={tyre.position}
                        className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 text-white text-xs font-bold rounded ${
                          tyre.status === 'low' ? 'bg-red-600' : 'bg-orange-500'
                        }`}
                      >
                        {tyre.position}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <span className="text-sm text-neutral-500 dark:text-neutral-400">No vehicles requiring follow-up</span>
        )}
      </div>
    </div>
  );
}
