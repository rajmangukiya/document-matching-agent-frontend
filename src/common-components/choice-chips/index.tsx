interface ChoiceChipsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

// Single-select chip group
const ChoiceChips = <T extends string>({
  options,
  value,
  onChange,
  label,
}: ChoiceChipsProps<T>) => (
  <div>
    {label && <div className="text-ink-70 mb-1.5 text-xs">{label}</div>}
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`focus-visible:outline-accent inline-flex h-[26px] cursor-pointer items-center rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
              selected
                ? 'border-accent-line bg-accent-soft text-accent-600'
                : 'border-line text-ink-70 hover:border-mute'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default ChoiceChips;
