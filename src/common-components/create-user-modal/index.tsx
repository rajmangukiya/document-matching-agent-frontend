import { type FormEvent, useState } from 'react';
import Alert from '../alert';
import Button from '../button';
import ChoiceChips from '../choice-chips';
import Input from '../input';
import Modal from '../modal';
import { COMPANY_ROLES, type CompanyRole, type CreateUserPayload } from '../../types/user';
import errorUtil, { type FieldErrors } from '../../utils/error';
import formatUtil from '../../utils/format';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateUserPayload) => Promise<unknown>;
  defaultRole?: CompanyRole;
}

const EMPTY = { username: '', password: '', confirm: '' };

// Shared by the company admin's Users page and the super admin's company page
const CreateUserModal = ({
  open,
  onClose,
  onCreate,
  defaultRole = 'viewer',
}: CreateUserModalProps) => {
  const [form, setForm] = useState(EMPTY);
  const [role, setRole] = useState<CompanyRole>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checks = [
    { ok: form.password.length >= 8, label: 'At least 8 characters' },
    { ok: Boolean(form.password) && form.password === form.confirm, label: 'Passwords match' },
  ];
  const isValid = form.username.trim().length >= 3 && checks.every((c) => c.ok);

  const close = () => {
    setForm(EMPTY);
    setRole(defaultRole);
    setFieldErrors({});
    setError('');
    onClose();
  };

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    setError('');
    setFieldErrors({});
    try {
      await onCreate({ username: form.username.trim(), password: form.password, role });
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
      width="sm"
      title="Add user"
      description="They sign in with this username and password."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button disabled={!isValid} isLoading={isSubmitting} onClick={() => void submit()}>
            Add user
          </Button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="Username"
          placeholder="e.g. m.verhoeven"
          autoComplete="off"
          value={form.username}
          error={fieldErrors.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={form.password}
          error={fieldErrors.password}
          labelAction={
            <button
              type="button"
              className="text-accent cursor-pointer text-xs hover:underline"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <div className="-mt-1 flex flex-col gap-1">
          {checks.map((check) => (
            <div
              key={check.label}
              className={`flex items-center gap-[7px] text-xs ${check.ok ? 'text-accent-600' : 'text-ink-45'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${check.ok ? 'bg-accent' : 'bg-mute'}`} />
              {check.label}
            </div>
          ))}
        </div>
        <ChoiceChips
          label="Role"
          value={role}
          onChange={setRole}
          options={COMPANY_ROLES.map((r) => ({ value: r, label: formatUtil.roleLabel(r) }))}
        />
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
};

export default CreateUserModal;
