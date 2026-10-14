import { useNavigate } from 'react-router-dom';
import Button from '../../../../common-components/button';
import { Table, Td, Th, Tr } from '../../../../common-components/table';
import Tag from '../../../../common-components/tag';
import { toPath } from '../../../../routes/paths';
import type { DocumentSummary, SegmentWithDocuments } from '../../../../types/journey';
import formatUtil from '../../../../utils/format';

interface SegmentCardProps {
  segment: SegmentWithDocuments;
  index: number;
  canManage: boolean;
  canUpload: boolean;
  onAddDocument: () => void;
  onRename: () => void;
  onRemove: () => void;
  onUpload: (document: DocumentSummary) => void;
  onRemoveDocument: (document: DocumentSummary) => void;
}

const STATE_LABEL = {
  pending: 'Awaiting upload',
  extracting: 'Extracting…',
  failed: 'Extraction failed',
};

const dotColor = (doc: DocumentSummary) => {
  if (!doc.counts) return doc.fileCount ? 'bg-accent-line' : 'bg-mute';
  if (doc.counts.notMatched) return 'bg-flag';
  return doc.counts.notExtracted ? 'bg-accent-line' : 'bg-accent';
};

const SegmentCard = ({
  segment,
  index,
  canManage,
  canUpload,
  onAddDocument,
  onRename,
  onRemove,
  onUpload,
  onRemoveDocument,
}: SegmentCardProps) => {
  const navigate = useNavigate();

  return (
    <section className="border-line bg-paper shadow-card overflow-hidden rounded-lg border">
      <div className="border-line-2 flex flex-wrap items-center gap-3 border-b px-[17px] py-[13px]">
        <div className="bg-accent-soft text-accent-600 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-xs font-semibold">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="min-w-0 flex-[1_1_220px]">
          <div className="text-base font-semibold tracking-[-0.02em]">{segment.name}</div>
          <div className="text-ink-45 text-[12.5px]">
            {formatUtil.plural(segment.documents.length, 'document')}
          </div>
        </div>
        {canManage && (
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" onClick={onAddDocument}>
              + Add document
            </Button>
            <Button variant="ghost" size="sm" onClick={onRename}>
              Rename
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Remove
            </Button>
          </div>
        )}
      </div>

      {!segment.documents.length ? (
        <div className="text-ink-45 px-[17px] py-4 text-[12.5px]">
          No documents in this segment.{canManage && ' Add a skeleton to expect it here.'}
        </div>
      ) : (
        <Table fixed className="min-w-[720px]">
          <thead>
            <tr>
              <Th>Document</Th>
              <Th className="w-24">Extracted</Th>
              <Th className="w-[108px]">Not extracted</Th>
              <Th className="w-[88px]">Matched</Th>
              <Th className="w-[104px]">Not matched</Th>
              <Th className="w-[120px]" />
            </tr>
          </thead>
          <tbody>
            {segment.documents.map((doc) => {
              const c = doc.counts;
              return (
                <Tr
                  key={doc.id}
                  className="cursor-pointer"
                  onClick={() => navigate(toPath.document(doc.id))}
                >
                  <Td>
                    <div className="flex items-center gap-[9px]">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor(doc)}`} />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{doc.title}</div>
                        <div className="text-ink-45 truncate text-[11.5px]">
                          {doc.documentType}
                          {doc.fileCount > 0 && ` · ${formatUtil.plural(doc.fileCount, 'file')}`}
                        </div>
                      </div>
                    </div>
                  </Td>
                  {c && doc.status === 'ready' ? (
                    <>
                      <Td className="font-mono text-[13px]">
                        {c.extracted} / {c.total}
                      </Td>
                      <Td
                        className={`font-mono text-[13px] ${c.notExtracted ? 'text-ink' : 'text-ink-45'}`}
                      >
                        {c.notExtracted}
                      </Td>
                      <Td className="text-accent-600 font-mono text-[13px]">{c.matched}</Td>
                      <Td
                        className={`font-mono text-[13px] ${c.notMatched ? 'text-flag' : 'text-ink-45'}`}
                      >
                        {c.notMatched}
                      </Td>
                    </>
                  ) : (
                    <Td colSpan={4}>
                      <Tag
                        tone={
                          doc.status === 'failed'
                            ? 'warn'
                            : doc.status === 'pending'
                              ? 'mute'
                              : 'out'
                        }
                      >
                        {STATE_LABEL[doc.status as keyof typeof STATE_LABEL] ?? ''}
                      </Tag>
                    </Td>
                  )}
                  <Td
                    className="pl-0 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {doc.fileCount === 0 && canUpload ? (
                      <Button variant="secondary" size="sm" onClick={() => onUpload(doc)}>
                        Upload
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(toPath.document(doc.id))}
                      >
                        Open
                      </Button>
                    )}
                    {canManage && (
                      <Button
                        variant="quiet"
                        size="sm"
                        aria-label={`Remove ${doc.title}`}
                        onClick={() => onRemoveDocument(doc)}
                      >
                        ✕
                      </Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </section>
  );
};

export default SegmentCard;
