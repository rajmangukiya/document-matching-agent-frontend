import type { ReactNode } from 'react';

interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

const Tabs = <T extends string>({ items, value, onChange }: TabsProps<T>) => (
  <div role="tablist" className="border-line mb-[18px] flex items-end gap-[26px] border-b">
    {items.map((item) => (
      <button
        key={item.value}
        type="button"
        role="tab"
        aria-selected={item.value === value}
        onClick={() => onChange(item.value)}
        className={`focus-visible:outline-accent -mb-px inline-flex cursor-pointer items-center gap-2 border-b-2 px-0.5 pb-[11px] text-[14.5px] focus-visible:outline-2 focus-visible:outline-offset-2 ${
          item.value === value
            ? 'border-accent text-ink font-semibold'
            : 'text-ink-45 hover:text-ink border-transparent font-medium'
        }`}
      >
        {item.label}
      </button>
    ))}
  </div>
);

export default Tabs;
