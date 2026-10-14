interface ProgressBarProps {
  // 0–100; omit for an indeterminate bar
  value?: number;
  done?: boolean;
}

const ProgressBar = ({ value, done = false }: ProgressBarProps) => (
  <div
    className="h-1 overflow-hidden rounded-full bg-[#e6e8e4]"
    role="progressbar"
    aria-valuenow={value}
  >
    {value === undefined ? (
      <div className="animate-indeterminate bg-accent h-full w-2/5 rounded-full" />
    ) : (
      <div
        className={`h-full rounded-full transition-[width] duration-150 ${done ? 'bg-accent' : 'bg-accent-line'}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    )}
  </div>
);

export default ProgressBar;
