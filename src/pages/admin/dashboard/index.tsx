import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import Button from '../../../common-components/button';
import Card from '../../../common-components/card';
import EmptyState from '../../../common-components/empty-state';
import Input from '../../../common-components/input';
import Loader from '../../../common-components/loader';
import Modal from '../../../common-components/modal';
import PageHeader from '../../../common-components/page-header';
import Stat from '../../../common-components/stat';
import { Table, Td, Th, Tr } from '../../../common-components/table';
import Tag from '../../../common-components/tag';
import useRequest from '../../../hooks/use-request';
import { toPath } from '../../../routes/paths';
import adminService from '../../../services/admin';
import errorUtil, { type FieldErrors } from '../../../utils/error';
import formatUtil from '../../../utils/format';

const EMPTY = { name: '', adminUsername: '', adminPassword: '' };

const AdminDashboardPage = () => {
  const stats = useRequest(() => adminService.stats(), []);
  const companies = useRequest(() => adminService.listCompanies(), []);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    setOpen(false);
    setForm(EMPTY);
    setError('');
    setFieldErrors({});
  };

  const create = async (event?: FormEvent) => {
    event?.preventDefault();
    setIsSubmitting(true);
    setError('');
    setFieldErrors({});
    try {
      await adminService.createCompany(form);
      await Promise.all([companies.reload(), stats.reload()]);
      close();
    } catch (err) {
      setError(errorUtil.getMessage(err));
      setFieldErrors(errorUtil.getFieldErrors(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const s = stats.data;

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Every company on the platform. Each company starts with one admin who manages its own users."
        actions={<Button onClick={() => setOpen(true)}>New company</Button>}
      />

      <div className="border-line bg-paper shadow-card mb-5 grid grid-cols-2 gap-4 rounded-lg border p-[18px] sm:grid-cols-3 lg:grid-cols-6">
        <Stat value={s?.companies ?? '—'} label="Companies" />
        <Stat value={s?.activeCompanies ?? '—'} label="Active" tone="ok" />
        <Stat value={s?.users ?? '—'} label="Users" />
        <Stat value={s?.journeys ?? '—'} label="Journeys" />
        <Stat value={s?.documents ?? '—'} label="Documents" />
        <Stat value={s?.files ?? '—'} label="Files uploaded" />
      </div>

      {companies.isLoading ? (
        <Loader fullScreen />
      ) : companies.error ? (
        <Alert variant="error">{errorUtil.getMessage(companies.error)}</Alert>
      ) : !companies.data?.length ? (
        <EmptyState
          title="No companies yet"
          description="Create the first company and its admin account."
          action={<Button onClick={() => setOpen(true)}>New company</Button>}
        />
      ) : (
        <Card padded={false}>
          <Table>
            <thead>
              <tr>
                <Th>Company</Th>
                <Th>Users</Th>
                <Th>Journeys</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {companies.data.map((company) => (
                <Tr key={company.id}>
                  <Td className="font-medium">{company.name}</Td>
                  <Td>{company.userCount}</Td>
                  <Td>{company.journeyCount}</Td>
                  <Td>
                    <Tag tone={company.isActive ? 'ok' : 'out'}>
                      {company.isActive ? 'Active' : 'Disabled'}
                    </Tag>
                  </Td>
                  <Td className="text-ink-70 text-[12.5px]">
                    {formatUtil.date(company.createdAt)}
                  </Td>
                  <Td className="text-right">
                    <Link to={toPath.adminCompany(company.id)}>
                      <Button variant="secondary" size="sm">
                        Open
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <Modal
        open={open}
        onClose={close}
        width="sm"
        title="New company"
        description="The admin can sign in straight away and add the rest of the team."
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button
              isLoading={isSubmitting}
              disabled={
                !form.name.trim() ||
                form.adminUsername.trim().length < 3 ||
                form.adminPassword.length < 8
              }
              onClick={() => void create()}
            >
              Create company
            </Button>
          </>
        }
      >
        <form onSubmit={create} noValidate className="flex flex-col gap-3.5">
          {error && <Alert variant="error">{error}</Alert>}
          <Input
            label="Company name"
            placeholder="e.g. Meridian Shipping"
            value={form.name}
            error={fieldErrors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Admin username"
            placeholder="e.g. meridian.admin"
            autoComplete="off"
            value={form.adminUsername}
            error={fieldErrors.adminUsername}
            onChange={(e) => setForm({ ...form, adminUsername: e.target.value })}
          />
          <Input
            label="Admin password"
            type="text"
            autoComplete="off"
            hint="At least 8 characters. Share it with the admin securely."
            value={form.adminPassword}
            error={fieldErrors.adminPassword}
            onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
          />
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
