export interface Course {
  type: 'course' | 'learning_path' | 'lab';
  title: string;
  description: string;
  path: string;
  duration: string;
  level: 'introductory' | 'intermediate' | 'advanced';
  credentialType: 'skill_badge' | null;
}

export interface CourseContent {
  id: string;
  title: string;
  description: string | null;
  steps: Step[];
  expanded: boolean;
}

export interface Step {
  id: string;
  prompt: string | null;
  isOptional: boolean;
  activities: Activity[];
  isComplete: boolean;
  isTestedOut: boolean;
  allActivitiesRequired: boolean;
}

export interface Activity {
  id: string;
  href?: string;
  isLocked: boolean;
  duration?: number;
  title: string;
  description?: string;
  type: string;
  isComplete: boolean;
  inProgress: boolean;
  disabled: boolean;
}

