import { type FormEvent, useEffect, useState } from 'react';
import Alert from '../../../../common-components/alert';
import Button from '../../../../common-components/button';
import Input from '../../../../common-components/input';
import Modal from '../../../../common-components/modal';
import Textarea from '../../../../common-components/textarea';
import type { JourneyPayload } from '../../../../types/journey';
import errorUtil from '../../../../utils/error';

interface JourneyFormModalProps {
  open: boolean;
  initial?: { title: string; description: string | null };
  onClose: () => void;
  onSubmit: (payload: JourneyPayload) => Promise<unknown>;
}

// Create and edit share this form
const JourneyFormModal = ({ open, initial, onClose, onSubmit }: JourneyFormModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setDescription(initial?.description ?? '');
      setError('');
    }
  }, [open, initial?.title, initial?.description]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || null });
      onClose();
    } catch (err) {
      setError(errorUtil.getMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="sm"
      title={initial ? 'Edit journey' : 'New journey'}
      description={initial ? undefined : "You'll add segments and pick documents next."}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!title.trim()} isLoading={isSubmitting} onClick={() => void submit()}>
            {initial ? 'Save' : 'Create journey'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="Title"
          placeholder="e.g. FCL Export — Chennai → Hamburg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          label="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
};

export default JourneyFormModal;
