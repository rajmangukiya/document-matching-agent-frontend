import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import Button from '../../../common-components/button';
import Card from '../../../common-components/card';
import Dropzone from '../../../common-components/dropzone';
import Loader from '../../../common-components/loader';
import PageHeader from '../../../common-components/page-header';
import ProgressBar from '../../../common-components/progress-bar';
import Stat from '../../../common-components/stat';
import { Table, Td, Th, Tr } from '../../../common-components/table';
import Tag from '../../../common-components/tag';
import { useAuth } from '../../../context/auth';
import { useToast } from '../../../context/toast';
import usePolling from '../../../hooks/use-polling';
import useRequest from '../../../hooks/use-request';
import { PATHS, toPath } from '../../../routes/paths';
import documentService from '../../../services/document';
import type { DocumentDetail, MatchCheck } from '../../../types/document';
import { Permission } from '../../../types/permission';
import errorUtil from '../../../utils/error';
import formatUtil from '../../../utils/format';
import FieldValueCell from '../components/field-value-cell';

const checkDot = (check: MatchCheck) =>
  check.status === 'matched' ? 'bg-accent' : check.status === 'not_matched' ? 'bg-flag' : 'bg-mute';

const checkColor = (check: MatchCheck) =>
  check.status === 'not_matched'
    ? 'text-flag'
    : check.status === 'matched' || check.status === 'self_missing'
      ? 'text-ink-70'
      : 'text-ink-45';

