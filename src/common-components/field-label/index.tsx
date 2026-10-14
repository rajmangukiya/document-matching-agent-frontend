import type { ReactNode } from 'react';

interface FieldLabelProps {
  htmlFor?: string;
  children: ReactNode;
  action?: ReactNode;
}

// Label row above form controls, with an optional action on the right
const FieldLabel = ({ htmlFor, children, action }: FieldLabelProps) => (
  <div className="mb-1.5 flex items-center justify-between gap-2">
    <label htmlFor={htmlFor} className="text-ink-70 text-xs">
      {children}
    </label>
    {action}
  </div>
);

export default FieldLabel;
