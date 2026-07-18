import { crewLeaderboardRows } from "@/lib/server/leaderboard";
import { readExperienceState } from "@/lib/server/experience-state";
import { createSimpleXlsx } from "@/lib/server/simple-xlsx";

export async function GET() {
  const { state } = await readExperienceState();
  const rows = crewLeaderboardRows(state);
  const generated = new Date();
  const workbook = createSimpleXlsx({
    title: "The Odyssey Crew Leaderboard",
    sheetName: "Leaderboard",
    generatedAt: generated.toLocaleString("en-US", { timeZone: "America/Detroit" }),
    headers: [
      "Rank",
      "Crew Member",
      "Lifetime Earned",
      "Pending",
      "Redeemed",
      "Available",
    ],
    rows: rows.map((row) => [
      row.rank,
      row.name,
      row.earned,
      row.pending,
      row.redeemed,
      row.available,
    ]),
  });
  const date = generated.toISOString().slice(0, 10);

  return new Response(new Uint8Array(workbook), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="odyssey-crew-leaderboard-${date}.xlsx"`,
      "cache-control": "no-store",
    },
  });
}
