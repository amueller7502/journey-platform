"use client";

import { readSheet, type Row } from "read-excel-file/browser";
import { FileSpreadsheet, LoaderCircle, Plus, Save, Trash2, Users } from "lucide-react";
import { useRef, useState } from "react";
import type {
  ManagerConsolePerson,
  ManagerRosterInput,
} from "@/lib/manager-console-types";

type PeopleStatus =
  | { kind: "idle" }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

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

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function importRowsFromMatrix(matrix: Row[]): ManagerRosterInput[] {
  if (!matrix.length) {
    return [];
  }

  const headers = matrix[0].map(normalizeHeader);
  const recognizedHeaders = new Set([
    "name",
    "employee_name",
    "full_name",
    "first_name",
    "last_name",
    "role",
    "title",
    "email",
  ]);
  const hasHeader = headers.some((header) => recognizedHeaders.has(header));
  const dataRows = hasHeader ? matrix.slice(1) : matrix;

  if (!hasHeader) {
    return dataRows
      .map((row) => ({ name: String(row[0] ?? "").trim(), role: "employee" as const }))
      .filter((row) => row.name);
  }

  return dataRows
    .map((row) => {
      const record = Object.fromEntries(
        headers.map((header, index) => [header, String(row[index] ?? "").trim()]),
      );
      const name =
        record.name ||
        record.employee_name ||
        record.full_name ||
        `${record.first_name ?? ""} ${record.last_name ?? ""}`.trim();

      return {
        name,
        role: String(record.role ?? "").toLowerCase() === "manager" ? "manager" : "employee",
        title: record.title,
        email: record.email,
      } satisfies ManagerRosterInput;
    })
    .filter((row) => row.name);
}

