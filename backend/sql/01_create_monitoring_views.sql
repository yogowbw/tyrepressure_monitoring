/*
  Tyre Pressure Monitoring - Views based on Fact.TyrePressureReading
  This version does NOT depend on Dim.Unit / Dim.Tyre / Fact.TyreCheck.
*/

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'Monitoring')
BEGIN
  EXEC('CREATE SCHEMA Monitoring');
END
GO

CREATE OR ALTER VIEW Monitoring.vw_tyre_latest
AS
WITH latest_tyre AS (
  SELECT
    f.TyrePressureReadingID,
    f.UnitCode,
    f.EquipmentClass,
    f.PlantDescription,
    f.TyrePosition,
    f.TyreSerialNumber,
    f.BrandName,
    f.RecommendedPressurePsi,
    f.PressurePsi,
    f.LifetimeHours,
    f.ReadingDateTime,
    ROW_NUMBER() OVER (
      PARTITION BY f.UnitCode, f.TyreSerialNumber
      ORDER BY f.ReadingDateTime DESC, f.TyrePressureReadingID DESC
    ) AS rn
  FROM Fact.TyrePressureReading f
),
latest_unit_check AS (
  SELECT
    f.UnitCode,
    MAX(f.ReadingDateTime) AS LastCheckAt
  FROM Fact.TyrePressureReading f
  GROUP BY f.UnitCode
)
SELECT
  CASE
    WHEN lt.PlantDescription = 'ADMO Hauling' THEN 'ADMO Hauling'
    WHEN lt.PlantDescription IN ('ADMO', 'ADMO Tutupan', 'ADMO Wara') THEN 'ADMO Mining'
    WHEN lt.PlantDescription IN ('SERA Mining', 'SERA Hauling') THEN 'SERA'
    WHEN lt.PlantDescription = 'MACO Mining' THEN 'MACO Mining'
    WHEN lt.PlantDescription = 'MACO Hauling' THEN 'MACO Hauling'
    ELSE NULL
  END AS Jobsite,
  lt.EquipmentClass,
  lt.UnitCode,
  CAST(lt.TyrePosition AS int) AS Position,
  CAST(lt.PressurePsi AS decimal(10,2)) AS Pressure,
  CAST(lt.RecommendedPressurePsi AS decimal(10,2)) AS RecommendedPressure,
  CASE
    WHEN lt.PressurePsi < lt.RecommendedPressurePsi * 0.90 THEN 'low'
    WHEN lt.PressurePsi > lt.RecommendedPressurePsi * 1.10 THEN 'over'
    ELSE 'normal'
  END AS PressureStatus,
  CAST(ISNULL(lt.LifetimeHours, 0) AS decimal(18,2)) AS Lifetime,
  lt.BrandName AS Brand,
  lt.TyreSerialNumber AS SerialNumber,
  lt.ReadingDateTime AS LastReadingAt,
  uc.LastCheckAt,
  'not_contacted' AS ProgressStatus
FROM latest_tyre lt
JOIN latest_unit_check uc
  ON uc.UnitCode = lt.UnitCode
WHERE lt.rn = 1
  AND lt.PlantDescription IN (
    'ADMO',
    'ADMO Tutupan',
    'ADMO Wara',
    'ADMO Hauling',
    'SERA Mining',
    'SERA Hauling',
    'MACO Mining',
    'MACO Hauling'
  );
GO

CREATE OR ALTER VIEW Monitoring.vw_unit_status
AS
SELECT
  Jobsite,
  EquipmentClass,
  UnitCode,
  MAX(CASE WHEN DATEDIFF(DAY, LastCheckAt, GETDATE()) = 0 THEN 1 ELSE 0 END) AS CheckedToday,
  MAX(ISNULL(DATEDIFF(DAY, LastCheckAt, GETDATE()), 999)) AS LastCheckDays,
  MAX(ProgressStatus) AS ProgressStatus,
  MAX(CASE WHEN PressureStatus <> 'normal' THEN 1 ELSE 0 END) AS NeedsFollowUp,
  CASE
    WHEN SUM(CASE WHEN PressureStatus <> 'normal' THEN 1 ELSE 0 END) = 0 THEN 1
    ELSE 0
  END AS AllTyresInRange
FROM Monitoring.vw_tyre_latest
WHERE Jobsite IS NOT NULL
GROUP BY Jobsite, EquipmentClass, UnitCode;
GO

CREATE OR ALTER VIEW Monitoring.vw_kpi_pressure_quality
AS
SELECT
  t.Jobsite,
  t.EquipmentClass,
  SUM(CASE WHEN t.PressureStatus <> 'normal' THEN 1 ELSE 0 END) AS TotalTyresNeedingFollowUp,
  COUNT(DISTINCT CASE WHEN t.PressureStatus <> 'normal' THEN t.UnitCode END) AS TotalAffectedVehicles,
  CAST(100.0 * SUM(CASE WHEN t.PressureStatus = 'normal' THEN 1 ELSE 0 END) / NULLIF(COUNT(1), 0) AS int) AS PercentInRange,
  CAST(100.0 * SUM(CASE WHEN t.PressureStatus = 'low' THEN 1 ELSE 0 END) / NULLIF(COUNT(1), 0) AS int) AS PercentLow,
  CAST(100.0 * SUM(CASE WHEN t.PressureStatus = 'over' THEN 1 ELSE 0 END) / NULLIF(COUNT(1), 0) AS int) AS PercentOver,
  SUM(CASE WHEN t.PressureStatus = 'normal' THEN 1 ELSE 0 END) AS CountInRange,
  SUM(CASE WHEN t.PressureStatus = 'low' THEN 1 ELSE 0 END) AS CountLow,
  SUM(CASE WHEN t.PressureStatus = 'over' THEN 1 ELSE 0 END) AS CountOver
FROM Monitoring.vw_tyre_latest t
WHERE t.Jobsite IS NOT NULL
GROUP BY t.Jobsite, t.EquipmentClass;
GO

CREATE OR ALTER VIEW Monitoring.vw_kpi_tyre_check
AS
SELECT
  s.Jobsite,
  s.EquipmentClass,
  SUM(CASE WHEN s.LastCheckDays > 3 THEN 1 ELSE 0 END) AS TotalOverdue,
  CAST(100.0 * SUM(CASE WHEN s.CheckedToday = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(1), 0) AS int) AS AchievementPI,
  CAST(100.0 * SUM(CASE WHEN s.LastCheckDays <= 3 THEN 1 ELSE 0 END) / NULLIF(COUNT(1), 0) AS int) AS AccuracyPI,
  SUM(CASE WHEN s.LastCheckDays <= 3 THEN 1 ELSE 0 END) AS UnitsWithinTarget,
  COUNT(1) AS TotalUnits,
  SUM(CASE WHEN s.CheckedToday = 1 THEN 1 ELSE 0 END) AS UnitsCheckedToday,
  SUM(CASE WHEN s.CheckedToday = 0 AND s.LastCheckDays <= 3 THEN 1 ELSE 0 END) AS UnitsNotCheckedButInRange
FROM Monitoring.vw_unit_status s
GROUP BY s.Jobsite, s.EquipmentClass;
GO
