import { Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LeaderboardBoard } from "@/components/dashboard/LeaderboardBoard";
import { Panel, PanelHeader } from "@/components/ui/Panel";

export default function ManagerLeaderboardPage() {
  return (
    <AppShell role="manager" title="Leaderboard" eyebrow="Recognition Standings">
      <Panel>
        <PanelHeader
          title="Journey Leaderboard"
          eyebrow="Weekly recognition"
          action={<Trophy className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <LeaderboardBoard />
      </Panel>
    </AppShell>
  );
}
