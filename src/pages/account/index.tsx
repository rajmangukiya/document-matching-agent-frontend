import { type FormEvent, useState } from 'react';
import Alert from '../../common-components/alert';
import Button from '../../common-components/button';
import Card from '../../common-components/card';
import Input from '../../common-components/input';
import PageHeader from '../../common-components/page-header';
import { useAuth } from '../../context/auth';
import authService from '../../services/auth';
import errorUtil, { type FieldErrors } from '../../utils/error';
import formatUtil from '../../utils/format';

const EMPTY_FORM = { currentPassword: '', newPassword: '' };

const AccountPage = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);

  if (!user) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await authService.changePassword(form);
      setForm(EMPTY_FORM);
      setStatus({
        type: 'success',
        message: 'Password changed. Your other sessions were signed out.',
      });
    } catch (err) {
      setStatus({ type: 'error', message: errorUtil.getMessage(err) });
      setFieldErrors(errorUtil.getFieldErrors(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoutAll = async () => {
    setIsSigningOutAll(true);
    try {
      await authService.logoutAll();
    } finally {
      await logout();
    }
  };

  const details = [
    ['Username', user.username],
    ['Role', formatUtil.roleLabel(user.role)],
    ['Company', user.company?.name ?? 'Platform'],
    ['Member since', formatUtil.date(user.createdAt)],
  ];

  return (
    <div className="max-w-[920px]">
      <PageHeader title="Account" description="Your sign-in details and password." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Profile">
          <dl className="divide-line-2 divide-y">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5 text-[13px]">
                <dt className="text-ink-45">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            isLoading={isSigningOutAll}
            onClick={() => void logoutAll()}
          >
            Sign out of all devices
          </Button>
        </Card>

        <Card title="Change password">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            {status && (
              <Alert variant={status.type} onClose={() => setStatus(null)}>
                {status.message}
              </Alert>
            )}
            <Input
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              error={fieldErrors.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              hint="At least 8 characters"
              value={form.newPassword}
              error={fieldErrors.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
            <Button type="submit" isLoading={isSubmitting} className="self-start">
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
