"use client";

import { readSheet, type Row } from "read-excel-file/browser";
import { FileUp, Info, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildJourneyCardUrl,
  makeInitials,
  nextJourneyCardId,
  useJourneyState,
} from "@/lib/journey-state";
import type { DepartmentId, Employee, Role } from "@/lib/types";

const requiredHeader =
  "name,email,role,department,title,shift,journey_card_area,access_code,account_status";

type ImportRow = Record<string, string>;

function splitDelimitedLine(line: string, delimiter: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function normalizeRole(value: string): Role {
  if (value === "manager" || value === "admin") {
    return value;
  }

  return "employee";
}

export function EmployeeImportTool() {
  const { state, updateState } = useJourneyState();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  function departmentIdFor(value: string): DepartmentId {
    const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    return (
      state.departments.find(
        (department) =>
          department.id === slug || department.name.toLowerCase() === value.trim().toLowerCase(),
      )?.id ?? "floor"
    );
  }

  function cardAreaFor(value: string, departmentId: DepartmentId) {
    const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    return (
      state.journeyCardAreas.find(
        (area) =>
          area.id === slug || area.name.toLowerCase() === value.trim().toLowerCase(),
      )?.id ??
      state.journeyCardAreas.find((area) => area.departmentIds.includes(departmentId))?.id ??
      state.journeyCardAreas[0]?.id
    );
  }

  function importRows(rows: ImportRow[]) {
    if (!rows.length) {
      setMessage("No rows found. Use the sample header plus at least one employee row.");
      return;
    }

    const importedCount = rows.filter((row) => String(row.name ?? "").trim()).length;
    if (!importedCount) {
      setMessage("No named employees found in the file.");
      return;
    }

    updateState((current) => {
      const nextEmployees = [...current.employees];

      rows.forEach((row, index) => {
        const name = String(row.name ?? "").trim();
        if (!name) {
          return;
        }

        const department = departmentIdFor(String(row.department ?? ""));
        const passportId = nextJourneyCardId(nextEmployees);
        const role = normalizeRole(String(row.role ?? "employee").toLowerCase());
        const accountStatus =
          String(row.account_status ?? "invited").toLowerCase() === "active"
            ? "active"
            : String(row.account_status ?? "").toLowerCase() === "disabled"
              ? "disabled"
              : "invited";
        const areaId = cardAreaFor(String(row.journey_card_area ?? ""), department);
        const initials = makeInitials(name);
        const employee: Employee = {
          id: `emp-import-${Date.now()}-${index}`,
          name,
          email: String(row.email ?? "").trim() || undefined,
          role,
          department,
          title: String(row.title ?? "").trim() || "Crew Member",
          initials,
          passportId,
          passportQrUrl: buildJourneyCardUrl(passportId),
          journeyCardAreaId: areaId,
          accessCode:
            String(row.access_code ?? "").trim() ||
            `${initials}${String(1570 + index).slice(-4)}`,
          accountStatus,
          active: accountStatus !== "disabled",
          miles: 0,
          weeklyMiles: 0,
          reliabilityStreak: 0,
          shift: String(row.shift ?? "").trim() || "Unassigned",
        };

        nextEmployees.push(employee);
      });

      return {
        ...current,
        employees: nextEmployees,
      };
    });

    setMessage(`Imported ${importedCount} account rows.`);
  }

  function importText(text: string) {
    const lines = text
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      setMessage("No rows found. Use the sample header plus at least one employee row.");
      return;
    }

    const delimiter = lines[0].includes("\t") ? "\t" : ",";
    const headers = splitDelimitedLine(lines[0], delimiter).map((header) =>
      header.toLowerCase().trim(),
    );

    const rows = lines.slice(1).map((line) => {
      const values = splitDelimitedLine(line, delimiter);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    });

    importRows(rows);
  }

  async function importSpreadsheet(file: File) {
    const matrix: Row[] = await readSheet(file);
    const headers =
      matrix[0]?.map((value) => String(value).toLowerCase().trim()) ?? [];
    const rows = matrix.slice(1).map((row) =>
      Object.fromEntries(
        headers.map((header, index) => [header, String(row[index] ?? "")]),
      ),
    );

    importRows(rows);
  }

  async function importFile(file: File) {
    if (/\.xlsx$/i.test(file.name)) {
      await importSpreadsheet(file);
      return;
    }

    importText(await file.text());
  }

  return (
    <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-journey-red">
            Bulk Account Import
          </p>
          <h3 className="mt-1 text-lg font-black text-journey-black">
            Import Excel (.xlsx), CSV, or tab-delimited rows.
          </h3>
          <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
            Format: <span className="font-mono">{requiredHeader}</span>
          </p>
        </div>
        <Button
          type="button"
          icon={FileUp}
          variant="secondary"
          onClick={() => fileRef.current?.click()}
        >
          Choose File
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.csv,.tsv,.txt,text/csv,text/tab-separated-values"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          void importFile(file).catch(() =>
            setMessage("Import failed. Check for an Excel .xlsx, CSV, or TSV file with the required header row."),
          );
          event.currentTarget.value = "";
        }}
      />
      <div className="mt-3 flex items-start gap-2 rounded-md border border-journey-line bg-journey-white p-3">
        <Info className="mt-0.5 h-4 w-4 text-journey-red" aria-hidden="true" />
        <p className="text-xs font-bold leading-5 text-journey-steel">
          Excel files should use the same first-row headers. Only named rows are imported,
          and Experience Card IDs are generated automatically.
        </p>
      </div>
      {message ? (
        <p className="mt-3 text-sm font-black text-journey-red">{message}</p>
      ) : null}
      <Button
        type="button"
        icon={Plus}
        variant="ghost"
        className="mt-2"
        onClick={() =>
          importText(`${requiredHeader}
Taylor Morgan,taylor.morgan@north.example,employee,floor,Floor Crew,Nights,floor_lobby,TM1570,invited`)
        }
      >
        Add Sample Row
      </Button>
    </div>
  );
}
