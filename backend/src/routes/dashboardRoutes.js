import { Router } from "express";
import { appConfig } from "../config.js";
import { buildDashboardData, listEquipmentClasses } from "../services/dashboardService.js";

const router = Router();

function parseFilters(req, res) {
  const { jobsite, equipmentClass } = req.query;

  if (!jobsite) {
    res.status(400).json({
      message: "Query parameter 'jobsite' wajib diisi.",
    });
    return null;
  }

  if (!appConfig.allowedJobsites.includes(jobsite)) {
    res.status(400).json({
      message: `Jobsite tidak valid. Gunakan salah satu: ${appConfig.allowedJobsites.join(", ")}`,
    });
    return null;
  }

  return {
    jobsite,
    equipmentClass: equipmentClass || null,
  };
}

router.get("/jobsites", async (req, res, next) => {
  try {
    const data = await Promise.all(
      appConfig.allowedJobsites.map(async (jobsite) => {
        const equipmentClasses = await listEquipmentClasses(jobsite);
        return { jobsite, equipmentClasses };
      })
    );

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard/full", async (req, res, next) => {
  const filters = parseFilters(req, res);
  if (!filters) return;

  try {
    const data = await buildDashboardData(filters.jobsite, filters.equipmentClass);
    res.json({
      filters,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard/pressure-quality", async (req, res, next) => {
  const filters = parseFilters(req, res);
  if (!filters) return;

  try {
    const data = await buildDashboardData(filters.jobsite, filters.equipmentClass);
    res.json({ filters, data: data.pressureQuality });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard/check-achievement", async (req, res, next) => {
  const filters = parseFilters(req, res);
  if (!filters) return;

  try {
    const data = await buildDashboardData(filters.jobsite, filters.equipmentClass);
    res.json({ filters, data: data.checkAchievement });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard/units", async (req, res, next) => {
  const filters = parseFilters(req, res);
  if (!filters) return;

  const view = req.query.view === "in-range" ? "in-range" : "follow-up";

  try {
    const data = await buildDashboardData(filters.jobsite, filters.equipmentClass);
    const selected = view === "in-range" ? data.unitsInRange : data.unitsNeedingFollowUp;
    res.json({ filters: { ...filters, view }, data: selected });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard/overdue", async (req, res, next) => {
  const filters = parseFilters(req, res);
  if (!filters) return;

  try {
    const data = await buildDashboardData(filters.jobsite, filters.equipmentClass);
    res.json({ filters, data: data.overdueUnits });
  } catch (error) {
    next(error);
  }
});

export { router as dashboardRoutes };

