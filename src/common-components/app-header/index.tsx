import { Link } from 'react-router-dom';
import appConfig from '../../config';
import { useAuth } from '../../context/auth';
import { PATHS } from '../../routes/paths';
import formatUtil from '../../utils/format';
import Button from '../button';

export const BrandMark = ({ size = 22 }: { size?: number }) => (
  <div
    className="bg-accent grid shrink-0 place-items-center rounded-md"
    style={{ width: size, height: size }}
    aria-hidden
  >
    <div className="rounded-[2px] bg-white" style={{ width: size * 0.32, height: size * 0.32 }} />
  </div>
);

const AppHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-line bg-paper flex items-center gap-4 border-b px-5 py-[11px]">
      <Link
        to={PATHS.HOME}
        className="text-ink mr-auto flex min-w-0 items-center gap-2.5 hover:no-underline"
      >
        <BrandMark />
        <span className="text-[15px] font-semibold tracking-[-0.02em]">{appConfig.appName}</span>
        {user?.company && (
          <span className="border-line text-ink-45 hidden truncate border-l pl-2.5 text-[13px] sm:inline">
            {user.company.name}
          </span>
        )}
      </Link>
      {user && (
        <div className="flex items-center gap-3.5">
          <span className="text-ink-45 hidden text-[13px] sm:inline">
            {user.username} · {formatUtil.roleLabel(user.role)}
          </span>
          <Button variant="secondary" size="sm" onClick={() => void logout()}>
            Sign out
          </Button>
          <Link
            to={PATHS.ACCOUNT}
            title="Account"
            className="bg-accent-soft text-accent-600 grid h-[30px] w-[30px] place-items-center rounded-full text-xs font-semibold hover:no-underline"
          >
            {formatUtil.initials(user.username)}
          </Link>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
