'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { MonthAvailability } from '@/lib/mock/availability';
import type { DateStatus } from '@/types/booking';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CalendarProps {
  /** Initial year to display */
  year: number;
  /** Initial month (0-indexed) */
  month: number;
  availability: MonthAvailability;
  selectedDate: string | null;
  onDateSelect: (isoDate: string) => void;
  /** Called when the user navigates to a different month */
  onMonthChange: (year: number, month: number) => void;
}

interface CellDescriptor {
  type: 'empty' | 'date';
  day?: number;
  isoDate?: string;
  status?: DateStatus;
  isPast?: boolean;
  isSelected?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function padTwo(n: number): string {
  return String(n).padStart(2, '0');
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${padTwo(month + 1)}-${padTwo(day)}`;
}

/** Returns today as an ISO date string "YYYY-MM-DD" */
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${padTwo(d.getMonth() + 1)}-${padTwo(d.getDate())}`;
}

function formatLongDate(isoDate: string): string {
  // Parse without timezone shift
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDisplayDate(isoDate: string): string {
  // "Friday, June 19 · 2026"
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('en-CA', { weekday: 'long' });
  const month   = date.toLocaleDateString('en-CA', { month: 'long' });
  const day     = d;
  const year    = y;
  return `${weekday}, ${month} ${day} · ${year}`;
}

function buildCells(
  year: number,
  month: number,
  availability: MonthAvailability,
  selectedDate: string | null,
  today: string,
): CellDescriptor[] {
  const firstDow    = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CellDescriptor[] = [];

  // Leading empty cells
  for (let i = 0; i < firstDow; i++) {
    cells.push({ type: 'empty' });
  }

  // Date cells
  for (let day = 1; day <= daysInMonth; day++) {
    const isoDate   = toISO(year, month, day);
    const isPast    = isoDate < today;
    const status    = availability[isoDate] ?? 'available';
    const isSelected = isoDate === selectedDate;
    cells.push({ type: 'date', day, isoDate, status, isPast, isSelected });
  }

  // Trailing empty cells to fill the last row
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i++) {
      cells.push({ type: 'empty' });
    }
  }

  return cells;
}

function isClickable(cell: CellDescriptor): boolean {
  if (cell.type !== 'date') return false;
  if (cell.isPast) return false;
  return cell.status === 'available' || cell.status === 'limited';
}

function cellAriaLabel(cell: CellDescriptor): string | undefined {
  if (cell.type !== 'date' || !cell.isoDate) return undefined;
  const long = formatLongDate(cell.isoDate);
  if (cell.isPast) return `${long} — past`;
  return `${long} — ${cell.status}`;
}

// ---------------------------------------------------------------------------
// Diagonal stripe pattern (used for "limited" cells and the legend swatch)
// ---------------------------------------------------------------------------

const STRIPE_BG =
  'repeating-linear-gradient(135deg, rgba(244,241,234,0.15) 0px, rgba(244,241,234,0.15) 1px, transparent 1px, transparent 6px)';

// ---------------------------------------------------------------------------
// Cell styles
// ---------------------------------------------------------------------------

