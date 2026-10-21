import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import Button from '../../../common-components/button';
import Card from '../../../common-components/card';
import EmptyState from '../../../common-components/empty-state';
import Loader from '../../../common-components/loader';
import PageHeader from '../../../common-components/page-header';
import { Table, Td, Th, Tr } from '../../../common-components/table';
import Tag from '../../../common-components/tag';
import { useAuth } from '../../../context/auth';
import useRequest from '../../../hooks/use-request';
import { toPath } from '../../../routes/paths';
import documentSkeletonService from '../../../services/document-skeleton';
import { Permission } from '../../../types/permission';
import errorUtil from '../../../utils/error';
import formatUtil from '../../../utils/format';
import DocumentSkeletonFormModal from '../components/document-skeleton-form-modal';

const DocumentSkeletonsPage = () => {
  const { can } = useAuth();
  const navigate = useNavigate();
  const documentSkeletons = useRequest(() => documentSkeletonService.list(), []);
  const [createOpen, setCreateOpen] = useState(false);
  const canManage = can(Permission.MANAGE_DOCUMENT_SKELETONS);

  return (
    <div>
      <PageHeader
        title="Document skeletons"
        description="The shape of each document: its fields, their types, and which fields on other skeletons they must match. Journeys reuse these."
        actions={canManage && <Button onClick={() => setCreateOpen(true)}>New skeleton</Button>}
      />

      {documentSkeletons.isLoading ? (
        <Loader fullScreen />
      ) : documentSkeletons.error ? (
        <Alert variant="error">{errorUtil.getMessage(documentSkeletons.error)}</Alert>
      ) : !documentSkeletons.data?.length ? (
        <EmptyState
          title="No skeletons yet"
          description="Create a skeleton for each kind of document your journeys handle."
          action={canManage && <Button onClick={() => setCreateOpen(true)}>New skeleton</Button>}
        />
      ) : (
        <Card padded={false}>
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Document type</Th>
                <Th>Fields</Th>
                <Th>Match rules</Th>
                <Th>Used in</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {documentSkeletons.data.map((t) => (
                <Tr key={t.id}>
                  <Td className="font-medium">{t.title}</Td>
                  <Td className="text-ink-70 font-mono text-[11.5px]">{t.documentType}</Td>
                  <Td>{t.fieldCount}</Td>
                  <Td>
                    <Tag tone={t.ruleCount ? 'ok' : 'out'}>
                      {t.ruleCount ? `${t.ruleCount} rules` : 'None'}
                    </Tag>
                  </Td>
                  <Td className="text-ink-70 text-[12.5px]">
                    {t.journeyCount ? formatUtil.plural(t.journeyCount, 'journey') : 'Not used'}
                  </Td>
                  <Td className="text-right">
                    <Link to={toPath.documentSkeleton(t.id)}>
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

      <DocumentSkeletonFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (payload) => {
          const created = await documentSkeletonService.create(payload);
          navigate(toPath.documentSkeleton(created.id), { state: { tab: 'fields' } });
        }}
      />
    </div>
  );
};

export default DocumentSkeletonsPage;
