import { useState } from 'react';
import Input from '../../../../common-components/input';
import type { FieldRow } from '../../../../types/document';

interface FieldValueCellProps {
  field: FieldRow;
  canEdit: boolean;
  onSave: (value: string | null) => Promise<unknown>;
}

// Extracted value with its source; missing values can be typed in by hand
const FieldValueCell = ({ field, canEdit, onSave }: FieldValueCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const save = async (value: string) => {
    const next = value.trim();
    if (!next || next === field.value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(next);
      setIsEditing(false);
      setDraft('');
    } finally {
      setIsSaving(false);
    }
  };

  const editor = (placeholder: string) => (
    <Input
      compact
      autoFocus={isEditing}
      aria-label={`Value for ${field.name}`}
      placeholder={placeholder}
      disabled={isSaving}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') void save(draft);
        if (e.key === 'Escape') setIsEditing(false);
      }}
      onBlur={() => void save(draft)}
    />
  );

  if (field.value === null) {
    return (
      <>
        <div className="text-flag mb-[5px] text-[11.5px]">Not found in files</div>
        {canEdit && editor('Enter value, press Enter')}
      </>
    );
  }

  if (isEditing) return editor(field.value);

  const source = field.isManual
    ? 'Entered manually'
    : `${field.sourceFileName ?? 'File'}${field.confidence !== null ? ` · ${field.confidence}% confidence` : ''}`;

  return (
    <>
      <div className="text-ink truncate font-mono text-[12.5px]" title={field.value}>
        {field.value}
      </div>
      <div className="text-ink-45 flex items-center gap-2 text-[11.5px]">
        <span className="min-w-0 truncate" title={source}>
          {source}
        </span>
        {canEdit && (
          <>
            <button
              type="button"
              className="text-accent shrink-0 cursor-pointer hover:underline"
              onClick={() => {
                setDraft(field.value ?? '');
                setIsEditing(true);
              }}
            >
              Edit
            </button>
            {field.isManual && (
              <button
                type="button"
                className="text-accent shrink-0 cursor-pointer hover:underline"
                onClick={() => void onSave(null)}
              >
                Reset
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FieldValueCell;
