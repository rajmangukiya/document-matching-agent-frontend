import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react';
import FieldLabel from '../field-label';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelAction?: ReactNode;
  error?: string;
  hint?: string;
  compact?: boolean;
}

export const inputClasses = (hasError: boolean, compact = false) =>
  `w-full rounded-md border bg-paper px-3 text-ink placeholder:text-ink-45 focus:outline-none focus:ring-3 disabled:bg-wash ${
    compact ? 'h-[30px] text-[12.5px]' : 'h-9 text-[13.5px]'
  } ${hasError ? 'border-flag focus:border-flag focus:ring-flag-soft' : 'border-line focus:border-accent focus:ring-accent-soft'}`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelAction, error, hint, compact, id, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col">
        {label && (
          <FieldLabel htmlFor={inputId} action={labelAction}>
            {label}
          </FieldLabel>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${inputId}-note` : undefined}
          className={`${inputClasses(Boolean(error), compact)} ${className}`}
          {...rest}
        />
        {(error || hint) && (
          <p
            id={`${inputId}-note`}
            className={`mt-1 text-xs ${error ? 'text-flag' : 'text-ink-45'}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
