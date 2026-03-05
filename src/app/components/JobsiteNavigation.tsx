import { JobsiteFilter, TyreIssue } from '../types';
import { useMemo } from 'react';

interface JobsiteNavigationProps {
  selectedJobsite: JobsiteFilter;
  onSelectJobsite: (jobsite: JobsiteFilter) => void;
  tyreData: TyreIssue[];
}

const jobsites: JobsiteFilter[] = [
  'ALL SITES',
  'ADMO Mining',
  'ADMO Hauling',
  'SERA',
  'MACO Mining',
  'MACO Hauling',
];

export function JobsiteNavigation({ selectedJobsite, onSelectJobsite, tyreData }: JobsiteNavigationProps) {
  // Calculate issue counts per jobsite
  const jobsiteIssues = useMemo(() => {
    const issues = new Map<string, number>();
    
    tyreData.forEach(tyre => {
      if (tyre.overallStatus === 'monitor' || tyre.overallStatus === 'critical') {
        issues.set(tyre.jobsite, (issues.get(tyre.jobsite) || 0) + 1);
      }
    });
    
    return issues;
  }, [tyreData]);

  const totalIssues = useMemo(() => 
    Array.from(jobsiteIssues.values()).reduce((sum, count) => sum + count, 0),
    [jobsiteIssues]
  );

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-3">
        {jobsites.map((jobsite) => {
          const isSelected = selectedJobsite === jobsite;
          const issueCount = jobsite === 'ALL SITES' ? totalIssues : (jobsiteIssues.get(jobsite) || 0);
          const hasIssues = issueCount > 0;

          return (
            <button
              key={jobsite}
              onClick={() => onSelectJobsite(jobsite)}
              className={`
                flex-1 px-6 py-4 rounded-lg text-xl font-bold uppercase tracking-wide transition-all
                ${isSelected 
                  ? 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-lg shadow-emerald-900/50' 
                  : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{jobsite}</span>
                {hasIssues && (
                  <span className={`
                    px-3 py-1 rounded-full text-base font-bold tabular-nums
                    ${isSelected 
                      ? 'bg-red-500 text-white' 
                      : 'bg-red-600 text-red-100'
                    }
                  `}>
                    {issueCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
