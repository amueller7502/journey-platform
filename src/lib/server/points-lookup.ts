import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { readExperienceState } from "@/lib/server/experience-state";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type PrivatePointsResult = {
  id: string;
  displayName: string;
  points: number;
};

function privateDisplayName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return parts[0] ?? "Crew Member";
  }

  return `${parts[0]} ${parts.at(-1)?.[0] ?? ""}.`;
}

export function isPointsLookupToken(value: string) {
  return uuidPattern.test(value);
}

export async function findEmployeePointsByToken(
  token: string,
): Promise<PrivatePointsResult | null> {
  if (!isPointsLookupToken(token)) {
    return null;
  }

  if (hasSupabaseAdminEnv()) {
    const supabase = createAdminClient();
    const { data: link, error: linkError } = await supabase
      .from("employee_points_links")
      .select("employee_app_id")
      .eq("lookup_token", token)
      .maybeSingle();

    if (linkError || !link) {
      return null;
    }

    const { data, error } = await supabase
      .from("employees")
      .select("app_id, full_name, current_xp")
      .eq("app_id", link.employee_app_id)
      .eq("role", "employee")
      .eq("active", true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.app_id ?? "employee",
      displayName: privateDisplayName(data.full_name),
      points: data.current_xp ?? 0,
    };
  }

  const { state } = await readExperienceState();
  const employee = state.employees.find(
    (item) =>
      item.role === "employee" &&
      item.active !== false &&
      item.pointsLookupToken === token,
  );

  return employee
    ? {
        id: employee.id,
        displayName: privateDisplayName(employee.name),
        points: employee.miles,
      }
    : null;
}
