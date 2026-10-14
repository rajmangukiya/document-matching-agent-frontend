import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { PATHS } from '../../routes/paths';
import { Permission } from '../../types/permission';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const SidebarLink = ({ to, label, end }: NavItem) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex w-full items-center rounded-md px-[11px] py-2 text-[13.5px] font-medium hover:no-underline ${
        isActive ? 'bg-accent-soft text-accent-600' : 'text-ink-70 hover:bg-wash-2 hover:text-ink'
      }`
    }
  >
    {label}
  </NavLink>
);

const Group = ({ title, items }: { title: string; items: NavItem[] }) =>
  items.length ? (
    <div className="flex flex-col gap-[3px]">
      <div className="kicker px-[11px] pb-[7px]">{title}</div>
      {items.map((item) => (
        <SidebarLink key={item.to} {...item} />
      ))}
    </div>
  ) : null;

const Sidebar = () => {
  const { isSuperAdmin, can } = useAuth();

  const groups: { title: string; items: NavItem[] }[] = isSuperAdmin
    ? [{ title: 'Platform', items: [{ to: PATHS.ADMIN, label: 'Companies', end: false }] }]
    : [
        {
          title: 'Workspace',
          items: [
            { to: PATHS.JOURNEYS, label: 'Journeys' },
            { to: PATHS.SKELETONS, label: 'Document skeletons' },
          ],
        },
        {
          title: 'Admin',
          items: can(Permission.MANAGE_USERS) ? [{ to: PATHS.USERS, label: 'Users & roles' }] : [],
        },
      ];

  return (
    <nav className="border-line bg-wash flex flex-col gap-[22px] px-3 py-4 md:border-r">
      {groups.map((group) => (
        <Group key={group.title} {...group} />
      ))}
      <Group title="You" items={[{ to: PATHS.ACCOUNT, label: 'Account' }]} />
    </nav>
  );
};

export default Sidebar;
