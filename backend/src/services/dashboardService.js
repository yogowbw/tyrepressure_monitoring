import {
  getCheckAchievement,
  getEquipmentClasses,
  getLastUpdate,
  getPressureQuality,
  getUnitStatus,
  getUnitTyres,
} from "../repositories/dashboardRepository.js";

function toBoolean(value) {
  return value === true || value === 1;
}

function mapPressureQuality(row) {
  if (!row) return null;
  return {
    totalTyresNeedingFollowUp: row.TotalTyresNeedingFollowUp,
    totalAffectedVehicles: row.TotalAffectedVehicles,
    percentInRange: row.PercentInRange,
    percentLow: row.PercentLow,
    percentOver: row.PercentOver,
    countInRange: row.CountInRange,
    countLow: row.CountLow,
    countOver: row.CountOver,
  };
}

function mapCheckAchievement(row) {
  if (!row) return null;
  return {
    totalOverdue: row.TotalOverdue,
    achievementPI: row.AchievementPI,
    accuracyPI: row.AccuracyPI,
    unitsWithinTarget: row.UnitsWithinTarget,
    totalUnits: row.TotalUnits,
    unitsCheckedToday: row.UnitsCheckedToday,
    unitsNotCheckedButInRange: row.UnitsNotCheckedButInRange,
  };
}

function mapTyreRow(row) {
  return {
    position: row.Position,
    pressure: row.Pressure,
    recommendedPressure: row.RecommendedPressure,
    status: row.PressureStatus,
    lifetime: row.Lifetime,
    brand: row.Brand,
    serialNumber: row.SerialNumber,
  };
}

function mapUnitRow(row, tyres) {
  return {
    unitCode: row.UnitCode,
    lastCheckDays: row.LastCheckDays,
    progressStatus: row.ProgressStatus,
    checkedToday: toBoolean(row.CheckedToday),
    tyres,
  };
}

export async function buildDashboardData(jobsite, equipmentClass = null) {
  const [pressureQualityRow, checkAchievementRow, unitRows, tyreRows, lastUpdate] =
    await Promise.all([
      getPressureQuality(jobsite, equipmentClass),
      getCheckAchievement(jobsite, equipmentClass),
      getUnitStatus(jobsite, equipmentClass),
      getUnitTyres(jobsite, equipmentClass),
      getLastUpdate(jobsite, equipmentClass),
    ]);

  const tyreMap = new Map();
  tyreRows.forEach((row) => {
    if (!tyreMap.has(row.UnitCode)) {
      tyreMap.set(row.UnitCode, []);
    }
    tyreMap.get(row.UnitCode).push(mapTyreRow(row));
  });

  tyreMap.forEach((tyres) => tyres.sort((a, b) => a.position - b.position));

  const allUnits = unitRows.map((row) => mapUnitRow(row, tyreMap.get(row.UnitCode) || []));

  const unitsNeedingFollowUp = allUnits.filter((unit) =>
    unit.tyres.some((tyre) => tyre.status !== "normal")
  );

  const unitsInRange = allUnits.filter((unit) =>
    unit.tyres.every((tyre) => tyre.status === "normal")
  );

  const overdueUnits = allUnits
    .filter((unit) => unit.lastCheckDays > 3)
    .sort((a, b) => b.lastCheckDays - a.lastCheckDays);

  return {
    pressureQuality: mapPressureQuality(pressureQualityRow),
    checkAchievement: mapCheckAchievement(checkAchievementRow),
    unitsNeedingFollowUp,
    unitsInRange,
    overdueUnits,
    lastUpdate,
  };
}

export async function listEquipmentClasses(jobsite) {
  return getEquipmentClasses(jobsite);
}

