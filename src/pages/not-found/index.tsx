import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
    <p className="kicker text-accent">404</p>
    <h1 className="text-2xl">Page not found</h1>
    <p className="text-ink-45 text-[13.5px]">The page you are looking for doesn&apos;t exist.</p>
    <Link to={PATHS.HOME} className="mt-2 text-sm font-medium">
      Go home
    </Link>
  </div>
);

export default NotFoundPage;
