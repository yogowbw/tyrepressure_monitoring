import { CheckAchievement, PressureQuality, Unit } from "../types";

export interface DashboardData {
  pressureQuality: PressureQuality | null;
  checkAchievement: CheckAchievement | null;
  unitsNeedingFollowUp: Unit[];
  unitsInRange: Unit[];
  overdueUnits: Unit[];
  lastUpdate: string | null;
}

interface DashboardApiResponse {
  data: DashboardData;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function fetchDashboardData(jobsite: string, equipmentClass: string) {
  const params = new URLSearchParams({
    jobsite,
    equipmentClass,
  });

  const response = await fetch(`${API_BASE_URL}/api/dashboard/full?${params.toString()}`);
  const body = (await response.json()) as DashboardApiResponse | { message: string };

  if (!response.ok) {
    const errorMessage = "message" in body ? body.message : "Gagal memuat dashboard data";
    throw new Error(errorMessage);
  }

  return (body as DashboardApiResponse).data;
}