function getCellStyle(cell: CellDescriptor): React.CSSProperties {
  if (cell.type === 'empty') return {};

  if (cell.isSelected) {
    return {
      background: 'var(--color-ink)',
      border: '2px solid var(--color-clay)',
      color: 'var(--color-bone)',
      borderRadius: '4px',
      fontWeight: 500,
    };
  }

  if (cell.isPast) {
    return {
      color: 'rgba(26,22,19,0.22)',
      cursor: 'default',
    };
  }

  switch (cell.status) {
    case 'available':
      return {
        background: 'var(--color-clay)',
        color: 'var(--color-ink)',
        borderRadius: '4px',
        fontWeight: 500,
        cursor: 'pointer',
      };
    case 'limited':
      return {
        background: `${STRIPE_BG}, var(--color-ink)`,
        color: 'var(--color-bone)',
        borderRadius: '4px',
        fontWeight: 500,
        cursor: 'pointer',
      };
    case 'booked':
      return {
        background: 'rgba(26,22,19,0.06)',
        color: 'rgba(26,22,19,0.4)',
        borderRadius: '4px',
        cursor: 'not-allowed',
      };
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// Calendar component
// ---------------------------------------------------------------------------

export function Calendar({
  year: initialYear,
  month: initialMonth,
  availability,
  selectedDate,
  onDateSelect,
  onMonthChange,
}: CalendarProps) {
  const [year,  setYear]  = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const today = todayISO();

  // Keep displayed month in sync when parent changes it (e.g. back-nav pre-select)
  useEffect(() => {
    setYear(initialYear);
    setMonth(initialMonth);
  }, [initialYear, initialMonth]);

  const cells = buildCells(year, month, availability, selectedDate, today);

  // Grid ref for keyboard navigation
  const gridRef = useRef<HTMLDivElement>(null);

  const navigateMonth = useCallback(
    (dir: -1 | 1) => {
      let newYear  = year;
      let newMonth = month + dir;
      if (newMonth < 0)  { newMonth = 11; newYear--; }
      if (newMonth > 11) { newMonth = 0;  newYear++; }

      // Prevent navigating before current month
      const currentMonthISO = `${new Date().getFullYear()}-${padTwo(new Date().getMonth() + 1)}`;
      const targetMonthISO  = `${newYear}-${padTwo(newMonth + 1)}`;
      if (targetMonthISO < currentMonthISO) return;

      setYear(newYear);
      setMonth(newMonth);
      onMonthChange(newYear, newMonth);
    },
    [year, month, onMonthChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const focused = document.activeElement as HTMLElement | null;
      if (!focused || !gridRef.current?.contains(focused)) return;

      const isoDate = focused.dataset.isodate;
      if (!isoDate) return;

      const [fy, fm, fd] = isoDate.split('-').map(Number);
      let targetDate = new Date(fy, fm - 1, fd);

      if (e.key === 'ArrowRight') { e.preventDefault(); targetDate = new Date(fy, fm - 1, fd + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); targetDate = new Date(fy, fm - 1, fd - 1); }
      if (e.key === 'ArrowDown')  { e.preventDefault(); targetDate = new Date(fy, fm - 1, fd + 7); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); targetDate = new Date(fy, fm - 1, fd - 7); }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focused.dataset.clickable === 'true') {
          onDateSelect(isoDate);
        }
        return;
      }

      if (['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)) {
        const newISO = toISO(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate(),
        );
        // If the target is in a different month, navigate there first
        if (
          targetDate.getFullYear() !== year ||
          targetDate.getMonth()    !== month
        ) {
          const dir = targetDate > new Date(year, month, 1) ? 1 : -1 as -1 | 1;
          navigateMonth(dir);
          // Focus will land on the cell after re-render via the effect below
        }
        // Try to focus the target cell
        const target = gridRef.current?.querySelector<HTMLElement>(
          `[data-isodate="${newISO}"]`
        );
        target?.focus();
      }
    },
    [year, month, onDateSelect, navigateMonth],
  );

  const prevMonthISO = `${year}-${padTwo(month + 1)}`;
  const currentMonthISO = `${new Date().getFullYear()}-${padTwo(new Date().getMonth() + 1)}`;
  const isPrevDisabled = prevMonthISO <= currentMonthISO;

  return (
    <div>
      {/* Month navigation header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--color-ink-soft)',
          }}
        >
          {MONTH_NAMES[month]} {year}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigateMonth(-1)}
            disabled={isPrevDisabled}
            aria-label="Previous month"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '999px',
              border: '0.5px solid var(--color-border-light)',
              background: 'transparent',
              cursor: isPrevDisabled ? 'not-allowed' : 'pointer',
              opacity: isPrevDisabled ? 0.35 : 1,
              fontSize: '14px',
              color: 'var(--color-ink-soft)',
              transition: 'border-color 150ms ease',
            }}
          >
            ‹
          </button>
          <button
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '999px',
              border: '0.5px solid var(--color-border-light)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--color-ink-soft)',
              transition: 'border-color 150ms ease',
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Day-of-week header */}
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '4px',
        }}
      >
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            role="columnheader"
            aria-label={name}
            style={{
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              color: 'var(--color-warm-gray)',
              paddingBottom: '8px',
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label="Event date picker"
        onKeyDown={handleKeyDown}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {cells.map((cell, i) => {
          if (cell.type === 'empty') {
            return (
              <div
                key={`empty-${i}`}
                role="gridcell"
                aria-hidden="true"
                style={{ aspectRatio: '1' }}
              />
            );
          }

          const clickable = isClickable(cell);
          const ariaLabel = cellAriaLabel(cell);

          return (
            <div
              key={cell.isoDate}
              role="gridcell"
              tabIndex={clickable ? 0 : -1}
              aria-label={ariaLabel}
              aria-selected={cell.isSelected ? true : false}
              aria-disabled={!clickable ? true : undefined}
              data-isodate={cell.isoDate}
              data-clickable={clickable ? 'true' : 'false'}
              onClick={clickable ? () => onDateSelect(cell.isoDate!) : undefined}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                userSelect: 'none',
                outline: 'none',
                ...getCellStyle(cell),
              }}
              // Focus ring via inline onFocus/onBlur is too complex; use CSS
              onFocus={(e) => {
                if (clickable) {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 0 2px rgba(198,93,63,0.5)';
                }
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
