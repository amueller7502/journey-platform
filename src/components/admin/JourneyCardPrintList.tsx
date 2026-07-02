"use client";

import { useRouter } from "next/navigation";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { CalendarDays, ClipboardCheck, FileDown, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog, type ConfirmDialogState } from "@/components/ui/ConfirmDialog";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { StatusToast, type StatusToastState } from "@/components/ui/StatusToast";
import { isArchived } from "@/lib/archive";
import { useJourneyState } from "@/lib/journey-state";
import type {
  Employee,
  ExperienceSeason,
  JourneyCardArea,
  JourneyCardShiftAssignment,
  RecognitionType,
} from "@/lib/types";
import { formatXp } from "@/lib/utils";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function sortAreas(a: JourneyCardArea, b: JourneyCardArea) {
  return a.sortOrder - b.sortOrder;
}

function sortTasks(a: RecognitionType, b: RecognitionType) {
  return a.sortOrder - b.sortOrder;
}

const pageWidth = 612;
const pageHeight = 792;
const margin = 36;
const gutter = 18;
const cardWidth = pageWidth - margin * 2;
const cardHeight = (pageHeight - margin * 2 - gutter) / 2;
const black = rgb(0.02, 0.02, 0.02);
const red = rgb(0.843, 0.098, 0.125);
const gray = rgb(0.28, 0.28, 0.28);
const lightGray = rgb(0.93, 0.93, 0.93);
const white = rgb(1, 1, 1);

function fileDate(value: string) {
  return value.replace(/[^0-9]/g, "") || todayString().replace(/[^0-9]/g, "");
}

function wrapText(text: string, maxWidth: number, font: { widthOfTextAtSize: (text: string, size: number) => number }, size: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      return;
    }

    if (current) {
      lines.push(current);
    }
    current = word;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}

function drawCropMarks(
  page: ReturnType<PDFDocument["addPage"]>,
  x: number,
  y: number,
) {
  const length = 10;
  const offset = 6;
  const thickness = 0.45;
  const marks: Array<[{ x: number; y: number }, { x: number; y: number }]> = [
    [
      { x: x - offset - length, y: y + cardHeight },
      { x: x - offset, y: y + cardHeight },
    ],
    [
      { x, y: y + cardHeight + offset },
      { x, y: y + cardHeight + offset + length },
    ],
    [
      { x: x + cardWidth + offset, y: y + cardHeight },
      { x: x + cardWidth + offset + length, y: y + cardHeight },
    ],
    [
      { x: x + cardWidth, y: y + cardHeight + offset },
      { x: x + cardWidth, y: y + cardHeight + offset + length },
    ],
    [
      { x: x - offset - length, y },
      { x: x - offset, y },
    ],
    [
      { x, y: y - offset },
      { x, y: y - offset - length },
    ],
    [
      { x: x + cardWidth + offset, y },
      { x: x + cardWidth + offset + length, y },
    ],
    [
      { x: x + cardWidth, y: y - offset },
      { x: x + cardWidth, y: y - offset - length },
    ],
  ];

  marks.forEach(([start, end]) => {
    page.drawLine({
      start,
      end,
      thickness,
      color: gray,
    });
  });
}

