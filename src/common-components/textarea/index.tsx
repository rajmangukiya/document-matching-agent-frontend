import { type TextareaHTMLAttributes, useId } from 'react';
import FieldLabel from '../field-label';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = ({ label, error, hint, id, className = '', rows = 4, ...rest }: TextareaProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col">
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={`bg-paper text-ink placeholder:text-ink-45 w-full resize-y rounded-md border px-3 py-2 text-[13.5px] focus:ring-3 focus:outline-none ${
          error
            ? 'border-flag focus:border-flag focus:ring-flag-soft'
            : 'border-line focus:border-accent focus:ring-accent-soft'
        } ${className}`}
        {...rest}
      />
      {(error || hint) && (
        <p className={`mt-1 text-xs ${error ? 'text-flag' : 'text-ink-45'}`}>{error || hint}</p>
      )}
    </div>
  );
};

export default Textarea;