const DocumentDetailPage = () => {
  const documentId = useParams().id ?? '';
  const { can } = useAuth();
  const { showToast } = useToast();
  const canEdit = can(Permission.MANAGE_DOCUMENT_DATA);

  const document = useRequest(() => documentService.get(documentId), [documentId]);
  usePolling(document.reload, document.data?.status === 'extracting');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  if (document.isLoading) return <Loader fullScreen />;
  if (document.error || !document.data)
    return <Alert variant="error">{errorUtil.getMessage(document.error)}</Alert>;
  const d = document.data;
  const apply = (next: DocumentDetail) => document.setData(next);

  const upload = async (files: File[]) => {
    setUploadProgress(0);
    try {
      apply(await documentService.uploadFiles(d.id, files, setUploadProgress));
    } catch (err) {
      showToast(errorUtil.getMessage(err), 'error');
    } finally {
      setUploadProgress(null);
    }
  };

  const run = async (action: () => Promise<DocumentDetail>) => {
    try {
      apply(await action());
    } catch (err) {
      showToast(errorUtil.getMessage(err), 'error');
    }
  };

  const c = d.counts;
  const fileCount = formatUtil.plural(d.files.length, 'file');
  // Show which segment a check points at when the skeleton appears more than once
  const multiTarget = (field: DocumentDetail['fields'][number], check: MatchCheck) =>
    field.checks.filter(
      (x) =>
        x.targetDocumentSkeletonTitle === check.targetDocumentSkeletonTitle &&
        x.targetFieldName === check.targetFieldName,
    ).length > 1;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Journeys', to: PATHS.JOURNEYS },
          { label: formatUtil.journeyCode(d.journey.id), to: toPath.journey(d.journey.id) },
          { label: d.segment.name },
        ]}
        title={d.title}
        description={
          <span className="text-ink-45 font-mono text-xs">
            {d.documentType} · {d.journey.title}
          </span>
        }
        actions={
          <div className="flex gap-[18px]">
            <Stat value={c ? `${c.extracted}/${c.total}` : '—'} label="Extracted" />
            <Stat value={c ? c.notExtracted : '—'} label="Not extracted" tone="mute" />
            <Stat value={c ? c.matched : '—'} label="Matched" tone="ok" />
            <Stat value={c ? c.notMatched : '—'} label="Not matched" tone="warn" />
          </div>
        }
      />

      <div className="flex flex-wrap-reverse items-end gap-4">
        <Card
          padded={false}
          className="min-w-0 flex-[999_1_560px]"
          title="Extracted fields"
          description={
            c
              ? `${c.extracted} of ${c.total} fields extracted from ${fileCount}.${canEdit ? ' Missing fields can be entered by hand.' : ''}`
              : 'Fields appear here once extraction finishes.'
          }
        >
          {d.status === 'extracting' && (
            <div className="border-line-2 flex flex-col gap-[9px] border-t px-[17px] py-[22px]">
              <div className="text-[13px]">Extracting fields from {fileCount}…</div>
              <ProgressBar />
            </div>
          )}
          {d.status === 'pending' && (
            <div className="border-line-2 text-ink-45 border-t px-[17px] py-[22px] text-[13px]">
              Nothing uploaded yet. Add files on the right — fields are extracted and matched
              automatically.
            </div>
          )}
          {d.status === 'failed' && (
            <div className="border-line-2 border-t px-[17px] py-4">
              <Alert variant="error">
                Extraction failed. Upload the files again, or remove one, to retry.
              </Alert>
            </div>
          )}
          {d.status === 'ready' && (
            <Table fixed className="min-w-[640px]">
              <thead>
                <tr>
                  <Th className="w-[24%]">Field</Th>
                  <Th className="w-[28%]">Extracted value</Th>
                  <Th>Matches with</Th>
                  <Th className="w-[112px]">Result</Th>
                </tr>
              </thead>
              <tbody>
                {d.fields.map((field) => {
                  const result = formatUtil.fieldResult(field.result);
                  return (
                    <Tr key={field.id}>
                      <Td className="align-top">
                        <div className="font-medium text-pretty">{field.name}</div>
                        <div className="text-ink-45 font-mono text-[11.5px]">{field.type}</div>
                      </Td>
                      <Td className="align-top">
                        <FieldValueCell
                          field={field}
                          canEdit={canEdit}
                          onSave={(value) =>
                            run(() => documentService.setFieldValue(d.id, field.id, value))
                          }
                        />
                      </Td>
                      <Td className="align-top">
                        {!field.checks.length ? (
                          <span className="text-ink-45 text-[12.5px]">No match rule</span>
                        ) : (
                          <div className="flex flex-col gap-[7px]">
                            {field.checks.map((check, i) => (
                              <div key={i} className="flex min-w-0 items-baseline gap-2">
                                <span
                                  className={`h-1.5 w-1.5 shrink-0 -translate-y-px rounded-full ${checkDot(check)}`}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-ink-70 text-[12.5px] text-pretty">
                                    {check.targetDocumentSkeletonTitle} · {check.targetFieldName}
                                    {check.targetSegmentName && multiTarget(field, check) && (
                                      <span className="text-ink-45">
                                        {' '}
                                        — {check.targetSegmentName}
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    className={`truncate font-mono text-[11.5px] ${checkColor(check)}`}
                                  >
                                    {formatUtil.checkText(check.status, check.value)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Td>
                      <Td className="align-top">
                        <Tag tone={result.tone}>{result.label}</Tag>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          <div className="border-line-2 bg-wash text-ink-45 border-t px-[17px] py-3 text-[12.5px] text-pretty">
            One-way: only this document&apos;s own match rules are checked — the documents it points
            to are never flagged. Matching ignores spaces and letter case.
          </div>
        </Card>

        <Card
          className="min-w-0 flex-[1_1_260px]"
          title="Files"
          actions={<span className="text-ink-45 text-xs">{fileCount}</span>}
        >
          <div className="flex flex-col gap-3">
            {d.files.map((file) => (
              <div key={file.id} className="flex items-center gap-2.5">
                <div className="border-line bg-accent-soft text-accent-600 grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md border font-mono text-[9.5px] font-medium">
                  {formatUtil.fileExt(file.originalName)}
                </div>
                <div className="min-w-0 flex-1">
                  <a
                    href={documentService.downloadUrl(d.id, file.id)}
                    className="text-ink hover:text-accent block truncate text-[12.5px] font-medium"
                    title={`Download ${file.originalName}`}
                  >
                    {file.originalName}
                  </a>
                  <div className="text-ink-45 text-[11px]">
                    {formatUtil.fileSize(file.sizeBytes)}
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="quiet"
                    size="sm"
                    aria-label={`Remove ${file.originalName}`}
                    onClick={() => void run(() => documentService.removeFile(d.id, file.id))}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            {canEdit &&
              (uploadProgress !== null ? (
                <div className="border-line bg-wash flex flex-col gap-2 rounded-lg border p-4">
                  <div className="text-[12.5px]">Uploading {uploadProgress}%…</div>
                  <ProgressBar value={uploadProgress} />
                </div>
              ) : (
                <Dropzone
                  compact
                  title={d.files.length ? 'Upload more files' : 'Upload files'}
                  hint="Drop or browse · re-extracts automatically"
                  onFiles={(files) => void upload(files)}
                />
              ))}
            {!canEdit && !d.files.length && (
              <div className="text-ink-45 text-[12.5px]">No files uploaded.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
