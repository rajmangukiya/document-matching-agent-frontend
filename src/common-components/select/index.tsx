import { type SelectHTMLAttributes, useId } from 'react';
import FieldLabel from '../field-label';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  compact?: boolean;
}

const Select = ({
  label,
  options,
  error,
  compact = true,
  id,
  className = '',
  ...rest
}: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col">
      {label && <FieldLabel htmlFor={selectId}>{label}</FieldLabel>}
      <select
        id={selectId}
        className={`border-line bg-paper text-ink focus:border-accent focus:ring-accent-soft disabled:bg-wash disabled:text-ink-45 w-full cursor-pointer rounded-md border px-2 focus:ring-3 focus:outline-none disabled:cursor-default ${
          compact ? 'h-[30px] text-[12.5px]' : 'h-9 text-[13.5px]'
        } ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-flag mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default Select;
