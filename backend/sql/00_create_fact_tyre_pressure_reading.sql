/*
  Create table for tyre pressure telemetry (granularity: 1 row = 1 tyre reading event)
  Database: dwstage
*/

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'Fact')
BEGIN
  EXEC('CREATE SCHEMA Fact');
END
GO

IF OBJECT_ID('Fact.TyrePressureReading', 'U') IS NULL
BEGIN
  CREATE TABLE Fact.TyrePressureReading (
    TyrePressureReadingID BIGINT IDENTITY(1,1) NOT NULL,

    -- Optional surrogate keys (isi jika nanti sudah ada Dim.Unit / Dim.Tyre / Dim.District)
    UnitKey INT NULL,
    TyreKey INT NULL,
    DistrictKey INT NULL,

    -- Business keys / attributes (wajib)
    UnitCode VARCHAR(50) NOT NULL,
    EquipmentClass VARCHAR(50) NOT NULL,
    PlantDescription VARCHAR(100) NOT NULL,
    TyrePosition SMALLINT NOT NULL,
    TyreSerialNumber VARCHAR(100) NOT NULL,
    BrandName VARCHAR(50) NOT NULL,

    RecommendedPressurePsi DECIMAL(10,2) NOT NULL,
    PressurePsi DECIMAL(10,2) NOT NULL,
    LifetimeHours DECIMAL(18,2) NULL,
    ReadingDateTime DATETIME2(0) NOT NULL,

    SourceSystem VARCHAR(50) NOT NULL CONSTRAINT DF_TyrePressureReading_SourceSystem DEFAULT ('manual_upload'),
    SourceFileName VARCHAR(255) NULL,
    IngestedAt DATETIME2(0) NOT NULL CONSTRAINT DF_TyrePressureReading_IngestedAt DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT PK_TyrePressureReading PRIMARY KEY CLUSTERED (TyrePressureReadingID),
    CONSTRAINT CK_TyrePressureReading_TyrePosition CHECK (TyrePosition BETWEEN 1 AND 60),
    CONSTRAINT CK_TyrePressureReading_PositivePressure CHECK (RecommendedPressurePsi > 0 AND PressurePsi > 0)
  );
END
GO

-- Recommended index for dashboard filter (jobsite + equipment + latest time)
IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = 'IX_TyrePressureReading_FilterLatest'
    AND object_id = OBJECT_ID('Fact.TyrePressureReading')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_TyrePressureReading_FilterLatest
  ON Fact.TyrePressureReading (PlantDescription, EquipmentClass, ReadingDateTime DESC)
  INCLUDE (UnitCode, TyrePosition, TyreSerialNumber, PressurePsi, RecommendedPressurePsi, BrandName, LifetimeHours);
END
GO

-- Optional deduplication safeguard
IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = 'UX_TyrePressureReading_UniqueReading'
    AND object_id = OBJECT_ID('Fact.TyrePressureReading')
)
BEGIN
  CREATE UNIQUE NONCLUSTERED INDEX UX_TyrePressureReading_UniqueReading
  ON Fact.TyrePressureReading (UnitCode, TyreSerialNumber, ReadingDateTime);
END
GO