async function drawExperienceCard({
  page,
  x,
  y,
  assignment,
  employee,
  area,
  tasks,
  season,
  shiftDate,
  fonts,
}: {
  page: ReturnType<PDFDocument["addPage"]>;
  x: number;
  y: number;
  assignment: JourneyCardShiftAssignment;
  employee?: Employee;
  area?: JourneyCardArea;
  tasks: RecognitionType[];
  season?: ExperienceSeason;
  shiftDate: string;
  fonts: {
    regular: Awaited<ReturnType<PDFDocument["embedFont"]>>;
    bold: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  };
}) {
  const entryPath = `/manager/passport/${encodeURIComponent(
    employee?.passportId ?? "card-id",
  )}?area=${encodeURIComponent(assignment.journeyCardAreaId)}`;

  drawCropMarks(page, x, y);
  page.drawRectangle({
    x,
    y,
    width: cardWidth,
    height: cardHeight,
    color: white,
    borderColor: black,
    borderWidth: 1.5,
  });
  page.drawLine({
    start: { x: margin - 12, y: y + cardHeight + gutter / 2 },
    end: { x: pageWidth - margin + 12, y: y + cardHeight + gutter / 2 },
    thickness: 0.5,
    color: gray,
    dashArray: [4, 4],
  });
  page.drawRectangle({
    x,
    y: y + cardHeight - 52,
    width: cardWidth,
    height: 52,
    color: black,
  });
  page.drawRectangle({
    x,
    y: y + cardHeight - 55,
    width: cardWidth,
    height: 3,
    color: red,
  });

  const employeeName = employee?.name ?? "Crew Member";
  const areaName = area?.name ?? "Experience Card";
  const seasonTitle = season?.seasonTitle ?? "The Odyssey";

  page.drawText("EXPERIENCE CARD", {
    x: x + 18,
    y: y + cardHeight - 25,
    size: 8,
    font: fonts.bold,
    color: red,
  });
  page.drawText("More Than A Movie Starts With Us", {
    x: x + 18,
    y: y + cardHeight - 43,
    size: 17,
    font: fonts.bold,
    color: white,
  });
  page.drawText(seasonTitle.toUpperCase(), {
    x: x + cardWidth - 178,
    y: y + cardHeight - 28,
    size: 8,
    font: fonts.bold,
    color: lightGray,
  });

  const infoTop = y + cardHeight - 82;
  page.drawText(employeeName, {
    x: x + 18,
    y: infoTop,
    size: 20,
    font: fonts.bold,
    color: black,
  });
  page.drawText(`${employee?.title ?? "Employee"} / ${areaName}`, {
    x: x + 18,
    y: infoTop - 17,
    size: 9,
    font: fonts.bold,
    color: gray,
  });
  page.drawText(`Shift Date: ${shiftDate}`, {
    x: x + 18,
    y: infoTop - 32,
    size: 8.5,
    font: fonts.regular,
    color: gray,
  });
  page.drawText(`Experience Card ID: ${employee?.passportId ?? "Unassigned"}`, {
    x: x + 18,
    y: infoTop - 45,
    size: 8.5,
    font: fonts.bold,
    color: black,
  });
  page.drawText(`Manager Entry: ${entryPath}`, {
    x: x + 18,
    y: infoTop - 58,
    size: 7,
    font: fonts.regular,
    color: gray,
  });
  page.drawText("Today's Focus Area", {
    x: x + cardWidth - 188,
    y: infoTop,
    size: 8,
    font: fonts.bold,
    color: red,
  });
  wrapText(area?.description ?? areaName, 96, fonts.regular, 8.2)
    .slice(0, 3)
    .forEach((line, index) => {
      page.drawText(line, {
        x: x + cardWidth - 188,
        y: infoTop - 14 - index * 11,
        size: 8.2,
        font: fonts.regular,
        color: gray,
      });
    });

  page.drawRectangle({
    x: x + cardWidth - 86,
    y: infoTop - 52,
    width: 70,
    height: 42,
    borderColor: lightGray,
    borderWidth: 0.8,
  });
  page.drawText("Turn in to", {
    x: x + cardWidth - 78,
    y: infoTop - 24,
    size: 7.5,
    font: fonts.bold,
    color: red,
  });
  page.drawText("manager", {
    x: x + cardWidth - 78,
    y: infoTop - 36,
    size: 9,
    font: fonts.bold,
    color: black,
  });
  page.drawText("Use ID/link", {
    x: x + cardWidth - 78,
    y: infoTop - 48,
    size: 6.6,
    font: fonts.regular,
    color: gray,
  });

  const listTop = infoTop - 76;
  const rowHeight = Math.min(24, Math.max(17, 156 / Math.max(tasks.length, 1)));
  tasks.slice(0, 8).forEach((task, index) => {
    const rowY = listTop - index * rowHeight;
    page.drawRectangle({
      x: x + 18,
      y: rowY - rowHeight + 3,
      width: cardWidth - 36,
      height: rowHeight,
      borderColor: lightGray,
      borderWidth: 0.6,
    });
    page.drawRectangle({
      x: x + 26,
      y: rowY - 12,
      width: 9,
      height: 9,
      borderColor: black,
      borderWidth: 1,
    });
    page.drawText(task.name, {
      x: x + 42,
      y: rowY - 9,
      size: 8.5,
      font: fonts.bold,
      color: black,
    });
    page.drawText(`+${task.milesValue} XP`, {
      x: x + cardWidth - 72,
      y: rowY - 9,
      size: 8,
      font: fonts.bold,
      color: red,
    });
    const description = wrapText(task.description, cardWidth - 160, fonts.regular, 6.8)[0];
    if (description) {
      page.drawText(description, {
        x: x + 42,
        y: rowY - 19,
        size: 6.8,
        font: fonts.regular,
        color: gray,
      });
    }
  });

  const footerY = y + 18;
  page.drawText("Employee initials", { x: x + 18, y: footerY + 14, size: 7.5, font: fonts.bold, color: gray });
  page.drawLine({ start: { x: x + 18, y: footerY + 8 }, end: { x: x + 150, y: footerY + 8 }, thickness: 0.7, color: black });
  page.drawText("Manager initials", { x: x + 190, y: footerY + 14, size: 7.5, font: fonts.bold, color: gray });
  page.drawLine({ start: { x: x + 190, y: footerY + 8 }, end: { x: x + 322, y: footerY + 8 }, thickness: 0.7, color: black });
  page.drawText("Entered in Experience", { x: x + 362, y: footerY + 14, size: 7.5, font: fonts.bold, color: gray });
  page.drawLine({ start: { x: x + 362, y: footerY + 8 }, end: { x: x + 494, y: footerY + 8 }, thickness: 0.7, color: black });
}

