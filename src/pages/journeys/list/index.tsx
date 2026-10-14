import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../../common-components/alert';
import Button from '../../../common-components/button';
import EmptyState from '../../../common-components/empty-state';
import Loader from '../../../common-components/loader';
import PageHeader from '../../../common-components/page-header';
import Tag from '../../../common-components/tag';
import { useAuth } from '../../../context/auth';
import useRequest from '../../../hooks/use-request';
import { toPath } from '../../../routes/paths';
import journeyService from '../../../services/journey';
import { Permission } from '../../../types/permission';
import errorUtil from '../../../utils/error';
import formatUtil from '../../../utils/format';
import JourneyFormModal from '../components/journey-form-modal';

const JourneysPage = () => {
  const { can } = useAuth();
  const navigate = useNavigate();
  const journeys = useRequest(() => journeyService.list(), []);
  const [createOpen, setCreateOpen] = useState(false);
  const canManage = can(Permission.MANAGE_JOURNEYS);

  return (
    <div>
      <PageHeader
        title="Journeys"
        description="A journey is split into segments. Each segment holds the document skeletons expected there — upload them as they arrive and match."
        actions={canManage && <Button onClick={() => setCreateOpen(true)}>New journey</Button>}
      />

      {journeys.isLoading ? (
        <Loader fullScreen />
      ) : journeys.error ? (
        <Alert variant="error">{errorUtil.getMessage(journeys.error)}</Alert>
      ) : !journeys.data?.length ? (
        <EmptyState
          title="No journeys yet"
          description="Create a journey, split it into segments, then add the documents each segment expects."
          action={canManage && <Button onClick={() => setCreateOpen(true)}>New journey</Button>}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
          {journeys.data.map((j) => {
            const status = formatUtil.journeyStatus(j.status);
            return (
              <Link
                key={j.id}
                to={toPath.journey(j.id)}
                className="group text-ink focus-visible:outline-accent block hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <div className="border-line bg-paper shadow-card group-hover:border-mute group-hover:shadow-lift flex h-full flex-col gap-[11px] rounded-lg border p-[17px] transition-all group-hover:-translate-y-px">
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-ink-45 font-mono text-[11.5px]">
                      {formatUtil.journeyCode(j.id)}
                    </span>
                    <Tag tone={status.tone}>{status.label}</Tag>
                  </div>
                  <div className="text-lg leading-tight font-semibold tracking-[-0.02em]">
                    {j.title}
                  </div>
                  <p className="text-ink-70 flex-1 text-[13px] text-pretty">
                    {j.description || 'No description.'}
                  </p>
                  <div className="border-line-2 flex gap-[22px] border-t pt-[11px]">
                    {[
                      [j.segmentCount, 'Segments'],
                      [j.documentCount, 'Documents'],
                      [j.uploadedCount, 'Uploaded'],
                    ].map(([value, label]) => (
                      <div key={label}>
                        <div className="text-base font-semibold">{value}</div>
                        <div className="kicker">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <JourneyFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (payload) => {
          const created = await journeyService.create(payload);
          navigate(toPath.journey(created.id));
        }}
      />
    </div>
  );
};

export default JourneysPage;
