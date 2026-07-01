import { departments } from "@/lib/data";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function DepartmentProgress({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="space-y-4">
      {departments.map((department) => (
        <ProgressBar
          key={department.id}
          label={department.name}
          value={department.progressMiles}
          max={department.goalMiles}
          inverse={inverse}
        />
      ))}
    </div>
  );
}
