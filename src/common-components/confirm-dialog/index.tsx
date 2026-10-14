import { type ReactNode, useState } from 'react';
import errorUtil from '../../utils/error';
import Alert from '../alert';
import Button from '../button';
import Modal from '../modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

// Destructive-action confirmation; shows the error inline if the action fails
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    setError('');
    onClose();
  };

  const confirm = async () => {
    setIsWorking(true);
    setError('');
    try {
      await onConfirm();
      close();
    } catch (err) {
      setError(errorUtil.getMessage(err));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      width="sm"
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={isWorking} onClick={() => void confirm()}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {error && <Alert variant="error">{error}</Alert>}
    </Modal>
  );
};

export default ConfirmDialog;
