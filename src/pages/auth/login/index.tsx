import { type FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import { BrandMark } from '../../../common-components/app-header';
import Button from '../../../common-components/button';
import Input from '../../../common-components/input';
import Tag from '../../../common-components/tag';
import appConfig from '../../../config';
import { useAuth } from '../../../context/auth';
import { PATHS } from '../../../routes/paths';
import errorUtil, { type FieldErrors } from '../../../utils/error';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname;

  const [form, setForm] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to={PATHS.HOME} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const session = await login(form);
      const home = session.role === 'super_admin' ? PATHS.ADMIN : PATHS.JOURNEYS;
      navigate(from && from !== PATHS.HOME ? from : home, { replace: true });
    } catch (err) {
      setError(errorUtil.getMessage(err));
      setFieldErrors(errorUtil.getFieldErrors(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-paper grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <div className="border-line bg-wash hidden flex-col justify-between border-r px-14 py-[54px] lg:flex">
        <div className="flex items-center gap-2.5">
          <BrandMark size={26} />
          <span className="text-[17px] font-semibold tracking-[-0.02em]">{appConfig.appName}</span>
        </div>
        <div className="max-w-[520px]">
          <Tag tone="ok" className="mb-[18px]">
            Documents matching agent
          </Tag>
          <h1 className="mb-[18px] text-[52px] leading-[1.04]">
            Every document in the journey, reconciled.
          </h1>
          <p className="text-ink-70 max-w-[450px] text-[16.5px] text-pretty">
            Define each document once as a skeleton. Lay out a journey in segments, drop the
            skeletons in, and the agent matches every field against where it came from.
          </p>
        </div>
        <div className="text-ink-45 text-[12.5px]">Freight · trade finance · claims</div>
      </div>

      <div className="grid place-items-center p-8 sm:p-12">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex w-full max-w-[352px] flex-col gap-[15px]"
        >
          <div className="mb-1 flex items-center gap-2.5 lg:hidden">
            <BrandMark size={24} />
            <span className="text-base font-semibold">{appConfig.appName}</span>
          </div>
          <div>
            <h2 className="mb-1.5 text-2xl">Sign in</h2>
            <p className="text-ink-45 text-[13.5px]">
              Welcome back. Accounts are created by your admin.
            </p>
          </div>
          {error && <Alert variant="error">{error}</Alert>}
          <Input
            label="Username"
            autoComplete="username"
            autoFocus
            value={form.username}
            error={fieldErrors.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            error={fieldErrors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
