import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

const Card = ({
  title,
  description,
  actions,
  children,
  className = '',
  padded = true,
}: CardProps) => (
  <section
    className={`border-line bg-paper shadow-card overflow-hidden rounded-lg border ${className}`}
  >
    {(title || actions) && (
      <header className="flex flex-wrap items-start justify-between gap-3 px-[18px] pt-4 pb-3">
        <div>
          {title && <h3 className="text-[15px]">{title}</h3>}
          {description && <div className="text-ink-45 mt-0.5 text-[12.5px]">{description}</div>}
        </div>
        {actions}
      </header>
    )}
    <div className={padded ? 'px-[18px] pb-[18px]' : ''}>{children}</div>
  </section>
);

export default Card;
