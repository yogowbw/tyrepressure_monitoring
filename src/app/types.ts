export type PressureStatus = 'normal' | 'low' | 'over';
export type ProgressStatus = 'not_contacted' | 'called' | 'waiting';

export interface Tyre {
  position: number; // 1-6
  pressure: number;
  recommendedPressure: number;
  status: PressureStatus;
  lifetime: number;
  brand: string;
  serialNumber: string;
}

export interface Unit {
  unitCode: string;
  tyres: Tyre[];
  lastCheckDays: number;
  progressStatus: ProgressStatus;
  checkedToday: boolean;
}

export interface PressureQuality {
  totalTyresNeedingFollowUp: number;
  totalAffectedVehicles: number;
  percentInRange: number;
  percentLow: number;
  percentOver: number;
  countInRange: number;
  countLow: number;
  countOver: number;
}

export interface CheckAchievement {
  totalOverdue: number;
  achievementPI: number; // Daily inspection coverage: units checked today / total units
  accuracyPI: number; // Inspection compliance: units meeting 3-day requirement / total units
  unitsWithinTarget: number;
  totalUnits: number;
  unitsCheckedToday: number;
  unitsNotCheckedButInRange: number; // Units not checked today but within 3 days
}