function PersonEditor({
  person,
  disabled,
  onSave,
  onArchive,
}: {
  person: ManagerConsolePerson;
  disabled: boolean;
  onSave: (person: ManagerRosterInput) => Promise<void>;
  onArchive: (person: ManagerConsolePerson) => Promise<void>;
}) {
  const [name, setName] = useState(person.name);
  const [role, setRole] = useState<"employee" | "manager">(
    person.role === "employee" ? "employee" : "manager",
  );

  return (
    <div className="grid gap-3 rounded-lg border border-[#ded2a7] bg-white p-4 sm:grid-cols-[1.5fr_.8fr_auto] sm:items-end">
      <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#8b712f]">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={person.role === "admin"}
          className="min-h-11 rounded-md border border-[#d4c27e] px-3 text-sm font-bold normal-case tracking-normal text-[#102631] disabled:bg-[#f0ecdf]"
        />
      </label>
      <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#8b712f]">
        Role
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as "employee" | "manager")}
          disabled={person.role === "admin"}
          className="min-h-11 rounded-md border border-[#d4c27e] px-3 text-sm font-bold normal-case tracking-normal text-[#102631] disabled:bg-[#f0ecdf]"
        >
          <option value="employee">Crew Member</option>
          <option value="manager">Manager</option>
        </select>
      </label>
      {person.role === "admin" ? (
        <span className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#102631] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#f3d878]">
          Builder
        </span>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={disabled || !name.trim()}
            onClick={() => void onSave({ id: person.id, name, role })}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#102631] px-3 text-sm font-black text-[#f3d878] disabled:opacity-45"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => void onArchive(person)}
            aria-label={`Remove ${person.name}`}
            className="inline-grid h-11 w-11 place-items-center rounded-md border border-[#d71920]/45 text-[#b41920] disabled:opacity-45"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export function OdysseyPeopleManager({
  submissionCredential,
  people,
  persistenceReady,
  onPeopleChange,
}: {
  submissionCredential: string;
  people: ManagerConsolePerson[];
  persistenceReady: boolean;
  onPeopleChange: (people: ManagerConsolePerson[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"employee" | "manager">("employee");
  const [status, setStatus] = useState<PeopleStatus>({ kind: "idle" });
  const [importPreview, setImportPreview] = useState<ManagerRosterInput[]>([]);
  const blocked = !persistenceReady || status.kind === "working";

  async function sendRoster(payload: object) {
    const response = await fetch("/api/experience/manager-roster", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-experience-manager-key": submissionCredential,
      },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as {
      error?: string;
      message?: string;
      people?: ManagerConsolePerson[];
    };
    if (!response.ok || !result.people) {
      throw new Error(result.error ?? "The roster could not be saved.");
    }

    onPeopleChange(result.people);
    setStatus({ kind: "success", message: result.message ?? "Roster saved." });
  }

  async function savePeople(inputs: ManagerRosterInput[]) {
    setStatus({ kind: "working", message: "Saving the roster..." });
    try {
      await sendRoster({ action: "upsert", people: inputs });
      setImportPreview([]);
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "The roster could not be saved.",
      });
    }
  }

  async function archivePerson(person: ManagerConsolePerson) {
    if (!window.confirm(`Remove ${person.name} from active manager workflows? Their point history will remain.`)) {
      return;
    }

    setStatus({ kind: "working", message: `Removing ${person.name}...` });
    try {
      await sendRoster({ action: "archive", personId: person.id });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "That person could not be removed.",
      });
    }
  }

  async function parseFile(file: File) {
    if (/\.xlsx$/i.test(file.name)) {
      return importRowsFromMatrix(await readSheet(file));
    }

    const lines = (await file.text())
      .replace(/\r/g, "")
      .split("\n")
      .filter((line) => line.trim());
    const delimiter = lines[0]?.includes("\t") ? "\t" : ",";
    return importRowsFromMatrix(lines.map((line) => splitDelimitedLine(line, delimiter)));
  }

  async function importFile(file: File) {
    setStatus({ kind: "working", message: `Reading ${file.name}...` });
    try {
      const rows = await parseFile(file);
      if (!rows.length) {
        throw new Error("No employee names were found in that file.");
      }
      setImportPreview(rows);
      setStatus({
        kind: "success",
        message: `${rows.length} ${rows.length === 1 ? "person" : "people"} found. Review the preview, then import.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "That employee list could not be imported.",
      });
    }
  }

  return (
    <section className="rounded-xl border border-[#ccb567] bg-[#fffaf0] p-4 text-[#102631] shadow-[0_16px_45px_rgba(8,27,36,.14)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b41920]">People</p>
          <h2 className="mt-1 font-serif text-3xl font-bold">Managers &amp; crew</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#526875]">
            Manager names identify who awarded points. Crew names appear on the public
            leaderboard. No login accounts are created here.
          </p>
        </div>
        <button
          type="button"
          disabled={status.kind === "working"}
          onClick={() => fileRef.current?.click()}
          className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#102631] px-4 text-sm font-black text-[#f3d878] disabled:opacity-45"
        >
          <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
          Import Excel List
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.csv,.tsv,text/csv,text/tab-separated-values"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void importFile(file);
            }
            event.currentTarget.value = "";
          }}
        />
      </div>

      {importPreview.length ? (
        <div className="mt-5 rounded-lg border-2 border-[#d4c27e] bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8b712f]">Import preview</p>
              <p className="mt-1 text-sm font-bold text-[#526875]">
                {importPreview.slice(0, 5).map((person) => person.name).join(", ")}
                {importPreview.length > 5 ? ` and ${importPreview.length - 5} more` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={status.kind === "working"}
                onClick={() => {
                  setImportPreview([]);
                  setStatus({ kind: "idle" });
                }}
                className="min-h-11 rounded-md border border-[#d4c27e] px-4 text-sm font-black text-[#526875] disabled:opacity-45"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={blocked}
                onClick={() => {
                  void savePeople(importPreview);
                }}
                className="min-h-11 rounded-md bg-[#d71920] px-4 text-sm font-black text-white disabled:opacity-45"
              >
                Import {importPreview.length}
              </button>
            </div>
          </div>
          {!persistenceReady ? (
            <p className="mt-3 rounded-md bg-[#fff1ed] p-3 text-sm font-bold text-[#9f1117]">
              The file was read successfully. Connect Supabase before importing so the roster is saved.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 rounded-lg border border-[#d4c27e] bg-[#fff5cf] p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8b712f]">
          Excel columns
        </p>
        <p className="mt-1 text-sm font-bold text-[#526875]">
          Name is required. Optional columns: Role, Title, Email. A one-column
          spreadsheet containing names also works.
        </p>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg border border-[#ded2a7] bg-white p-4 sm:grid-cols-[1.4fr_.8fr_auto] sm:items-end">
        <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#8b712f]">
          Name
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            className="min-h-11 rounded-md border border-[#d4c27e] px-3 text-sm font-bold normal-case tracking-normal text-[#102631]"
            placeholder="Add a person"
          />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#8b712f]">
          Role
          <select
            value={newRole}
            onChange={(event) => setNewRole(event.target.value as "employee" | "manager")}
            className="min-h-11 rounded-md border border-[#d4c27e] px-3 text-sm font-bold normal-case tracking-normal text-[#102631]"
          >
            <option value="employee">Crew Member</option>
            <option value="manager">Manager</option>
          </select>
        </label>
        <button
          type="button"
          disabled={blocked || !newName.trim()}
          onClick={() => {
            void savePeople([{ name: newName, role: newRole }]);
            setNewName("");
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#d71920] px-4 text-sm font-black text-white disabled:opacity-45"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
      </div>

      {status.kind !== "idle" ? (
        <div className={`mt-4 flex items-center gap-2 rounded-lg border p-3 text-sm font-bold ${
          status.kind === "error"
            ? "border-[#d71920]/40 bg-[#fff1ed] text-[#9f1117]"
            : "border-[#d4c27e] bg-white text-[#526875]"
        }`} aria-live="polite">
          {status.kind === "working" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {status.message}
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-[#d71920]" aria-hidden="true" />
        <h3 className="font-serif text-2xl font-bold">Active roster</h3>
        <span className="rounded-full bg-[#102631] px-3 py-1 text-xs font-black text-[#f3d878]">{people.length}</span>
      </div>
      <div className="mt-3 grid gap-3">
        {people
          .slice()
          .sort((a, b) => Number(a.role === "employee") - Number(b.role === "employee") || a.name.localeCompare(b.name))
          .map((person) => (
            <PersonEditor
              key={`${person.id}:${person.name}:${person.role}:${person.department}`}
              person={person}
              disabled={blocked}
              onSave={(input) => savePeople([input])}
              onArchive={archivePerson}
            />
          ))}
      </div>
    </section>
  );
}
