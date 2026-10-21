import { type KeyboardEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import Button from '../../../common-components/button';
import Card from '../../../common-components/card';
import ConfirmDialog from '../../../common-components/confirm-dialog';
import Input from '../../../common-components/input';
import Loader from '../../../common-components/loader';
import PageHeader from '../../../common-components/page-header';
import Select from '../../../common-components/select';
import { Table, Td, Th, Tr } from '../../../common-components/table';
import Tabs from '../../../common-components/tabs';
import Tag from '../../../common-components/tag';
import Textarea from '../../../common-components/textarea';
import { useAuth } from '../../../context/auth';
import { useToast } from '../../../context/toast';
import useRequest from '../../../hooks/use-request';
import { PATHS } from '../../../routes/paths';
import documentSkeletonService from '../../../services/document-skeleton';
import { Permission } from '../../../types/permission';
import {
  FIELD_TYPES,
  type FieldType,
  type MatchCandidate,
  type DocumentSkeletonDetail,
  type DocumentSkeletonField,
} from '../../../types/document-skeleton';
import errorUtil from '../../../utils/error';
import formatUtil from '../../../utils/format';
import MatchModal from '../components/match-modal';

type Tab = 'details' | 'fields';

const typeOptions = FIELD_TYPES.map((t) => ({ value: t, label: t }));

// Field name that saves on Enter or blur when changed
const FieldNameInput = ({
  field,
  onRename,
}: {
  field: DocumentSkeletonField;
  onRename: (name: string) => void;
}) => {
  const [value, setValue] = useState(field.name);
  useEffect(() => setValue(field.name), [field.name]);

  const commit = () => {
    const next = value.trim();
    if (next && next !== field.name) onRename(next);
    else setValue(field.name);
  };

  return (
    <input
      aria-label="Field name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
        e.key === 'Enter' && e.currentTarget.blur()
      }
      className="hover:border-line focus:border-accent focus:bg-paper -mx-1.5 w-full rounded border border-transparent bg-transparent px-1.5 py-1 font-medium focus:outline-none"
    />
  );
};

