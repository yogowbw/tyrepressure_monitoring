import { Unit } from '../types';
import { UnitCard } from './UnitCard';
import { UnitCardHauling } from './UnitCardHauling';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
// Figma asset disabled for local development
// import dumpTruckImage from 'figma:asset/e95efd8399d901162f8bad6f93ce3d8c9a63f5fe.png';
const dumpTruckImage = '';

interface Props {
  units: Unit[];
  unitsInRange: Unit[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedView: 'follow-up' | 'in-range';
  onViewChange: (view: 'follow-up' | 'in-range') => void;
  onTooltipChange: (isVisible: boolean) => void;
  equipmentClass: string;
}

export function TyreFollowUpDetail({ 
  units, 
  unitsInRange,
  currentPage, 
  totalPages, 
  onPageChange,
  selectedView,
  onViewChange,
  onTooltipChange,
  equipmentClass
}: Props) {
  const displayUnits = selectedView === 'follow-up' ? units : unitsInRange;
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [prevPage, setPrevPage] = useState(currentPage);

  useEffect(() => {
    if (currentPage > prevPage) {
      setSlideDirection('right');
    } else if (currentPage < prevPage) {
      setSlideDirection('left');
    }
    setPrevPage(currentPage);
  }, [currentPage, prevPage]);

  // Show dump truck image only for Mining equipment (DT 180/150/100 Ton)
  const showDumpTruckImage = equipmentClass === 'Mining';

  return (
    <div className="relative">
      {/* View Selection */}
      <div className="mb-4">
        <div className="flex gap-3">
          <button
            onClick={() => onViewChange('follow-up')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'follow-up'
                ? 'bg-neutral-800 dark:bg-neutral-700 text-white'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600'
            }`}
          >
            Tyre Pressure Need Follow Up
          </button>
          <button
            onClick={() => onViewChange('in-range')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'in-range'
                ? 'bg-neutral-800 dark:bg-neutral-700 text-white'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600'
            }`}
          >
            Tyre Pressure In Range
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-wide text-[16px]">
            {selectedView === 'follow-up' ? 'Tyre Need Follow-Up' : 'Tyre In Range'}
          </h2>
          
          {/* Pagination */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
              Page {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dump Truck Image - Only for Mining Equipment */}
        {showDumpTruckImage && (
          <img 
            src={dumpTruckImage} 
            alt="Dump Truck" 
            className="absolute -top-12 right-0 h-40 w-auto object-contain pointer-events-none"
            style={{ mixBlendMode: 'multiply' }}
          />
        )}
      </div>

      {/* Unit Grid with Slide Animation */}
      <div className="overflow-hidden">
        {displayUnits.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            No units to display
          </div>
        ) : (
          <div 
            key={currentPage}
            className="flex flex-col gap-4 animate-slideIn"
            style={{
              animation: slideDirection === 'right' 
                ? 'slideInFromRight 0.5s ease-out' 
                : 'slideInFromLeft 0.5s ease-out'
            }}
          >
            {displayUnits.map((unit) => (
              equipmentClass === 'Hauling' ? 
              <UnitCardHauling key={unit.unitCode} unit={unit} onTooltipChange={onTooltipChange} />
              : 
              <UnitCard key={unit.unitCode} unit={unit} onTooltipChange={onTooltipChange} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}