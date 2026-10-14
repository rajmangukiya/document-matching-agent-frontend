import type { ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  onClose?: () => void;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: 'border-flag-line bg-flag-soft text-flag',
  success: 'border-accent-line bg-accent-soft text-accent-600',
  info: 'border-line bg-wash text-ink-70',
};

const Alert = ({ variant = 'info', children, onClose }: AlertProps) => (
  <div
    role={variant === 'error' ? 'alert' : 'status'}
    className={`flex items-start justify-between gap-3 rounded-md border px-3.5 py-2.5 text-[13px] ${VARIANT_CLASSES[variant]}`}
  >
    <div>{children}</div>
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="cursor-pointer leading-none opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    )}
  </div>
);

export default Alert;
