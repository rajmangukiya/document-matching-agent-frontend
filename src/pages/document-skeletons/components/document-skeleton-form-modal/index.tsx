import { type FormEvent, useState } from 'react';
import Alert from '../../../../common-components/alert';
import Button from '../../../../common-components/button';
import Input from '../../../../common-components/input';
import Modal from '../../../../common-components/modal';
import Textarea from '../../../../common-components/textarea';
import type { DocumentSkeletonPayload } from '../../../../types/document-skeleton';
import errorUtil, { type FieldErrors } from '../../../../utils/error';

interface DocumentSkeletonFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: DocumentSkeletonPayload) => Promise<unknown>;
}

const EMPTY = { title: '', documentType: '', description: '' };

const DocumentSkeletonFormModal = ({ open, onClose, onSubmit }: DocumentSkeletonFormModalProps) => {
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    setForm(EMPTY);
    setError('');
    setFieldErrors({});
    onClose();
  };

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    setIsSubmitting(true);
    setError('');
    setFieldErrors({});
    try {
      await onSubmit({
        title: form.title.trim(),
        documentType: form.documentType.trim(),
        description: form.description.trim() || null,
      });
      close();
    } catch (err) {
      setError(errorUtil.getMessage(err));
      setFieldErrors(errorUtil.getFieldErrors(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="New skeleton"
      description="Describe the document. You'll add its fields and match rules next."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            isLoading={isSubmitting}
            disabled={!form.title.trim() || !form.documentType.trim()}
            onClick={() => void submit()}
          >
            Create skeleton
          </Button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="Title"
          placeholder="e.g. Bill of Lading"
          value={form.title}
          error={fieldErrors.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          label="Document type"
          placeholder="e.g. BOL_OCEAN"
          className="font-mono"
          value={form.documentType}
          error={fieldErrors.documentType}
          onChange={(e) => setForm({ ...form, documentType: e.target.value.toUpperCase() })}
        />
        <Textarea
          label="Description — what the agent should know about this document"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
};

export default DocumentSkeletonFormModal;
