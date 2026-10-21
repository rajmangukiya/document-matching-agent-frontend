import { useState } from 'react';
import Alert from '../../../../common-components/alert';
import Button from '../../../../common-components/button';
import Loader from '../../../../common-components/loader';
import Modal from '../../../../common-components/modal';
import Tag from '../../../../common-components/tag';
import type { MatchCandidate, DocumentSkeletonField } from '../../../../types/document-skeleton';
import errorUtil from '../../../../utils/error';

interface MatchModalProps {
  field: DocumentSkeletonField | null;
  candidates: MatchCandidate[] | null;
  onClose: () => void;
  onAdd: (matchFieldId: string) => Promise<unknown>;
  onRemove: (matchFieldId: string) => Promise<unknown>;
}

const rowClasses = (selected: boolean) =>
  `flex w-full cursor-pointer items-center gap-2 border-l-2 px-4 text-left text-[13px] focus-visible:outline-2 focus-visible:outline-accent ${
    selected ? 'border-accent bg-accent-soft' : 'border-transparent hover:bg-wash'
  }`;

// Two-step picker: choose a skeleton, then one of its fields
const MatchModal = ({ field, candidates, onClose, onAdd, onRemove }: MatchModalProps) => {
  const [documentSkeletonId, setDocumentSkeletonId] = useState<string | null>(null);
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selected = candidates?.find((c) => c.id === documentSkeletonId) ?? null;
  const alreadyMatched = field?.matches.some((m) => m.fieldId === fieldId) ?? false;

  const close = () => {
    setDocumentSkeletonId(null);
    setFieldId(null);
    setError('');
    onClose();
  };

  const run = async (action: () => Promise<unknown>) => {
    setIsSaving(true);
    setError('');
    try {
      await action();
    } catch (err) {
      setError(errorUtil.getMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      open={field !== null}
      onClose={close}
      width="lg"
      title={`“${field?.name ?? ''}” matches with…`}
      description={
        <>
          Pick a skeleton, then a field. Add as many as this field needs.
          {field && field.matches.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {field.matches.map((m) => (
                <Tag key={m.fieldId} tone="ok" className="h-6">
                  {m.documentSkeletonTitle} · {m.fieldName}
                  <button
                    type="button"
                    aria-label={`Remove ${m.documentSkeletonTitle} · ${m.fieldName}`}
                    className="text-accent-600 hover:text-ink cursor-pointer"
                    onClick={() => void run(() => onRemove(m.fieldId))}
                  >
                    ✕
                  </button>
                </Tag>
              ))}
            </div>
          )}
        </>
      }
      bodyClassName=""
      footerStart={error && <span className="text-flag">{error}</span>}
      footer={
        <>
          <Button
            variant="secondary"
            disabled={!fieldId || alreadyMatched}
            isLoading={isSaving}
            onClick={() =>
              void run(async () => {
                await onAdd(fieldId!);
                setFieldId(null);
              })
            }
          >
            + Add match
          </Button>
          <Button onClick={close}>Done</Button>
        </>
      }
    >
      {!candidates ? (
        <div className="text-accent grid h-40 place-items-center">
          <Loader />
        </div>
      ) : !candidates.length ? (
        <div className="p-5">
          <Alert>
            There are no other skeletons yet. Create the skeleton this field should match first.
          </Alert>
        </div>
      ) : (
        <div className="grid min-h-[280px] grid-cols-2">
          <div className="border-line-2 border-r">
            <div className="kicker px-4 pt-[13px] pb-[9px]">1 — Skeleton</div>
            <div className="max-h-[300px] overflow-y-auto pb-2">
              {candidates.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${rowClasses(c.id === documentSkeletonId)} flex-col items-start py-[9px]`}
                  onClick={() => {
                    setDocumentSkeletonId(c.id);
                    setFieldId(null);
                  }}
                >
                  <span className="text-[13.5px] font-medium">{c.title}</span>
                  <span className="text-ink-45 font-mono text-[11px]">{c.documentType}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="kicker px-4 pt-[13px] pb-[9px]">2 — Field</div>
            <div className="max-h-[300px] overflow-y-auto pb-2">
              {!selected && (
                <div className="text-ink-45 px-4 py-2 text-[12.5px]">Pick a skeleton first.</div>
              )}
              {selected && !selected.fields.length && (
                <div className="text-ink-45 px-4 py-2 text-[12.5px]">
                  This skeleton has no fields yet.
                </div>
              )}
              {selected?.fields.map((f) => {
                const matched = field?.matches.some((m) => m.fieldId === f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={`${rowClasses(f.id === fieldId)} h-10`}
                    onClick={() => setFieldId(f.id)}
                  >
                    <span className="flex-1 truncate font-medium">{f.name}</span>
                    {matched ? (
                      <Tag tone="ok">Added</Tag>
                    ) : (
                      <span className="text-ink-45 font-mono text-[11px]">{f.type}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MatchModal;
