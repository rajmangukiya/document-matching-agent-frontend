import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import Button from '../../../common-components/button';
import ConfirmDialog from '../../../common-components/confirm-dialog';
import EmptyState from '../../../common-components/empty-state';
import Input from '../../../common-components/input';
import Loader from '../../../common-components/loader';
import Modal from '../../../common-components/modal';
import PageHeader from '../../../common-components/page-header';
import Stat from '../../../common-components/stat';
import { useAuth } from '../../../context/auth';
import { useToast } from '../../../context/toast';
import usePolling from '../../../hooks/use-polling';
import useRequest from '../../../hooks/use-request';
import { PATHS } from '../../../routes/paths';
import documentService from '../../../services/document';
import journeyService from '../../../services/journey';
import segmentService from '../../../services/segment';
import templateService from '../../../services/template';
import type { DocumentSummary, JourneyDetail, SegmentWithDocuments } from '../../../types/journey';
import { Permission } from '../../../types/permission';
import type { TemplateListItem } from '../../../types/template';
import errorUtil from '../../../utils/error';
import formatUtil from '../../../utils/format';
import AddDocumentModal from '../components/add-document-modal';
import JourneyFormModal from '../components/journey-form-modal';
import SegmentCard from '../components/segment-card';
import UploadModal from '../components/upload-modal';

