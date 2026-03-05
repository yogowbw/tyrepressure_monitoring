import { Unit, Tyre, PressureStatus, ProgressStatus } from '../types';

const brands = ['Michelin', 'Bridgestone', 'Goodyear', 'Triangle'];

function generateTyre(position: number, forceIssue: boolean = false): Tyre {
  let pressure: number;
  let status: PressureStatus;
  const recommendedPressure = 100; // Standard recommended pressure

  if (forceIssue) {
    const rand = Math.random();
    if (rand < 0.5) {
      pressure = 75 + Math.random() * 10; // Low
      status = 'low';
    } else {
      pressure = 115 + Math.random() * 10; // Over
      status = 'over';
    }
  } else {
    const rand = Math.random();
    if (rand < 0.15) {
      pressure = 75 + Math.random() * 10;
      status = 'low';
    } else if (rand < 0.25) {
      pressure = 115 + Math.random() * 10;
      status = 'over';
    } else {
      pressure = 95 + Math.random() * 10;
      status = 'normal';
    }
  }

  return {
    position,
    pressure: Math.round(pressure),
    recommendedPressure,
    status,
    lifetime: Math.round(5000 + Math.random() * 8000),
    brand: brands[Math.floor(Math.random() * brands.length)],
    serialNumber: `SN${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
  };
}

function generateJobsiteData(
  unitPrefix: string, 
  totalUnits: number, 
  unitsWithIssues: number,
  issueRate: { low: number; over: number },
  tyresPerUnit: number = 6
): Unit[] {
  const units: Unit[] = [];

  for (let i = 0; i < totalUnits; i++) {
    const tyres: Tyre[] = [];
    const shouldHaveIssue = i < unitsWithIssues;
    const recommendedPressure = 100; // Standard recommended pressure

    for (let pos = 1; pos <= tyresPerUnit; pos++) {
      let pressure: number;
      let status: PressureStatus;

      if (shouldHaveIssue && pos <= 2) {
        // Force issues for first 2 tyres on vehicles that should have issues
        const rand = Math.random();
        if (rand < issueRate.low) {
          pressure = 75 + Math.random() * 10;
          status = 'low';
        } else {
          pressure = 115 + Math.random() * 10;
          status = 'over';
        }
      } else {
        // Healthy distribution - 95% normal, only 5% issues
        const rand = Math.random();
        if (rand < 0.02) {
          pressure = 75 + Math.random() * 10;
          status = 'low';
        } else if (rand < 0.05) {
          pressure = 115 + Math.random() * 10;
          status = 'over';
        } else {
          pressure = 95 + Math.random() * 10;
          status = 'normal';
        }
      }

      tyres.push({
        position: pos,
        pressure: Math.round(pressure),
        recommendedPressure,
        status,
        lifetime: Math.round(5000 + Math.random() * 8000),
        brand: brands[Math.floor(Math.random() * brands.length)],
        serialNumber: `SN${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
      });
    }

    // Healthy check schedule - most units checked recently
    const rand = Math.random();
    let lastCheckDays: number;
    if (rand < 0.60) {
      lastCheckDays = 0; // 60% checked today
    } else if (rand < 0.85) {
      lastCheckDays = 1; // 25% checked yesterday
    } else if (rand < 0.95) {
      lastCheckDays = 2; // 10% checked 2 days ago
    } else {
      lastCheckDays = Math.floor(3 + Math.random() * 3); // Only 5% overdue (3-5 days)
    }
    
    const progressStatuses: ProgressStatus[] = ['not_contacted', 'called', 'waiting'];
    const progressStatus = lastCheckDays > 3 
      ? progressStatuses[Math.floor(Math.random() * progressStatuses.length)]
      : 'not_contacted';
    
    // Most units checked today for healthy operations
    const checkedToday = lastCheckDays === 0;

    units.push({
      unitCode: `${unitPrefix}-${String(i + 1).padStart(3, '0')}`,
      tyres,
      lastCheckDays,
      progressStatus,
      checkedToday,
    });
  }

  // Sort by units with issues first
  return units.sort((a, b) => {
    const aIssues = a.tyres.filter(t => t.status !== 'normal').length;
    const bIssues = b.tyres.filter(t => t.status !== 'normal').length;
    return bIssues - aIssues;
  });
}

export function generateMockData(jobsite: string): Unit[] {
  switch (jobsite) {
    case 'ADMO Mining':
      return generateJobsiteData('DT', 120, 8, { low: 0.6, over: 0.4 });
    
    case 'ADMO Hauling':
      return generateJobsiteData('HD', 85, 5, { low: 0.5, over: 0.5 });
    
    case 'SERA':
      return generateJobsiteData('SR', 95, 6, { low: 0.7, over: 0.3 });
    
    case 'MACO Mining':
      return generateJobsiteData('MT', 110, 7, { low: 0.55, over: 0.45 });
    
    case 'MACO Hauling':
      return generateJobsiteData('MH', 78, 4, { low: 0.45, over: 0.55 });
    
    default:
      return generateJobsiteData('DT', 120, 8, { low: 0.6, over: 0.4 });
  }
}

export function generateMockDataByEquipmentClass(jobsite: string, equipmentClass: string): Unit[] {
  const jobsiteEquipmentKey = `${jobsite}-${equipmentClass}`;
  
  switch (jobsiteEquipmentKey) {
    // ADMO Mining - Healthy operations: ~5-10% vehicles with issues
    case 'ADMO Mining-DT 180 Ton':
      return generateJobsiteData('DT180', 45, 3, { low: 0.6, over: 0.4 });
    case 'ADMO Mining-DT 150 Ton':
      return generateJobsiteData('DT150', 40, 3, { low: 0.5, over: 0.5 });
    case 'ADMO Mining-DT 100 Ton':
      return generateJobsiteData('DT100', 35, 2, { low: 0.55, over: 0.45 });
    
    // ADMO Hauling
    case 'ADMO Hauling-DT 20-40 Ton':
      return generateJobsiteData('HD', 85, 5, { low: 0.5, over: 0.5 }, 54);
    
    // SERA
    case 'SERA-DT 100 Ton':
      return generateJobsiteData('SR100', 95, 6, { low: 0.7, over: 0.3 });
    
    // MACO Mining
    case 'MACO Mining-DT 100 Ton':
      return generateJobsiteData('MT100', 110, 7, { low: 0.55, over: 0.45 });
    
    // MACO Hauling
    case 'MACO Hauling-DT 20-40 Ton':
      return generateJobsiteData('MH', 78, 4, { low: 0.45, over: 0.55 });
    
    // Default fallback
    default:
      return generateJobsiteData('DT', 120, 8, { low: 0.6, over: 0.4 });
  }
}