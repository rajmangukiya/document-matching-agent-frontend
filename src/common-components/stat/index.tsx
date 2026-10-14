import type { ReactNode } from 'react';

type StatTone = 'default' | 'ok' | 'warn' | 'mute';

interface StatProps {
  value: ReactNode;
  label: string;
  tone?: StatTone;
}

const TONES: Record<StatTone, string> = {
  default: 'text-ink',
  ok: 'text-accent-600',
  warn: 'text-flag',
  mute: 'text-ink-45',
};

const Stat = ({ value, label, tone = 'default' }: StatProps) => (
  <div>
    <div className={`text-lg font-semibold ${TONES[tone]}`}>{value}</div>
    <div className="kicker">{label}</div>
  </div>
);

export default Stat;
