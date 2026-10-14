import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

const PageHeader = ({ title, description, breadcrumbs, actions }: PageHeaderProps) => (
  <div className="mb-5">
    {breadcrumbs && (
      <nav aria-label="Breadcrumb" className="kicker mb-1.5 flex flex-wrap gap-1">
        {breadcrumbs.map((crumb, i) => (
          <Fragment key={`${crumb.label}-${i}`}>
            {i > 0 && <span aria-hidden>/</span>}
            {crumb.to ? (
              <Link to={crumb.to} className="text-accent hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </Fragment>
        ))}
      </nav>
    )}
    <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-4">
      <div className="min-w-0 flex-[1_1_320px]">
        <h1 className="text-[29px] leading-tight">{title}</h1>
        {description && (
          <div className="text-ink-70 mt-1.5 max-w-[680px] text-[13.5px] text-pretty">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex max-w-full flex-wrap items-end gap-2">{actions}</div>}
    </div>
  </div>
);

export default PageHeader;
