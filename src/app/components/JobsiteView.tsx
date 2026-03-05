import { Jobsite, TyreIssue, StockData } from '../types';
import { JobsiteOverview } from './JobsiteOverview';
import { TyreMonitoringTable } from './TyreMonitoringTable';
import { LifetimePanel } from './LifetimePanel';
import { PressurePanel } from './PressurePanel';
import { SiteStockPanel } from './SiteStockPanel';

interface JobsiteViewProps {
  jobsite: Jobsite;
  tyreData: TyreIssue[];
  stockData: StockData[];
}

export function JobsiteView({ jobsite, tyreData, stockData }: JobsiteViewProps) {
  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-280px)]">
      {/* Top Overview - Full Width */}
      <div className="col-span-12">
        <JobsiteOverview jobsite={jobsite} tyreData={tyreData} stockData={stockData} />
      </div>

      {/* Main Table - Center */}
      <div className="col-span-5">
        <TyreMonitoringTable tyreData={tyreData} />
      </div>

      {/* Right Panel - Monitoring Panels */}
      <div className="col-span-7 space-y-4 flex flex-col">
        <LifetimePanel tyreData={tyreData} />
        <PressurePanel tyreData={tyreData} />
        <div className="flex-1">
          <SiteStockPanel stockData={stockData} />
        </div>
      </div>
    </div>
  );
}