export function JourneyCardPrintList() {
  const router = useRouter();
  const { state, updateState } = useJourneyState();
  const areas = useMemo(
    () =>
      state.journeyCardAreas
        .filter((area) => area.enabled && !isArchived(area))
        .slice()
        .sort(sortAreas),
    [state.journeyCardAreas],
  );
  const activeCrew = state.employees
    .filter((employee) => employee.role === "employee" && employee.active !== false)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const [shiftDate, setShiftDate] = useState(todayString());
  const [areaId, setAreaId] = useState(areas[0]?.id ?? "");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<StatusToastState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const assignments = state.journeyCardAssignments
    .filter((assignment) => assignment.shiftDate === shiftDate)
    .slice()
    .sort((a, b) => {
      const employeeA = state.employees.find((employee) => employee.id === a.employeeId);
      const employeeB = state.employees.find((employee) => employee.id === b.employeeId);
      return (employeeA?.name ?? "").localeCompare(employeeB?.name ?? "");
    });

  const selectedArea = areas.find((area) => area.id === areaId) ?? areas[0];

  function tasksForArea(currentAreaId: string) {
    return state.recognitionTypes
      .filter((type) => {
        if (!type.enabled || isArchived(type) || !type.journeyCardEligible) {
          return false;
        }

        return (
          !type.journeyCardAreaIds?.length ||
          type.journeyCardAreaIds.includes(currentAreaId)
        );
      })
      .slice()
      .sort(sortTasks);
  }

  function assignmentLabel(assignment: JourneyCardShiftAssignment) {
    const employee = state.employees.find((item) => item.id === assignment.employeeId);
    const area = areas.find((item) => item.id === assignment.journeyCardAreaId);
    return `${employee?.name ?? "Crew Member"} - ${area?.name ?? "Experience Card"}`;
  }

  function toggleEmployee(employeeId: string) {
    setSelectedEmployees((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    );
  }

  function assignCards() {
    if (!selectedArea || !selectedEmployees.length) {
      setMessage("Choose a card type and at least one employee.");
      return;
    }

    const now = new Date().toISOString();
    updateState((current) => {
      const existingKeys = new Set(
        current.journeyCardAssignments.map(
          (assignment) =>
            `${assignment.shiftDate}:${assignment.employeeId}:${assignment.journeyCardAreaId}`,
        ),
      );
      const nextAssignments = selectedEmployees
        .filter((employeeId) => !existingKeys.has(`${shiftDate}:${employeeId}:${selectedArea.id}`))
        .map((employeeId) => ({
          id: `shift-card-${shiftDate}-${employeeId}-${selectedArea.id}-${Date.now()}`,
          employeeId,
          journeyCardAreaId: selectedArea.id,
          shiftDate,
          createdAt: now,
        }));

      return {
        ...current,
        journeyCardAssignments: [
          ...current.journeyCardAssignments,
          ...nextAssignments,
        ],
      };
    });
    setMessage(
      `Created ${selectedEmployees.length} ${selectedArea.name} card assignment${
        selectedEmployees.length === 1 ? "" : "s"
      } for ${shiftDate}.`,
    );
  }

  function removeAssignment(id: string) {
    const assignment = state.journeyCardAssignments.find((item) => item.id === id);
    if (!assignment) {
      setToast({ tone: "error", message: "That card assignment could not be found." });
      return;
    }

    setConfirmDialog({
      title: "Remove this print-run card?",
      destructive: true,
      confirmLabel: "Remove Card",
      body: (
        <p>
          This only removes the draft card from today&apos;s print run. It does not
          change employee XP or historical Experience Moments.
        </p>
      ),
      onConfirm: () => {
        try {
          updateState((current) => ({
            ...current,
            journeyCardAssignments: current.journeyCardAssignments.filter(
              (item) => item.id !== id,
            ),
          }));
          setToast({ tone: "success", message: "Card removed from the print run." });
        } catch (error) {
          setToast({
            tone: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to remove that print-run card.",
          });
        }
      },
    });
  }

  async function generatePdf() {
    if (!assignments.length) {
      setMessage("Create at least one Experience Card before generating a PDF.");
      return;
    }

    setIsGeneratingPdf(true);
    setMessage("Building printable PDF...");
    const pdfDoc = await PDFDocument.create();
    const fonts = {
      regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
      bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    };
    const activeSeason = state.seasons.find((season) => season.active);

    for (let index = 0; index < assignments.length; index += 1) {
      const pageIndex = Math.floor(index / 2);
      const cardIndex = index % 2;
      const page =
        cardIndex === 0 ? pdfDoc.addPage([pageWidth, pageHeight]) : pdfDoc.getPage(pageIndex);
      const assignment = assignments[index];
      const employee = state.employees.find((item) => item.id === assignment.employeeId);
      const area = areas.find((item) => item.id === assignment.journeyCardAreaId);
      const tasks = tasksForArea(assignment.journeyCardAreaId);
      const cardY =
        cardIndex === 0
          ? pageHeight - margin - cardHeight
          : margin;

      await drawExperienceCard({
        page,
        x: margin,
        y: cardY,
        assignment,
        employee,
        area,
        tasks,
        season: activeSeason,
        shiftDate,
        fonts,
      });
    }

    const bytes = await pdfDoc.save();
    const pdfBuffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(pdfBuffer).set(bytes);
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `experience-card-print-run-${fileDate(shiftDate)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    const now = new Date().toISOString();
    updateState((current) => ({
      ...current,
      journeyCardAssignments: current.journeyCardAssignments.map((assignment) =>
        assignment.shiftDate === shiftDate
          ? {
              ...assignment,
              printedAt: now,
            }
          : assignment,
      ),
    }));
    setMessage(`Generated ${assignments.length} Experience Card${assignments.length === 1 ? "" : "s"} for ${shiftDate}.`);
    setIsGeneratingPdf(false);
  }

  function openManagerEntry(assignment: JourneyCardShiftAssignment) {
    const employee = state.employees.find((item) => item.id === assignment.employeeId);
    if (!employee) {
      return;
    }

    router.push(
      `/manager/passport/${encodeURIComponent(employee.passportId)}?area=${encodeURIComponent(
        assignment.journeyCardAreaId,
      )}`,
    );
  }

  return (
    <>
      <Panel className="mt-5">
        <PanelHeader
          title="Daily Experience Card Print Run"
          eyebrow="Shift checklist planner"
          action={
            <Button
              type="button"
              icon={FileDown}
              variant="secondary"
              onClick={() => void generatePdf()}
              disabled={!assignments.length || isGeneratingPdf}
            >
              {isGeneratingPdf ? "Generating PDF" : "Generate PDF"}
            </Button>
          }
        />
        <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-lg border border-journey-line bg-journey-mist p-4">
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Shift Date
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(event) => setShiftDate(event.target.value)}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Experience Card Type
                <select
                  value={areaId}
                  onChange={(event) => setAreaId(event.target.value)}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                >
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-black text-journey-black">
                {selectedEmployees.length} selected
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  icon={Users}
                  onClick={() => setSelectedEmployees(activeCrew.map((employee) => employee.id))}
                >
                  Select All
                </Button>
                <Button type="button" icon={ClipboardCheck} onClick={assignCards}>
                  Create Cards
                </Button>
              </div>
            </div>

            {message ? (
              <p className="mt-3 rounded-md border border-journey-line bg-journey-white p-3 text-sm font-black text-journey-red">
                {message}
              </p>
            ) : null}
            <div className="mt-3">
              <StatusToast toast={toast} />
            </div>

            <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pr-1">
              {activeCrew.map((employee) => (
                <label
                  key={employee.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-journey-line bg-journey-white p-3 text-sm font-bold text-journey-black"
                >
                  <span>
                    <span className="block font-black">{employee.name}</span>
                    <span className="text-xs text-journey-steel">
                      {employee.title} / {employee.shift}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => toggleEmployee(employee.id)}
                    className="h-5 w-5 accent-journey-red"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-journey-line bg-journey-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-journey-red">
                  Cards for {shiftDate}
                </p>
                <h3 className="mt-1 text-xl font-black text-journey-black">
                  {assignments.length} printable shift cards
                </h3>
              </div>
              <CalendarDays className="h-5 w-5 text-journey-red" aria-hidden="true" />
            </div>
            <div className="mt-4 grid gap-3">
              {!assignments.length ? (
                <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
                  Select employees, choose the card type they are scheduled for today,
                  then create cards.
                </p>
              ) : null}
              {assignments.map((assignment) => {
                const tasks = tasksForArea(assignment.journeyCardAreaId);
                return (
                  <div
                    key={assignment.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line p-3"
                  >
                    <div>
                      <p className="font-black text-journey-black">
                        {assignmentLabel(assignment)}
                      </p>
                      <p className="mt-1 text-sm font-bold text-journey-steel">
                        {tasks.length} checklist items /{" "}
                        {formatXp(tasks.reduce((total, task) => total + task.milesValue, 0))} XP
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        icon={ClipboardCheck}
                        onClick={() => openManagerEntry(assignment)}
                      >
                        Enter
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        icon={Trash2}
                        onClick={() => removeAssignment(assignment.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Export Preview" eyebrow="Copy-ready rows" />
        <pre className="overflow-x-auto rounded-lg bg-journey-black p-4 text-xs font-bold text-journey-white">
{`shift_date,employee,experience_card_id,card_type,possible_xp
${assignments
  .map((assignment) => {
    const employee = state.employees.find((item) => item.id === assignment.employeeId);
    const area = areas.find((item) => item.id === assignment.journeyCardAreaId);
    const possibleMiles = tasksForArea(assignment.journeyCardAreaId).reduce(
      (total, task) => total + task.milesValue,
      0,
    );

    return [
      assignment.shiftDate,
      employee?.name ?? "",
      employee?.passportId ?? "",
      area?.name ?? "",
      possibleMiles,
    ].join(",");
  })
  .join("\n")}`}
        </pre>
      </Panel>
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </>
  );
}
