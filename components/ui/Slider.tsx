"use client";

import { useState } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formula?: string;     // tooltip formula
  decimals?: number;
  onChange: (v: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  formula,
  decimals = 0,
  onChange,
}: SliderProps) {
  const [tipOpen, setTipOpen] = useState(false);
  const display = value.toFixed(decimals);

  return (
    <label className="block group">
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">
            {label}
          </span>
          {formula && (
            <button
              type="button"
              aria-label={`Show formula for ${label}`}
              onMouseEnter={() => setTipOpen(true)}
              onMouseLeave={() => setTipOpen(false)}
              onFocus={() => setTipOpen(true)}
              onBlur={() => setTipOpen(false)}
              className="relative w-4 h-4 inline-flex items-center justify-center rounded-full bg-[#EB1B26]/20 border border-[#EB1B26]/40 text-[#EB1B26] text-[9px] font-black hover:bg-[#EB1B26]/40 transition-colors"
            >
              ⓘ
              {tipOpen && (
                <span
                  role="tooltip"
                  className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2.5 py-1.5 bg-black border border-[#EB1B26]/60 text-[10px] font-mono text-[#EB1B26] whitespace-nowrap pointer-events-none"
                  style={{ borderRadius: "1px" }}
                >
                  {formula}
                </span>
              )}
            </button>
          )}
        </div>
        <span className="display-number text-[#EB1B26] text-sm">
          {display}
          {unit && <span className="text-white/40 text-[10px] ml-1">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#EB1B26] cursor-pointer"
      />
    </label>
  );
}

/* ── Dropdown / select ─────────────────────────────────────────────────── */

interface SelectProps<T extends string | number> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function Select<T extends string | number>({ label, value, options, onChange }: SelectProps<T>) {
  return (
    <label className="block">
      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55 mb-1.5">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(((typeof value === "number" ? Number(e.target.value) : e.target.value) as T))}
        className="w-full bg-black border border-[#1B2026] hover:border-[#EB1B26]/40 focus:border-[#EB1B26] outline-none px-3 py-2 text-sm text-white transition-colors"
        style={{ borderRadius: "1px" }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

/* ── Toggle group (small horizontal buttons) ───────────────────────────── */

interface TogglesProps<T extends string | number> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function Toggles<T extends string | number>({ label, value, options, onChange }: TogglesProps<T>) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55 mb-1.5">
        {label}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map((o) => (
          <button
            type="button"
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            className={`px-2 py-1.5 text-xs font-black uppercase tracking-wider border transition ${
              value === o.value
                ? "bg-[#EB1B26] text-white border-[#EB1B26]"
                : "bg-black text-white/50 border-[#1B2026] hover:border-[#EB1B26]/40"
            }`}
            style={{ borderRadius: "1px" }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
