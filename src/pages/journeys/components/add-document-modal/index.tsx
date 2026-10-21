import { Link } from 'react-router-dom';
import Alert from '../../../../common-components/alert';
import Button from '../../../../common-components/button';
import Loader from '../../../../common-components/loader';
import Modal from '../../../../common-components/modal';
import Tag from '../../../../common-components/tag';
import { PATHS } from '../../../../routes/paths';
import type { SegmentWithDocuments } from '../../../../types/journey';
import type { DocumentSkeletonListItem } from '../../../../types/document-skeleton';
import formatUtil from '../../../../utils/format';

interface AddDocumentModalProps {
  segment: SegmentWithDocuments | null;
  documentSkeletons: DocumentSkeletonListItem[] | null;
  addingId: string | null;
  error: string;
  onAdd: (documentSkeletonId: string) => void;
  onClose: () => void;
}

const AddDocumentModal = ({
  segment,
  documentSkeletons,
  addingId,
  error,
  onAdd,
  onClose,
}: AddDocumentModalProps) => {
  const inSegment = new Set(segment?.documents.map((d) => d.documentSkeletonId));

  return (
    <Modal
      open={segment !== null}
      onClose={onClose}
      title={`Add documents to ${segment?.name ?? ''}`}
      description="Pick the skeletons this segment expects. Their fields and match rules come with them."
      bodyClassName="py-1.5"
      footerStart={
        <Link to={PATHS.DOCUMENT_SKELETONS} className="text-[13px]">
          Missing one? Create a skeleton
        </Link>
      }
      footer={<Button onClick={onClose}>Done</Button>}
    >
      {error && (
        <div className="px-5 pt-2">
          <Alert variant="error">{error}</Alert>
        </div>
      )}
      {!documentSkeletons ? (
        <div className="text-accent grid h-32 place-items-center">
          <Loader />
        </div>
      ) : !documentSkeletons.length ? (
        <div className="text-ink-45 px-5 py-4 text-[13px]">No skeletons yet. Create one first.</div>
      ) : (
        <div className="max-h-[360px] overflow-y-auto">
          {documentSkeletons.map((t) => (
            <div key={t.id} className="flex items-center gap-[11px] px-5 py-[9px]">
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium">{t.title}</div>
                <div className="text-ink-45 text-[11.5px]">
                  {t.documentType} · {formatUtil.plural(t.fieldCount, 'field')}
                </div>
              </div>
              {inSegment.has(t.id) ? (
                <Tag tone="ok">Added</Tag>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  isLoading={addingId === t.id}
                  onClick={() => onAdd(t.id)}
                >
                  Add
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default AddDocumentModal;
