import { createRequest, getPool } from "../db.js";

function applyFilter(baseSql, hasEquipmentClass = true) {
  if (hasEquipmentClass) {
    return `
${baseSql}
WHERE Jobsite = @jobsite
  AND (@equipmentClass IS NULL OR EquipmentClass = @equipmentClass)
`;
  }

  return `
${baseSql}
WHERE Jobsite = @jobsite
`;
}

export async function getPressureQuality(jobsite, equipmentClass = null) {
  const pool = await getPool();
  const sql = applyFilter(
    `
SELECT TOP 1
  Jobsite,
  EquipmentClass,
  TotalTyresNeedingFollowUp,
  TotalAffectedVehicles,
  PercentInRange,
  PercentLow,
  PercentOver,
  CountInRange,
  CountLow,
  CountOver
FROM Monitoring.vw_kpi_pressure_quality
`,
    true
  );

  const result = await createRequest(pool, { jobsite, equipmentClass }).query(sql);
  return result.recordset[0] || null;
}

export async function getCheckAchievement(jobsite, equipmentClass = null) {
  const pool = await getPool();
  const sql = applyFilter(
    `
SELECT TOP 1
  Jobsite,
  EquipmentClass,
  TotalOverdue,
  AchievementPI,
  AccuracyPI,
  UnitsWithinTarget,
  TotalUnits,
  UnitsCheckedToday,
  UnitsNotCheckedButInRange
FROM Monitoring.vw_kpi_tyre_check
`,
    true
  );

  const result = await createRequest(pool, { jobsite, equipmentClass }).query(sql);
  return result.recordset[0] || null;
}

export async function getUnitStatus(jobsite, equipmentClass = null) {
  const pool = await getPool();
  const sql = applyFilter(
    `
SELECT
  Jobsite,
  EquipmentClass,
  UnitCode,
  LastCheckDays,
  ProgressStatus,
  CheckedToday,
  NeedsFollowUp,
  AllTyresInRange
FROM Monitoring.vw_unit_status
`,
    true
  );

  const result = await createRequest(pool, { jobsite, equipmentClass }).query(sql);
  return result.recordset;
}

export async function getUnitTyres(jobsite, equipmentClass = null) {
  const pool = await getPool();
  const sql = applyFilter(
    `
SELECT
  Jobsite,
  EquipmentClass,
  UnitCode,
  Position,
  Pressure,
  RecommendedPressure,
  PressureStatus,
  Lifetime,
  Brand,
  SerialNumber
FROM Monitoring.vw_tyre_latest
`,
    true
  );

  const result = await createRequest(pool, { jobsite, equipmentClass }).query(sql);
  return result.recordset;
}

export async function getLastUpdate(jobsite, equipmentClass = null) {
  const pool = await getPool();
  const sql = applyFilter(
    `
SELECT
  MAX(LastReadingAt) AS LastReadingAt
FROM Monitoring.vw_tyre_latest
`,
    true
  );

  const result = await createRequest(pool, { jobsite, equipmentClass }).query(sql);
  return result.recordset[0]?.LastReadingAt || null;
}

export async function getEquipmentClasses(jobsite) {
  const pool = await getPool();
  const sql = applyFilter(
    `
SELECT DISTINCT EquipmentClass
FROM Monitoring.vw_unit_status
`,
    false
  );

  const result = await createRequest(pool, { jobsite }).query(sql);
  return result.recordset.map((row) => row.EquipmentClass).sort();
}

