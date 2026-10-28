// Blog topics (v13). Each post carries one topic in its frontmatter; the
// topic sets its cover field color, its glyph and its filter on /blog/.
// The three product jobs keep their chapter colors; the wider topics sit on
// an ink field so a reader never mistakes them for one vendor's chapter.
import type { ProductId } from '../lib/site';

export const TOPIC_IDS = ['intake', 'portals', 'operations', 'ai', 'web', 'buying'] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export interface Topic {
  label: string;
  /** One line under the filter on /blog/ */
  blurb: string;
  /** Chapter color of the cover field; null = the ink field */
  chapter: ProductId | null;
  glyph: 'intake' | 'portal' | 'team' | 'records' | 'gate' | 'client';
}

export const TOPICS: Record<TopicId, Topic> = {
  intake: { label: 'Intake', blurb: 'Forms, briefs and the first record a client creates.', chapter: 'fillout', glyph: 'intake' },
  portals: { label: 'Portals', blurb: 'What clients see when they log in, and what they must not.', chapter: 'softr', glyph: 'portal' },
  operations: { label: 'Operations', blurb: 'Records, syncs, workflows and the team behind the portal.', chapter: 'noloco', glyph: 'records' },
  ai: { label: 'AI', blurb: 'AI builders and AI features, read for small client work.', chapter: null, glyph: 'team' },
  web: { label: 'Web basics', blurb: 'Speed, accessibility, domains and email, without the jargon.', chapter: null, glyph: 'gate' },
  buying: { label: 'Buying software', blurb: 'Plans, trials, lock-in and how review sites get paid.', chapter: null, glyph: 'client' },
};
