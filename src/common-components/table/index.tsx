import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

// Table primitives sharing the mockup's table styling
export const Table = ({
  children,
  fixed = false,
  className = '',
}: {
  children: ReactNode;
  fixed?: boolean;
  className?: string;
}) => (
  <div className="overflow-x-auto">
    <table className={`w-full border-collapse ${fixed ? 'table-fixed' : ''} ${className}`}>
      {children}
    </table>
  </div>
);

export const Th = ({ className = '', ...rest }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={`border-line text-ink-45 border-b px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] uppercase ${className}`}
    {...rest}
  />
);

export const Td = ({ className = '', ...rest }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`border-line-2 border-b px-3 py-[11px] align-middle ${className}`} {...rest} />
);

export const Tr = ({ className = '', ...rest }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`hover:bg-wash [&:last-child>td]:border-b-0 ${className}`} {...rest} />
);
