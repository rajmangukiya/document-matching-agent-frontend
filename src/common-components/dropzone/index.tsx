import { type DragEvent, useState } from 'react';

const ACCEPT = '.pdf,.xlsx,.xls,.docx,.doc,.csv,.jpg,.jpeg,.png';

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  title?: string;
  hint?: string;
  compact?: boolean;
  disabled?: boolean;
}

const UploadIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

// Drag-and-drop or click-to-browse file picker (multiple files)
const Dropzone = ({ onFiles, title, hint, compact = false, disabled = false }: DropzoneProps) => {
  const [isOver, setIsOver] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (!disabled && e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
      className={`focus-within:outline-accent flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-[1.5px] border-dashed text-center transition-colors focus-within:outline-2 ${
        compact ? 'px-3 py-[18px]' : 'px-4 py-[26px]'
      } ${isOver ? 'border-accent bg-accent-soft' : 'border-mute bg-wash hover:border-accent'} ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <input
        type="file"
        multiple
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files));
          e.target.value = '';
        }}
      />
      <span className="text-accent">
        <UploadIcon size={compact ? 22 : 28} />
      </span>
      <span className={`font-medium ${compact ? 'text-[13px]' : 'text-sm'}`}>
        {title ?? (
          <>
            Drop files here or{' '}
            <span className="text-accent underline underline-offset-3">browse</span>
          </>
        )}
      </span>
      <span className="text-ink-45 text-xs">
        {hint ?? 'PDF, XLSX, DOCX, CSV, JPG or PNG · up to 25 MB each · select several at once'}
      </span>
    </label>
  );
};

export default Dropzone;
