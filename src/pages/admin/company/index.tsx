import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import Button from '../../../common-components/button';
import Card from '../../../common-components/card';
import Input from '../../../common-components/input';
import Loader from '../../../common-components/loader';
import Modal from '../../../common-components/modal';
import PageHeader from '../../../common-components/page-header';
import Select from '../../../common-components/select';
import { Table, Td, Th, Tr } from '../../../common-components/table';
import Tag from '../../../common-components/tag';
import { useToast } from '../../../context/toast';
import useRequest from '../../../hooks/use-request';
import { PATHS } from '../../../routes/paths';
import adminService from '../../../services/admin';
import { COMPANY_ROLES, type CompanyRole, type User } from '../../../types/user';
import errorUtil from '../../../utils/error';
import formatUtil from '../../../utils/format';
import CreateUserModal from '../../../common-components/create-user-modal';
import ResetPasswordModal from '../../../common-components/reset-password-modal';

const roleOptions = COMPANY_ROLES.map((r) => ({ value: r, label: formatUtil.roleLabel(r) }));

const AdminCompanyPage = () => {
  const companyId = Number(useParams().id);
  const { showToast } = useToast();
  const company = useRequest(() => adminService.getCompany(companyId), [companyId]);

  const [addOpen, setAddOpen] = useState(false);
  const [resetFor, setResetFor] = useState<User | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [name, setName] = useState('');
  const [renameError, setRenameError] = useState('');

  if (company.isLoading) return <Loader fullScreen />;
  if (company.error || !company.data) {
    return <Alert variant="error">{errorUtil.getMessage(company.error)}</Alert>;
  }
  const c = company.data;

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      await company.reload();
      showToast(success);
    } catch (err) {
      showToast(errorUtil.getMessage(err), 'error');
    }
  };

  const rename = async () => {
    setRenameError('');
    try {
      await adminService.updateCompany(c.id, { name });
      await company.reload();
      setRenameOpen(false);
    } catch (err) {
      setRenameError(errorUtil.getMessage(err));
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Companies', to: PATHS.ADMIN }, { label: c.name }]}
        title={c.name}
        description={
          <span className="flex items-center gap-2">
            <Tag tone={c.isActive ? 'ok' : 'out'}>{c.isActive ? 'Active' : 'Disabled'}</Tag>
            Created {formatUtil.date(c.createdAt)}
          </span>
        }
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setName(c.name);
                setRenameOpen(true);
              }}
            >
              Rename
            </Button>
            <Button
              variant={c.isActive ? 'secondary' : 'primary'}
              onClick={() =>
                void run(
                  () => adminService.updateCompany(c.id, { isActive: !c.isActive }),
                  c.isActive ? 'Company disabled — its users are signed out' : 'Company enabled',
                )
              }
            >
              {c.isActive ? 'Disable company' : 'Enable company'}
            </Button>
          </>
        }
      />

      <Card
        padded={false}
        title="Users"
        description="One role per user. A company always keeps at least one active admin."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            Add user
          </Button>
        }
      >
        <Table>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th className="w-[200px]">Role</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {c.users.map((user) => (
              <Tr key={user.id}>
                <Td className="font-mono text-[12.5px]">{user.username}</Td>
                <Td>
                  <Select
                    aria-label={`Role for ${user.username}`}
                    value={user.role}
                    options={roleOptions}
                    onChange={(e) =>
                      void run(
                        () =>
                          adminService.updateUser(c.id, user.id, {
                            role: e.target.value as CompanyRole,
                          }),
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      void run(
                        () => adminService.updateUser(c.id, user.id, { isActive: !user.isActive }),
                        user.isActive ? 'User disabled' : 'User enabled',
                      )
                    }
                  >
                    {user.isActive ? 'Disable' : 'Enable'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <CreateUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={async (payload) => {
          await adminService.createUser(c.id, payload);
          await company.reload();
          showToast(`${payload.username} added`);
        }}
      />
      <ResetPasswordModal
        username={resetFor?.username ?? null}
        onClose={() => setResetFor(null)}
        onReset={async (password) => {
          await adminService.updateUser(c.id, resetFor!.id, { password });
          showToast('Password updated');
        }}
      />
      <Modal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        width="sm"
        title="Rename company"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button disabled={name.trim().length < 2} onClick={() => void rename()}>
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {renameError && <Alert variant="error">{renameError}</Alert>}
          <Input label="Company name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
};

export default AdminCompanyPage;
