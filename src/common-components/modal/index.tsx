import { type ReactNode, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  title: ReactNode;
  kicker?: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  footerStart?: ReactNode;
  width?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  bodyClassName?: string;
}

const WIDTHS = { sm: 'max-w-[480px]', md: 'max-w-[560px]', lg: 'max-w-[640px]' };

const Modal = ({
  open,
  title,
  kicker,
  description,
  onClose,
  footer,
  footerStart,
  width = 'md',
  children,
  bodyClassName = 'px-5 py-4',
}: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(21,24,27,0.34)] p-4 sm:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`border-line bg-paper shadow-modal flex max-h-full w-full flex-col overflow-hidden rounded-lg border ${WIDTHS[width]}`}
      >
        <div className="border-line-2 border-b px-5 pt-[18px] pb-3.5">
          {kicker && <div className="kicker mb-1">{kicker}</div>}
          <h2 id={titleId} className="text-[19px]">
            {title}
          </h2>
          {description && (
            <div className="text-ink-70 mt-1 text-[13px] text-pretty">{description}</div>
          )}
        </div>
        {children && <div className={`min-h-0 overflow-y-auto ${bodyClassName}`}>{children}</div>}
        {footer && (
          <div className="border-line-2 bg-wash flex items-center justify-between gap-3 border-t px-[18px] py-3.5">
            <div className="text-ink-70 min-w-0 text-[12.5px]">{footerStart}</div>
            <div className="flex shrink-0 gap-2">{footer}</div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
