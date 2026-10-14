import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="border-line bg-paper rounded-lg border border-dashed px-4 py-8 text-center">
    <div className="text-ink-70 text-sm">{title}</div>
    {description && <div className="text-ink-45 mt-1 text-[12.5px]">{description}</div>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
