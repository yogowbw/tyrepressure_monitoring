import { useState, useEffect } from 'react';
import { PressureQualitySummary } from './components/PressureQualitySummary';
import { VehicleFollowUpList } from './components/VehicleFollowUpList';
import { TyreFollowUpDetail } from './components/TyreFollowUpDetail';
import { CheckAchievementSummary } from './components/CheckAchievementSummary';
import { CheckDetail } from './components/CheckDetail';
import { DarkModeToggle } from './components/DarkModeToggle';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { Unit, PressureQuality, CheckAchievement } from './types';
import { DashboardData, fetchDashboardData } from './api/dashboardApi';

const UNITS_PER_PAGE = 1;

const EQUIPMENT_CLASSES: Record<string, string[]> = {
  'ADMO Mining': ['DT 180 Ton', 'DT 150 Ton', 'DT 100 Ton'],
  'ADMO Hauling': ['DT 20-40 Ton'],
  'SERA': ['DT 100 Ton'],
  'MACO Mining': ['DT 100 Ton'],
  'MACO Hauling': ['DT 20-40 Ton'],
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobsite, setSelectedJobsite] = useState('ADMO Mining');
  const [selectedEquipmentClass, setSelectedEquipmentClass] = useState('DT 180 Ton');
  const [selectedView, setSelectedView] = useState<'follow-up' | 'in-range'>('follow-up');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData(selectedJobsite, selectedEquipmentClass);
        if (!active) return;
        setDashboardData(data);
        setCurrentPage(1);
      } catch (err) {
        if (!active) return;
        setDashboardData(null);
        setError(err instanceof Error ? err.message : 'Gagal mengambil data dari backend');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [selectedJobsite, selectedEquipmentClass]);

  // When jobsite changes, set the first equipment class for that jobsite
  useEffect(() => {
    const firstEquipmentClass = EQUIPMENT_CLASSES[selectedJobsite][0];
    setSelectedEquipmentClass(firstEquipmentClass);
  }, [selectedJobsite]);

  // Reset page when changing view
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedView]);

  // Calculate pressure quality
  const pressureQuality: PressureQuality = dashboardData?.pressureQuality || {
    totalTyresNeedingFollowUp: 0,
    totalAffectedVehicles: 0,
    percentInRange: 0,
    percentLow: 0,
    percentOver: 0,
    countInRange: 0,
    countLow: 0,
    countOver: 0,
  };

  const checkAchievement: CheckAchievement = dashboardData?.checkAchievement || {
    totalOverdue: 0,
    achievementPI: 0,
    accuracyPI: 0,
    unitsWithinTarget: 0,
    totalUnits: 0,
    unitsCheckedToday: 0,
    unitsNotCheckedButInRange: 0,
  };

  const unitsNeedingFollowUp = dashboardData?.unitsNeedingFollowUp || [];
  const unitsInRange = dashboardData?.unitsInRange || [];
  const overdueUnits = dashboardData?.overdueUnits || [];

  const displayUnits = selectedView === 'follow-up' ? unitsNeedingFollowUp : unitsInRange;
  
  const startIndex = (currentPage - 1) * UNITS_PER_PAGE;
  const followUpPageUnits = unitsNeedingFollowUp.slice(startIndex, startIndex + UNITS_PER_PAGE);
  const inRangePageUnits = unitsInRange.slice(startIndex, startIndex + UNITS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(displayUnits.length / UNITS_PER_PAGE));

  // Handle unit selection from Vehicle Follow-Up List
  const handleUnitSelect = (unitCode: string) => {
    setSelectedView('follow-up');
    const unitIndex = unitsNeedingFollowUp.findIndex(u => u.unitCode === unitCode);
    if (unitIndex !== -1) {
      const targetPage = Math.floor(unitIndex / UNITS_PER_PAGE) + 1;
      setCurrentPage(targetPage);
    }
  };

  // Auto-cycle pages every 3 seconds
  useEffect(() => {
    if (totalPages <= 1 || isTooltipVisible) return; // Don't cycle if only one page or tooltip is visible
    
    const interval = setInterval(() => {
      setCurrentPage(prev => {
        if (prev >= totalPages) return 1;
        return prev + 1;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalPages, isTooltipVisible]);

  const latestUpdate = dashboardData?.lastUpdate
    ? new Date(dashboardData.lastUpdate).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <DarkModeProvider>
      <div className="h-screen bg-neutral-100 dark:bg-neutral-900 p-6 overflow-hidden flex flex-col transition-colors">
        {/* Header - Compact */}
        <header className="mb-4 max-w-[3840px] mx-auto w-full flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 tracking-tight">
              TYRE PRESSURE MONITORING
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                  Latest Update
                </div>
                <div className="text-xl font-mono text-neutral-800 dark:text-neutral-100 tabular-nums">
                  {latestUpdate}
                </div>
              </div>
              <DarkModeToggle />
            </div>
          </div>

        {/* Jobsite and Equipment Class Selection - Compact */}
        <div className="flex justify-between items-center gap-6">
          {/* Jobsite Selection */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">JOBSITE:</div>
            <div className="flex gap-2">
              {['ADMO Mining', 'ADMO Hauling', 'SERA', 'MACO Mining', 'MACO Hauling'].map((jobsite) => (
                <button
                  key={jobsite}
                  onClick={() => setSelectedJobsite(jobsite)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedJobsite === jobsite
                      ? 'bg-neutral-800 dark:bg-neutral-700 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600'
                  }`}
                >
                  {jobsite}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Class Selection */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">EQUIPMENT CLASS:</div>
            <div className="flex gap-2">
              {EQUIPMENT_CLASSES[selectedJobsite].map((equipmentClass) => (
                <button
                  key={equipmentClass}
                  onClick={() => setSelectedEquipmentClass(equipmentClass)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedEquipmentClass === equipmentClass
                      ? 'bg-neutral-800 dark:bg-neutral-700 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600'
                  }`}
                >
                  {equipmentClass}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Layout - 2 columns */}
      <div className="grid grid-cols-[480px_1fr] gap-6 max-w-[3840px] mx-auto w-full flex-1 min-h-0">
        {/* Column 1 - Pressure Quality Summary + Vehicle Follow-Up List */}
        <div className="flex flex-col gap-4 h-full min-h-0">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-5 flex-shrink-0 transition-colors">
            <PressureQualitySummary data={pressureQuality} />
          </div>
          <div className="flex-1 min-h-0">
            <VehicleFollowUpList units={unitsNeedingFollowUp} onUnitSelect={handleUnitSelect} />
          </div>
        </div>

        {/* Column 2 - Tyre Follow-Up Detail on left, Check Achievement Summary + Check Detail stacked on right */}
        <div className="flex gap-6 h-full min-h-0">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-6 flex-1 min-h-0 overflow-hidden transition-colors">
            <TyreFollowUpDetail 
              units={followUpPageUnits}
              unitsInRange={inRangePageUnits}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              selectedView={selectedView}
              onViewChange={setSelectedView}
              onTooltipChange={setIsTooltipVisible}
              equipmentClass={selectedEquipmentClass.includes('20-40') ? 'Hauling' : 'Mining'}
            />
          </div>
          <div className={`flex flex-col gap-4 min-h-0 ${selectedEquipmentClass.includes('20-40') ? 'w-[360px]' : 'w-[480px]'}`}>
            <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-5 flex-1 min-h-0 overflow-auto transition-colors">
              <CheckAchievementSummary data={checkAchievement} />
            </div>
            <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-5 flex-1 min-h-0 overflow-auto transition-colors">
              <CheckDetail units={overdueUnits} />
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed bottom-4 right-4 bg-neutral-900 text-white text-sm px-3 py-2 rounded shadow-lg">
          Loading data from SQL...
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-700 text-white text-sm px-3 py-2 rounded shadow-lg max-w-xl">
          {error}
        </div>
      )}
    </div>
    </DarkModeProvider>
  );
}
