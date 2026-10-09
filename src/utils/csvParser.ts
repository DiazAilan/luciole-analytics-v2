import Papa from 'papaparse';
import { mapCategoryFromCsv } from '../constants/categories';
import type { ParseResult, TaskRow } from '../types';

const TASK_PATTERN = /^DSR-\d+/;

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, '')
    .trim()
    .normalize('NFC')
    .toLowerCase();
}

function parseReleaseDate(value: string): { iso: string; label: string } | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return null;
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { iso: `${yearStr}-${monthStr}-${dayStr}`, label: trimmed };
}

function extractTaskId(task: string): string {
  const match = task.match(/^(DSR-\d+)/);
  return match?.[1] ?? task;
}

export function parseCSV(content: string): ParseResult {
  const result = Papa.parse<string[]>(content, {
    skipEmptyLines: true,
  });

  const tasks: TaskRow[] = [];
  const warnings: string[] = [];
  let skippedRows = 0;

  const rows = result.data;
  if (!rows || rows.length < 2) {
    return { tasks, skippedRows, warnings };
  }

  const header = rows[0].map((h: string) => normalizeHeader(h ?? ''));
  const taskIdx = header.findIndex(
    (h) => h.includes('tâche') || h.includes('tache') || h === 'task'
  );
  const catIdx = header.findIndex(
    (h) => h.includes('categorie') || h.includes('catégorie')
  );
  const typeIdx = header.findIndex((h) => h === 'type' || h.startsWith('type'));
  const releaseIdx = header.findIndex((h) => h.includes('release'));

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const task = (taskIdx >= 0 ? row[taskIdx] : row[0])?.trim() || '';
    const categoryRaw = (catIdx >= 0 ? row[catIdx] : row[1])?.trim() || '';
    const category = categoryRaw ? mapCategoryFromCsv(categoryRaw) : '';
    const type = (typeIdx >= 0 ? row[typeIdx] : row[2])?.trim() || '';
    const releaseVal = (releaseIdx >= 0 ? row[releaseIdx] : row[3])?.trim() || '';

    if (!TASK_PATTERN.test(task)) {
      skippedRows += 1;
      continue;
    }

    if (!category) {
      skippedRows += 1;
      warnings.push(`${extractTaskId(task)} : catégorie manquante`);
      continue;
    }

    const release = parseReleaseDate(releaseVal);
    if (!release) {
      skippedRows += 1;
      warnings.push(`${extractTaskId(task)} : release invalide (${releaseVal || 'vide'})`);
      continue;
    }

    tasks.push({
      task,
      category,
      type: type || 'Non typé',
      release: release.iso,
      releaseLabel: release.label,
    });
  }

  return { tasks, skippedRows, warnings };
}
