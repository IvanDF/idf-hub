export type {
  Project,
  ProjectPlatform,
  ProjectCategory,
} from './project';

/**
 * Type for when we truly cannot determine the type of a value.
 * Use only as last resort when dealing with external libraries or dynamic content.
 * Always document why UnsafeAny is necessary.
 */
export type UnsafeAny = unknown;