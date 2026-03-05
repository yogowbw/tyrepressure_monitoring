import { Unit } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Props {
  units: Unit[];
}

const UNITS_PER_PAGE = 3;

export function CheckDetail({ units }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(units.length / UNITS_PER_PAGE);
  const startIndex = (currentPage - 1) * UNITS_PER_PAGE;
  const pageUnits = units.slice(startIndex, startIndex + UNITS_PER_PAGE);

  const getProgressLabel = (status: string) => {
    switch (status) {
      case 'not_contacted': return 'Not Contacted';
      case 'called': return 'Called by Tyre Team';
      case 'waiting': return 'Waiting for Arrival';
      default: return '';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'not_contacted': return 'bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300';
      case 'called': return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'waiting': return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      default: return 'bg-neutral-100 dark:bg-neutral-700';
    }
  };

  const getUrgencyLevel = (days: number) => {
    if (days > 7) return { label: 'High', color: 'text-red-600 dark:text-red-500' };
    if (days > 5) return { label: 'Medium', color: 'text-orange-600 dark:text-orange-500' };
    return { label: 'Low', color: 'text-neutral-600 dark:text-neutral-400' };
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wide">
          Vehicle Overdue (&gt;3 days)
        </h2>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-xs text-neutral-600 dark:text-neutral-400 tabular-nums">
              Page {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {pageUnits.map((unit) => {
            const urgency = getUrgencyLevel(unit.lastCheckDays);
            
            return (
              <div 
                key={unit.unitCode}
                className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">{unit.unitCode}</h3>
                  <div className={`text-xs font-bold ${urgency.color}`}>
                    {urgency.label} Priority
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Last Check</div>
                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {unit.lastCheckDays} days ago
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Days Overdue</div>
                    <div className="text-sm font-bold text-red-600 dark:text-red-500">
                      {unit.lastCheckDays - 3} days
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Progress Status</div>
                  <div className={`text-xs font-medium px-2 py-1 rounded border inline-block ${
                    getProgressColor(unit.progressStatus)
                  }`}>
                    {getProgressLabel(unit.progressStatus)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}