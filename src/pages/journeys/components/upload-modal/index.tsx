import { useState } from 'react';
import Alert from '../../../../common-components/alert';
import Button from '../../../../common-components/button';
import Dropzone from '../../../../common-components/dropzone';
import Modal from '../../../../common-components/modal';
import ProgressBar from '../../../../common-components/progress-bar';
import documentService from '../../../../services/document';
import type { DocumentSummary } from '../../../../types/journey';
import errorUtil from '../../../../utils/error';
import formatUtil from '../../../../utils/format';

interface UploadModalProps {
  document: DocumentSummary | null;
  segmentName: string;
  onClose: () => void;
  onUploaded: () => void;
}

// Collects one or more files, then uploads them together as one document
const UploadModal = ({ document, segmentName, onClose, onUploaded }: UploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  const close = () => {
    if (progress !== null) return;
    setFiles([]);
    setError('');
    onClose();
  };

  const upload = async () => {
    if (!document || !files.length) return;
    setError('');
    setProgress(0);
    try {
      await documentService.uploadFiles(document.id, files, setProgress);
      setProgress(null);
      setFiles([]);
      onUploaded();
      onClose();
    } catch (err) {
      setProgress(null);
      setError(errorUtil.getMessage(err));
    }
  };

  const total = files.reduce((sum, f) => sum + f.size, 0);
  const busy = progress !== null;

  return (
    <Modal
      open={document !== null}
      onClose={close}
      kicker={segmentName}
      title={`Upload — ${document?.title ?? ''}`}
      description={`Add one file or several. The agent reads them together as a single ${document?.title ?? 'document'} — a multi-part scan, separate pages, or the original plus an amendment.`}
      footerStart={
        files.length
          ? `${formatUtil.plural(files.length, 'file')} · ${formatUtil.fileSize(total)}${busy ? ' · uploading…' : ''}`
          : 'No files yet'
      }
      footer={
        <>
          <Button variant="secondary" disabled={busy} onClick={close}>
            Cancel
          </Button>
          <Button disabled={!files.length} isLoading={busy} onClick={() => void upload()}>
            {files.length > 1 ? `Upload & extract ${files.length} files` : 'Upload & extract'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {error && <Alert variant="error">{error}</Alert>}
        <Dropzone
          disabled={busy}
          onFiles={(picked) => setFiles((current) => [...current, ...picked])}
        />
        {files.length > 0 && (
          <div className="border-line max-h-[260px] overflow-y-auto rounded-lg border">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="border-line-2 flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0"
              >
                <div className="border-line bg-accent-soft text-accent-600 grid h-[38px] w-[38px] shrink-0 place-items-center rounded-md border font-mono text-[10px] font-medium">
                  {formatUtil.fileExt(file.name)}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                  <div className="flex items-baseline gap-2">
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                      {file.name}
                    </span>
                    <span
                      className={`shrink-0 text-[11.5px] ${busy ? 'text-ink-45' : 'text-accent-600'}`}
                    >
                      {busy ? `Uploading ${progress}%` : 'Ready'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <ProgressBar value={busy ? (progress ?? 0) : 100} done={!busy} />
                    </div>
                    <span className="text-ink-45 w-[58px] shrink-0 text-right font-mono text-[11px]">
                      {formatUtil.fileSize(file.size)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="quiet"
                  size="sm"
                  disabled={busy}
                  aria-label={`Remove ${file.name}`}
                  onClick={() => setFiles((current) => current.filter((_, j) => j !== i))}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UploadModal;
