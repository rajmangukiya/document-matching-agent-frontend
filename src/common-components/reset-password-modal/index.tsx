import { useState } from 'react';
import Alert from '../alert';
import Button from '../button';
import Input from '../input';
import Modal from '../modal';
import errorUtil from '../../utils/error';

interface ResetPasswordModalProps {
  username: string | null;
  onClose: () => void;
  onReset: (password: string) => Promise<unknown>;
}

const ResetPasswordModal = ({ username, onClose, onReset }: ResetPasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const submit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await onReset(password);
      close();
    } catch (err) {
      setError(errorUtil.getMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={username !== null}
      onClose={close}
      width="sm"
      title={`Reset password — ${username ?? ''}`}
      description="They'll be signed out everywhere and use the new password next time."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            disabled={password.length < 8}
            isLoading={isSubmitting}
            onClick={() => void submit()}
          >
            Set password
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="New password"
          type="text"
          autoComplete="off"
          hint="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && password.length >= 8 && void submit()}
        />
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
