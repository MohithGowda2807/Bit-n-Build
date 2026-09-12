import React from 'react';
import { formatClock } from '../../design/format';
import { IconFrame, Mono, Panel } from '../ui/primitives';

export interface ReplayState {
  scenario: string;
  simTime: string | null;
  step: number;
  totalSteps: number;
  /** Position along the scenario's time span, 0 to 1. */
  progress: number;
  done: boolean;
  startTime: string | null;
  endTime: string | null;
  /** Dark windows as fractions of the time span, drawn as the amber marker. */
  darkWindows: { start: number; width: number; label?: string }[];
}

interface Props {
  replay: ReplayState;
  startLabel: string;
  endLabel: string;
  onClose: () => void;
}

export const ReplayBar: React.FC<Props> = ({ replay, startLabel, endLabel, onClose }) => (
  <Panel className="h-14 flex items-center gap-3.5 px-3">
    <IconFrame onClick={onClose} aria-label="Exit replay">
      {replay.done ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l8 8M10 2l-8 8" /></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5h3v9H2zM7 1.5h3v9H7z" /></svg>
      )}
    </IconFrame>
    <Mono className="text-xs text-os-ash">{startLabel}</Mono>
    <div className="flex-1 h-0.5 bg-os-steel relative">
      {replay.darkWindows.map((w, i) => (
        <div key={i} title={w.label} className="absolute -top-[3px] h-2 rounded-badge"
          style={{ left: `${w.start * 100}%`, width: `${w.width * 100}%`, background: '#e2a33a', opacity: 0.85 }} />
      ))}
      <div className="absolute left-0 top-0 h-0.5 bg-white transition-[width] duration-200 ease-linear" style={{ width: `${replay.progress * 100}%` }} />
      <div className="absolute -top-[5px] w-3 h-3 rounded-full bg-white transition-[left] duration-200 ease-linear" style={{ left: `calc(${replay.progress * 100}% - 6px)` }} />
    </div>
    <Mono className="text-xs text-os-ash">{endLabel}</Mono>
    <Mono className="text-xs font-medium text-white w-12 text-right">{replay.simTime ? formatClock(replay.simTime) : '--:--'}</Mono>
    <Mono className="text-[11px] text-os-slate">{replay.step}/{replay.totalSteps}</Mono>
  </Panel>
);
