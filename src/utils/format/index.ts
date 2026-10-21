import type { CheckStatus, FieldResult } from '../../types/document';
import type { JourneyStatus } from '../../types/journey';
import type { UserRole } from '../../types/user';

export type TagTone = 'ok' | 'warn' | 'mute' | 'out';

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super admin',
  admin: 'Admin',
  skeleton_designer: 'Skeleton designer',
  operations: 'Operations',
  viewer: 'Viewer',
};

const RESULT_TAGS: Record<FieldResult, { label: string; tone: TagTone }> = {
  matched: { label: 'Matched', tone: 'ok' },
  not_matched: { label: 'Not matched', tone: 'warn' },
  not_extracted: { label: 'Not extracted', tone: 'warn' },
  no_rule: { label: 'No rule', tone: 'out' },
  waiting: { label: 'Waiting', tone: 'mute' },
};

const CHECK_TEXT: Record<
  Exclude<CheckStatus, 'matched' | 'not_matched' | 'self_missing'>,
  string
> = {
  absent: 'Not in this journey',
  awaiting_upload: 'Awaiting upload',
  extracting: 'Extracting…',
  no_value: 'Not extracted there',
};

const JOURNEY_STATUS: Record<JourneyStatus, { label: string; tone: TagTone }> = {
  draft: { label: 'Draft', tone: 'out' },
  in_progress: { label: 'In progress', tone: 'mute' },
  complete: { label: 'Complete', tone: 'ok' },
};

class FormatUtil {
  private static instance: FormatUtil;

  private constructor() {}

  public static getInstance(): FormatUtil {
    if (!FormatUtil.instance) {
      FormatUtil.instance = new FormatUtil();
    }
    return FormatUtil.instance;
  }

  public roleLabel(role: UserRole): string {
    return ROLE_LABELS[role];
  }

  public fieldResult(result: FieldResult) {
    return RESULT_TAGS[result];
  }

  public journeyStatus(status: JourneyStatus) {
    return JOURNEY_STATUS[status];
  }

  // Text shown for a match check when there is no comparable value
  public checkText(status: CheckStatus, value: string | null): string {
    if (status === 'matched' || status === 'not_matched' || status === 'self_missing') {
      return value ?? '—';
    }
    return CHECK_TEXT[status];
  }

  // Short, readable code from the UUID's random tail (its start is a timestamp)
  public journeyCode(id: string): string {
    return `JRN-${id.slice(-6).toUpperCase()}`;
  }

  public fileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  public fileExt(name: string): string {
    const ext = name.includes('.') ? name.split('.').pop() : '';
    return (ext ?? '').toUpperCase().slice(0, 4) || 'FILE';
  }

  public date(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  public plural(count: number, noun: string, pluralNoun = `${noun}s`): string {
    return `${count} ${count === 1 ? noun : pluralNoun}`;
  }

  public initials(username: string): string {
    const parts = username.split(/[._-]+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? parts[0]?.[1] ?? '')).toUpperCase();
  }
}

export default FormatUtil.getInstance();
