/*
  Optional loader for CSV mockup into Fact.TyrePressureReading.
  Adjust file path according to your SQL Server access path.
*/

BULK INSERT Fact.TyrePressureReading
FROM 'D:\Activity\32 Tyre Command Center\Tyre Pressure Monitoring\backend\sql\mockdata\fact_tyre_pressure_reading_mock.csv'
WITH (
  FIRSTROW = 2,
  FIELDTERMINATOR = ',',
  ROWTERMINATOR = '0x0a',
  TABLOCK,
  CODEPAGE = '65001',
  KEEPNULLS
);
GO

