import type { ReactNode } from 'react';
import type { TagTone } from '../../utils/format';

interface TagProps {
  tone?: TagTone;
  children: ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<TagTone, string> = {
  ok: 'border-transparent bg-accent-soft text-accent-600',
  warn: 'border-transparent bg-flag-soft text-flag',
  mute: 'border-transparent bg-[#eef0ec] text-ink-70',
  out: 'border-line text-ink-70',
};

const Tag = ({ tone = 'mute', children, className = '' }: TagProps) => (
  <span
    className={`inline-flex h-[21px] items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium tracking-[0.02em] whitespace-nowrap ${TONE_CLASSES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Tag;