const DocumentSkeletonDetailPage = () => {
  const documentSkeletonId = useParams().id ?? '';
  const location = useLocation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { showToast } = useToast();
  const canManage = can(Permission.MANAGE_DOCUMENT_SKELETONS);

  const documentSkeleton = useRequest(
    () => documentSkeletonService.get(documentSkeletonId),
    [documentSkeletonId],
  );
  const [tab, setTab] = useState<Tab>((location.state as { tab?: Tab } | null)?.tab ?? 'fields');
  const [details, setDetails] = useState({ title: '', documentType: '', description: '' });
  const [detailsStatus, setDetailsStatus] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [newField, setNewField] = useState<{ name: string; type: FieldType }>({
    name: '',
    type: 'text',
  });
  const [newFieldError, setNewFieldError] = useState('');
  const [matchFor, setMatchFor] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<MatchCandidate[] | null>(null);
  const [removeField, setRemoveField] = useState<DocumentSkeletonField | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const t = documentSkeleton.data;
  useEffect(() => {
    if (t)
      setDetails({
        title: t.title,
        documentType: t.documentType,
        description: t.description ?? '',
      });
  }, [t?.id, t?.title, t?.documentType, t?.description]);

  if (documentSkeleton.isLoading) return <Loader fullScreen />;
  if (documentSkeleton.error || !t)
    return <Alert variant="error">{errorUtil.getMessage(documentSkeleton.error)}</Alert>;

  const apply = (next: DocumentSkeletonDetail) => documentSkeleton.setData(next);
  const run = async (action: () => Promise<DocumentSkeletonDetail>, success?: string) => {
    try {
      apply(await action());
      if (success) showToast(success);
    } catch (err) {
      showToast(errorUtil.getMessage(err), 'error');
    }
  };

  const detailsDirty =
    details.title !== t.title ||
    details.documentType !== t.documentType ||
    details.description !== (t.description ?? '');

  const saveDetails = async () => {
    setIsSavingDetails(true);
    setDetailsStatus(null);
    try {
      apply(
        await documentSkeletonService.update(t.id, {
          title: details.title.trim(),
          documentType: details.documentType.trim(),
          description: details.description.trim() || null,
        }),
      );
      setDetailsStatus({ type: 'success', message: 'Saved.' });
    } catch (err) {
      setDetailsStatus({ type: 'error', message: errorUtil.getMessage(err) });
    } finally {
      setIsSavingDetails(false);
    }
  };

  const addField = async () => {
    if (!newField.name.trim()) return;
    setNewFieldError('');
    try {
      apply(
        await documentSkeletonService.addField(t.id, {
          name: newField.name.trim(),
          type: newField.type,
        }),
      );
      setNewField({ name: '', type: newField.type });
    } catch (err) {
      setNewFieldError(errorUtil.getMessage(err));
    }
  };

  const openMatch = (fieldId: string) => {
    setMatchFor(fieldId);
    if (!candidates) {
      documentSkeletonService
        .matchCandidates(t.id)
        .then(setCandidates)
        .catch((err) => showToast(errorUtil.getMessage(err), 'error'));
    }
  };

  const withRules = t.fields.filter((f) => f.matches.length).length;
  const ruleCount = t.fields.reduce((sum, f) => sum + f.matches.length, 0);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Document skeletons', to: PATHS.DOCUMENT_SKELETONS },
          { label: t.title },
        ]}
        title={t.title}
        description={<span className="text-ink-45 font-mono text-xs">{t.documentType}</span>}
        actions={
          canManage && (
            <Button variant="secondary" onClick={() => setDeleteOpen(true)}>
              Delete skeleton
            </Button>
          )
        }
      />

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        items={[
          { value: 'details', label: 'Basic details' },
          {
            value: 'fields',
            label: (
              <>
                Fields <Tag tone="mute">{t.fields.length}</Tag>
              </>
            ),
          },
        ]}
      />

      {tab === 'details' && (
        <Card className="max-w-[860px]">
          <div className="flex flex-col gap-4 pt-4">
            {detailsStatus && (
              <Alert variant={detailsStatus.type} onClose={() => setDetailsStatus(null)}>
                {detailsStatus.message}
              </Alert>
            )}
            <Input
              label="Title"
              disabled={!canManage}
              value={details.title}
              onChange={(e) => setDetails({ ...details, title: e.target.value })}
            />
            <Input
              label="Document type"
              className="font-mono"
              disabled={!canManage}
              value={details.documentType}
              onChange={(e) =>
                setDetails({ ...details, documentType: e.target.value.toUpperCase() })
              }
            />
            <Textarea
              label="Description — what the agent should know about this document"
              rows={5}
              disabled={!canManage}
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
            />
          </div>
          <div className="border-line-2 mt-5 flex justify-end gap-2 border-t pt-4">
            {canManage && (
              <Button
                variant="secondary"
                disabled={!detailsDirty || !details.title.trim() || !details.documentType.trim()}
                isLoading={isSavingDetails}
                onClick={() => void saveDetails()}
              >
                Save details
              </Button>
            )}
            <Button onClick={() => setTab('fields')}>Next: fields</Button>
          </div>
        </Card>
      )}

      {tab === 'fields' && (
        <Card
          padded={false}
          title="Fields"
          description="A field can match any number of fields on other skeletons. Matching is one-way — only this document is flagged when values disagree. Changes apply to documents added to journeys from now on; documents already in journeys keep the fields they were created with."
        >
          <Table fixed className="min-w-[760px]">
            <thead>
              <tr>
                <Th className="w-[190px]">Field name</Th>
                <Th className="w-[130px]">Type</Th>
                <Th>Matches with</Th>
                <Th className="w-[110px]">Matched by</Th>
                {canManage && <Th className="w-[104px]" />}
              </tr>
            </thead>
            <tbody>
              {t.fields.map((field) => (
                <Tr key={field.id}>
                  <Td>
                    {canManage ? (
                      <FieldNameInput
                        field={field}
                        onRename={(name) =>
                          void run(() =>
                            documentSkeletonService.updateField(t.id, field.id, { name }),
                          )
                        }
                      />
                    ) : (
                      <span className="font-medium">{field.name}</span>
                    )}
                  </Td>
                  <Td>
                    {canManage ? (
                      <Select
                        aria-label={`Type of ${field.name}`}
                        value={field.type}
                        options={typeOptions}
                        onChange={(e) =>
                          void run(() =>
                            documentSkeletonService.updateField(t.id, field.id, {
                              type: e.target.value as FieldType,
                            }),
                          )
                        }
                      />
                    ) : (
                      <span className="text-ink-70 font-mono text-xs">{field.type}</span>
                    )}
                  </Td>
                  <Td>
                    {field.matches.length ? (
                      <div className="flex flex-col gap-[5px]">
                        {field.matches.map((m) => (
                          <div key={m.fieldId} className="flex min-w-0 items-center gap-1.5">
                            <span
                              className="min-w-0 flex-1 truncate text-[12.5px]"
                              title={`${m.documentSkeletonTitle} · ${m.fieldName}`}
                            >
                              {m.documentSkeletonTitle} · {m.fieldName}
                            </span>
                            {canManage && (
                              <button
                                type="button"
                                aria-label="Remove match rule"
                                className="text-accent hover:text-ink cursor-pointer px-1 text-[11.5px]"
                                onClick={() =>
                                  void run(() =>
                                    documentSkeletonService.removeMatch(t.id, field.id, m.fieldId),
                                  )
                                }
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-ink-45 text-[12.5px]">No match rule</span>
                    )}
                  </Td>
                  <Td className="text-ink-45 text-[12.5px]">
                    {field.incomingCount ? formatUtil.plural(field.incomingCount, 'field') : '—'}
                  </Td>
                  {canManage && (
                    <Td className="pl-0 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => openMatch(field.id)}>
                        Match
                      </Button>
                      <Button
                        variant="quiet"
                        size="sm"
                        aria-label={`Remove ${field.name}`}
                        onClick={() => setRemoveField(field)}
                      >
                        ✕
                      </Button>
                    </Td>
                  )}
                </Tr>
              ))}
              {!t.fields.length && (
                <tr>
                  <Td colSpan={canManage ? 5 : 4} className="text-ink-45 text-[12.5px]">
                    No fields yet{canManage ? ' — add the first one below.' : '.'}
                  </Td>
                </tr>
              )}
              {canManage && (
                <tr>
                  <Td>
                    <Input
                      compact
                      aria-label="New field name"
                      placeholder="New field name"
                      value={newField.name}
                      onChange={(e) => {
                        setNewField({ ...newField, name: e.target.value });
                        setNewFieldError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && void addField()}
                    />
                  </Td>
                  <Td>
                    <Select
                      aria-label="New field type"
                      value={newField.type}
                      options={typeOptions}
                      onChange={(e) =>
                        setNewField({ ...newField, type: e.target.value as FieldType })
                      }
                    />
                  </Td>
                  <Td colSpan={3}>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={!newField.name.trim()}
                        onClick={() => void addField()}
                      >
                        + Add field
                      </Button>
                      {newFieldError && <span className="text-flag text-xs">{newFieldError}</span>}
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="border-line-2 bg-wash text-ink-70 border-t px-[18px] py-3.5 text-[12.5px]">
            {withRules} of {t.fields.length} fields have match rules ·{' '}
            {formatUtil.plural(ruleCount, 'rule')}
          </div>
        </Card>
      )}

      <MatchModal
        field={t.fields.find((f) => f.id === matchFor) ?? null}
        candidates={candidates}
        onClose={() => setMatchFor(null)}
        onAdd={async (matchFieldId) =>
          apply(await documentSkeletonService.addMatch(t.id, matchFor!, matchFieldId))
        }
        onRemove={async (matchFieldId) =>
          apply(await documentSkeletonService.removeMatch(t.id, matchFor!, matchFieldId))
        }
      />
      <ConfirmDialog
        open={removeField !== null}
        title={`Remove “${removeField?.name ?? ''}”?`}
        description="Its match rules and any rules on other skeletons pointing at it are removed too. Documents already in journeys are not affected."
        confirmLabel="Remove field"
        onClose={() => setRemoveField(null)}
        onConfirm={async () =>
          apply(await documentSkeletonService.removeField(t.id, removeField!.id))
        }
      />
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete ${t.title}?`}
        description="It can't be added to journeys any more. Documents already in journeys keep their fields and values."
        confirmLabel="Delete skeleton"
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await documentSkeletonService.remove(t.id);
          showToast('Skeleton deleted');
          navigate(PATHS.DOCUMENT_SKELETONS);
        }}
      />
    </div>
  );
};

export default DocumentSkeletonDetailPage;
