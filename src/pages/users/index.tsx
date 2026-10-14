import { useState } from 'react';
import Alert from '../../common-components/alert';
import Button from '../../common-components/button';
import Card from '../../common-components/card';
import ConfirmDialog from '../../common-components/confirm-dialog';
import CreateUserModal from '../../common-components/create-user-modal';
import Loader from '../../common-components/loader';
import PageHeader from '../../common-components/page-header';
import ResetPasswordModal from '../../common-components/reset-password-modal';
import Select from '../../common-components/select';
import { Table, Td, Th, Tr } from '../../common-components/table';
import Tag from '../../common-components/tag';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import useRequest from '../../hooks/use-request';
import userService from '../../services/user';
import { COMPANY_ROLES, type CompanyRole, type User } from '../../types/user';
import errorUtil from '../../utils/error';
import formatUtil from '../../utils/format';

const roleOptions = COMPANY_ROLES.map((r) => ({ value: r, label: formatUtil.roleLabel(r) }));

const ROLE_HELP: { role: CompanyRole; text: string }[] = [
  { role: 'admin', text: 'Everything, including users' },
  { role: 'skeleton_designer', text: 'Builds skeletons and match rules' },
  { role: 'operations', text: 'Runs journeys and uploads files' },
  { role: 'viewer', text: 'Read-only' },
];

const UsersPage = () => {
  const { user: me } = useAuth();
  const { showToast } = useToast();
  const users = useRequest(() => userService.list(), []);

  const [addOpen, setAddOpen] = useState(false);
  const [resetFor, setResetFor] = useState<User | null>(null);
  const [deleteFor, setDeleteFor] = useState<User | null>(null);

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      await users.reload();
      showToast(success);
    } catch (err) {
      showToast(errorUtil.getMessage(err), 'error');
    }
  };

  return (
    <div>
      <PageHeader
        title="Users & roles"
        description="Each user has one role. Changes take effect on their next request."
        actions={<Button onClick={() => setAddOpen(true)}>Add user</Button>}
      />

      <div className="text-ink-70 mb-4 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]">
        {ROLE_HELP.map(({ role, text }) => (
          <span key={role}>
            <span className="text-ink font-medium">{formatUtil.roleLabel(role)}</span> — {text}
          </span>
        ))}
      </div>

      {users.isLoading ? (
        <Loader fullScreen />
      ) : users.error ? (
        <Alert variant="error">{errorUtil.getMessage(users.error)}</Alert>
      ) : (
        <Card padded={false}>
          <Table>
            <thead>
              <tr>
                <Th className="w-[220px]">Username</Th>
                <Th className="w-[210px]">Role</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {users.data?.map((user) => {
                const isMe = user.id === me?.id;
                return (
                  <Tr key={user.id}>
                    <Td className="font-mono text-[12.5px]">
                      {user.username}
                      {isMe && (
                        <span className="text-ink-45 ml-2 font-sans text-[11.5px]">(you)</span>
                      )}
                    </Td>
                    <Td>
                      <Select
                        aria-label={`Role for ${user.username}`}
                        value={user.role}
                        disabled={isMe}
                        options={roleOptions}
                        onChange={(e) =>
                          void run(
                            () =>
                              userService.update(user.id, { role: e.target.value as CompanyRole }),
                            'Role updated',
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Tag tone={user.isActive ? 'ok' : 'out'}>
                        {user.isActive ? 'Active' : 'Disabled'}
                      </Tag>
                    </Td>
                    <Td className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => setResetFor(user)}>
                        Reset password
                      </Button>
                      {!isMe && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              void run(
                                () => userService.update(user.id, { isActive: !user.isActive }),
                                user.isActive ? 'User disabled' : 'User enabled',
                              )
                            }
                          >
                            {user.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="quiet"
                            size="sm"
                            aria-label="Delete user"
                            onClick={() => setDeleteFor(user)}
                          >
                            ✕
                          </Button>
                        </>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}

      <CreateUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={async (payload) => {
          await userService.create(payload);
          await users.reload();
          showToast(`${payload.username} added`);
        }}
      />
      <ResetPasswordModal
        username={resetFor?.username ?? null}
        onClose={() => setResetFor(null)}
        onReset={async (password) => {
          await userService.resetPassword(resetFor!.id, password);
          showToast('Password updated');
        }}
      />
      <ConfirmDialog
        open={deleteFor !== null}
        title={`Delete ${deleteFor?.username ?? ''}?`}
        description="They lose access immediately. Files they uploaded stay in their journeys."
        onClose={() => setDeleteFor(null)}
        onConfirm={async () => {
          await userService.remove(deleteFor!.id);
          await users.reload();
          showToast('User deleted');
        }}
      />
    </div>
  );
};

export default UsersPage;