const JourneyDetailPage = () => {
  const journeyId = Number(useParams().id);
  const navigate = useNavigate();
  const { can } = useAuth();
  const { showToast } = useToast();
  const canManage = can(Permission.MANAGE_JOURNEYS);
  const canUpload = can(Permission.MANAGE_DOCUMENT_DATA);

  const journey = useRequest(() => journeyService.get(journeyId), [journeyId]);
  const extracting = Boolean(
    journey.data?.segments.some((s) => s.documents.some((d) => d.status === 'extracting')),
  );
  usePolling(journey.reload, extracting);

  const [newSegment, setNewSegment] = useState('');
  const [segmentError, setSegmentError] = useState('');
  const [addDocFor, setAddDocFor] = useState<number | null>(null);
  const [templates, setTemplates] = useState<TemplateListItem[] | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addError, setAddError] = useState('');
  const [uploadFor, setUploadFor] = useState<DocumentSummary | null>(null);
  const [renameFor, setRenameFor] = useState<SegmentWithDocuments | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');
  const [removeSegment, setRemoveSegment] = useState<SegmentWithDocuments | null>(null);
  const [removeDocument, setRemoveDocument] = useState<DocumentSummary | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (journey.isLoading) return <Loader fullScreen />;
  if (journey.error || !journey.data)
    return <Alert variant="error">{errorUtil.getMessage(journey.error)}</Alert>;
  const j = journey.data;
  const apply = (next: JourneyDetail) => journey.setData(next);

  const addSegment = async () => {
    const name = newSegment.trim();
    if (!name) return;
    setSegmentError('');
    try {
      apply(await journeyService.addSegment(j.id, name));
      setNewSegment('');
    } catch (err) {
      setSegmentError(errorUtil.getMessage(err));
    }
  };

  const openAddDocument = (segmentId: number) => {
    setAddDocFor(segmentId);
    setAddError('');
    templateService
      .list()
      .then(setTemplates)
      .catch((err) => setAddError(errorUtil.getMessage(err)));
  };

  const addDocument = async (templateId: number) => {
    setAddingId(templateId);
    setAddError('');
    try {
      apply(await segmentService.addDocument(addDocFor!, templateId));
    } catch (err) {
      setAddError(errorUtil.getMessage(err));
    } finally {
      setAddingId(null);
    }
  };

  const rename = async () => {
    setRenameError('');
    try {
      apply(await segmentService.rename(renameFor!.id, renameValue.trim()));
      setRenameFor(null);
    } catch (err) {
      setRenameError(errorUtil.getMessage(err));
    }
  };

  const uploadSegment = j.segments.find((s) => s.id === uploadFor?.segmentId);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Journeys', to: PATHS.JOURNEYS },
          { label: formatUtil.journeyCode(j.id) },
        ]}
        title={j.title}
        description={j.description}
        actions={
          <div className="flex flex-wrap items-end gap-[18px]">
            <Stat value={`${j.stats.uploaded} / ${j.stats.documents}`} label="Uploaded" />
            <Stat value={j.stats.matched} label="Fields matched" tone="ok" />
            <Stat value={j.stats.notMatched} label="Not matched" tone="warn" />
            {canManage && (
              <div className="flex gap-1">
                <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                  Edit
                </Button>
                <Button variant="quiet" size="sm" onClick={() => setDeleteOpen(true)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        }
      />

      <div className="flex flex-col gap-[13px]">
        {!j.segments.length && (
          <EmptyState
            title="No segments yet."
            description={
              canManage
                ? 'Add the first segment below, then pick the document skeletons it expects.'
                : undefined
            }
          />
        )}

        {j.segments.map((segment, index) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            index={index}
            canManage={canManage}
            canUpload={canUpload}
            onAddDocument={() => openAddDocument(segment.id)}
            onRename={() => {
              setRenameFor(segment);
              setRenameValue(segment.name);
              setRenameError('');
            }}
            onRemove={() => setRemoveSegment(segment)}
            onUpload={setUploadFor}
            onRemoveDocument={setRemoveDocument}
          />
        ))}

        {canManage && (
          <div className="border-line bg-paper shadow-card flex flex-col gap-2 rounded-lg border px-[17px] py-3.5">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  aria-label="New segment name"
                  placeholder="New segment name, e.g. Port handling — Jebel Ali"
                  value={newSegment}
                  error={segmentError || undefined}
                  onChange={(e) => {
                    setNewSegment(e.target.value);
                    setSegmentError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && void addSegment()}
                />
              </div>
              <Button
                variant="secondary"
                disabled={!newSegment.trim()}
                onClick={() => void addSegment()}
              >
                + Add segment
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddDocumentModal
        segment={j.segments.find((s) => s.id === addDocFor) ?? null}
        templates={templates}
        addingId={addingId}
        error={addError}
        onAdd={(templateId) => void addDocument(templateId)}
        onClose={() => setAddDocFor(null)}
      />
      <UploadModal
        document={uploadFor}
        segmentName={uploadSegment?.name ?? ''}
        onClose={() => setUploadFor(null)}
        onUploaded={() => void journey.reload()}
      />
      <Modal
        open={renameFor !== null}
        onClose={() => setRenameFor(null)}
        width="sm"
        title="Rename segment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenameFor(null)}>
              Cancel
            </Button>
            <Button disabled={!renameValue.trim()} onClick={() => void rename()}>
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {renameError && <Alert variant="error">{renameError}</Alert>}
          <Input
            label="Segment name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && renameValue.trim() && void rename()}
          />
        </div>
      </Modal>
      <ConfirmDialog
        open={removeSegment !== null}
        title={`Remove ${removeSegment?.name ?? ''}?`}
        description={`Its ${formatUtil.plural(removeSegment?.documents.length ?? 0, 'document')} and their uploaded files are deleted too.`}
        confirmLabel="Remove segment"
        onClose={() => setRemoveSegment(null)}
        onConfirm={async () => apply(await segmentService.remove(removeSegment!.id))}
      />
      <ConfirmDialog
        open={removeDocument !== null}
        title={`Remove ${removeDocument?.title ?? ''}?`}
        description="Its uploaded files and extracted values are deleted. Documents that match against it will show it as missing."
        confirmLabel="Remove document"
        onClose={() => setRemoveDocument(null)}
        onConfirm={async () => apply(await documentService.remove(removeDocument!.id))}
      />
      <JourneyFormModal
        open={editOpen}
        initial={{ title: j.title, description: j.description }}
        onClose={() => setEditOpen(false)}
        onSubmit={async (payload) => apply(await journeyService.update(j.id, payload))}
      />
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete ${j.title}?`}
        description="All segments, documents and uploaded files in this journey are deleted. This can't be undone."
        confirmLabel="Delete journey"
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await journeyService.remove(j.id);
          showToast('Journey deleted');
          navigate(PATHS.JOURNEYS);
        }}
      />
    </div>
  );
};

export default JourneyDetailPage;
