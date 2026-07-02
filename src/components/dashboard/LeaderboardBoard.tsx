"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Building2, Flame, Sparkles, Trophy, Users } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { type JourneyMoment, getJourneyMoments, subscribeToJourneyMoments } from "@/lib/demo-moments";
import { recognitions } from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { formatXp, percent } from "@/lib/utils";
import type { DepartmentId } from "@/lib/types";

type LeaderboardMode = "app" | "tv";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LeaderboardBoard({ mode = "app" }: { mode?: LeaderboardMode }) {
  const { state } = useJourneyState();
  const [moments, setMoments] = useState<JourneyMoment[]>([]);
  const inverse = mode === "tv";

  useEffect(() => {
    const load = () => setMoments(getJourneyMoments());
    load();
    return subscribeToJourneyMoments(load);
  }, []);

  const crew = useMemo(
    () =>
      state.employees
        .filter((employee) => employee.role === "employee" && employee.active !== false)
        .slice()
        .sort((a, b) => b.weeklyMiles - a.weeklyMiles || b.miles - a.miles),
    [state.employees],
  );

  const departmentStandings = useMemo(
    () =>
      state.departments
        .filter((department) => department.id !== "leadership")
        .slice()
        .sort(
          (a, b) =>
            percent(b.progressMiles, b.goalMiles) - percent(a.progressMiles, a.goalMiles),
        ),
    [state.departments],
  );

  const areaStandings = useMemo(
    () =>
      state.journeyCardAreas
        .filter((area) => area.enabled)
        .map((area) => {
          const areaCrew = crew.filter((employee) => employee.journeyCardAreaId === area.id);
          const miles = areaCrew.reduce((total, employee) => total + employee.weeklyMiles, 0);
          return {
            ...area,
            miles,
            crewCount: areaCrew.length,
          };
        })
        .sort((a, b) => b.miles - a.miles),
    [crew, state.journeyCardAreas],
  );

  const recentRecognitions = useMemo(() => {
    const localMomentRows = moments.map((moment) => ({
      id: moment.id,
      employeeName: moment.employeeName,
      title: moment.recognitionTypeName,
      miles: moment.miles,
      note: moment.note,
    }));
    const seededRows = recognitions.slice(0, 8).map((recognition) => {
      const employee = state.employees.find((item) => item.id === recognition.employeeId);
      const type = state.recognitionTypes.find(
        (item) => item.id === recognition.recognitionTypeId,
      );
      return {
        id: recognition.id,
        employeeName: employee?.name ?? "Crew Member",
        title: type?.name ?? "Experience Moment",
        miles: recognition.miles,
        note: recognition.note,
      };
    });

    return [...localMomentRows, ...seededRows].slice(0, mode === "tv" ? 5 : 8);
  }, [mode, moments, state.employees, state.recognitionTypes]);

  const totalWeekXp = crew.reduce((total, employee) => total + employee.weeklyMiles, 0);
  const topCrew = crew.slice(0, mode === "tv" ? 5 : 8);
  const topDepartment = departmentStandings[0];
  const topArea = areaStandings[0];

  return (
    <div className={cx("grid gap-5", inverse && "text-journey-white")}>
      <div
        className={cx(
          "grid gap-4",
          mode === "tv" ? "xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4",
        )}
      >
        <LeaderboardStat
          inverse={inverse}
          icon={Trophy}
          label="Weekly XP"
          value={formatXp(totalWeekXp)}
          detail="recognized this week"
        />
        <LeaderboardStat
          inverse={inverse}
          icon={Award}
          label="Top Crew"
          value={topCrew[0]?.name ?? "None yet"}
          detail={`${topCrew[0]?.weeklyMiles ?? 0} weekly XP`}
        />
        <LeaderboardStat
          inverse={inverse}
          icon={Building2}
          label="Top Department"
          value={topDepartment?.name ?? "None yet"}
          detail={`${topDepartment ? percent(topDepartment.progressMiles, topDepartment.goalMiles) : 0}% to goal`}
        />
        <LeaderboardStat
          inverse={inverse}
          icon={Users}
          label="Top Card Area"
          value={topArea?.name ?? "None yet"}
          detail={`${topArea?.crewCount ?? 0} active crew`}
        />
      </div>

      <div
        className={cx(
          "grid gap-5",
          mode === "tv" ? "xl:grid-cols-[1fr_0.85fr]" : "xl:grid-cols-[0.85fr_1.15fr]",
        )}
      >
        <section
          className={cx(
            "rounded-lg border p-5",
            inverse
              ? "border-journey-steel bg-journey-coal"
              : "border-journey-line bg-journey-white shadow-line",
          )}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-journey-red">
                Experience Leaderboard
              </p>
              <h3
                className={cx(
                  "mt-1 font-black",
                  mode === "tv" ? "text-4xl" : "text-2xl text-journey-black",
                )}
              >
                Weekly Crew Standings
              </h3>
            </div>
            <Flame className="h-6 w-6 text-journey-red" aria-hidden="true" />
          </div>
          <div className="grid gap-3">
            {topCrew.map((employee, index) => (
              <div
                key={employee.id}
                className={cx(
                  "grid items-center gap-3 rounded-lg border p-3",
                  mode === "tv"
                    ? "grid-cols-[64px_1fr_130px] border-journey-steel bg-journey-black/45"
                    : "grid-cols-[44px_1fr_100px] border-journey-line",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-journey-red text-sm font-black text-journey-white">
                  #{index + 1}
                </div>
                <div>
                  <p
                    className={cx(
                      "font-black",
                      mode === "tv" ? "text-2xl text-journey-white" : "text-journey-black",
                    )}
                  >
                    {employee.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-journey-steel">
                    {employee.title}
                  </p>
                </div>
                <p
                  className={cx(
                    "text-right font-black text-journey-red",
                    mode === "tv" ? "text-3xl" : "text-xl",
                  )}
                >
                  {employee.weeklyMiles} XP
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={cx(
            "rounded-lg border p-5",
            inverse
              ? "border-journey-steel bg-journey-coal"
              : "border-journey-line bg-journey-white shadow-line",
          )}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-journey-red">
                Team Progress
              </p>
              <h3
                className={cx(
                  "mt-1 font-black",
                  mode === "tv" ? "text-4xl" : "text-2xl text-journey-black",
                )}
              >
                Departments and Card Areas
              </h3>
            </div>
            <Sparkles className="h-6 w-6 text-journey-red" aria-hidden="true" />
          </div>
          <div className="grid gap-4">
            {departmentStandings.slice(0, mode === "tv" ? 4 : 6).map((department) => (
              <ProgressBar
                key={department.id}
                label={department.name}
                value={department.progressMiles}
                max={department.goalMiles}
                inverse={inverse}
              />
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            {areaStandings.slice(0, 4).map((area) => (
              <div
                key={area.id}
                className={cx(
                  "flex items-center justify-between gap-4 rounded-md border px-3 py-2",
                  inverse ? "border-journey-steel" : "border-journey-line",
                )}
              >
                <span className="font-black">{area.name}</span>
                <span className="text-sm font-black text-journey-red">
                  {area.miles} weekly XP
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {mode === "app" ? (
        <section className="rounded-lg border border-journey-line bg-journey-white p-5 shadow-line">
          <div className="mb-4">
            <p className="text-xs font-black uppercase text-journey-red">
              Recognition Wall
            </p>
            <h3 className="mt-1 text-2xl font-black text-journey-black">
              Recent moments behind the standings
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {recentRecognitions.map((recognition) => (
              <article
                key={recognition.id}
                className="rounded-lg border border-journey-line p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-journey-black">
                      {recognition.employeeName}
                    </p>
                    <p className="mt-1 text-sm font-bold text-journey-red">
                      {recognition.title}
                    </p>
                  </div>
                  <p className="font-black text-journey-red">+{recognition.miles} XP</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-journey-steel">
                  {recognition.note}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function LeaderboardStat({
  inverse,
  icon: Icon,
  label,
  value,
  detail,
}: {
  inverse: boolean;
  icon: typeof Trophy;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div
      className={cx(
        "rounded-lg border p-4",
        inverse
          ? "border-journey-steel bg-journey-coal"
          : "border-journey-line bg-journey-white shadow-line",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-journey-red">{label}</p>
        <Icon className="h-5 w-5 text-journey-red" aria-hidden="true" />
      </div>
      <p
        className={cx(
          "mt-3 font-black",
          inverse ? "text-4xl text-journey-white" : "text-2xl text-journey-black",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm font-bold text-journey-steel">{detail}</p>
    </div>
  );
}
