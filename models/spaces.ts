export interface SpacesData {
  spaces: Space[];
}

export interface Space {
  id:                 string;
  name:               string;
  color:              null | string;
  private:            boolean;
  avatar:             null | string;
  admin_can_manage:   boolean;
  statuses:           Status[];
  multiple_assignees: boolean;
  features:           Features;
  archived:           boolean;
}

export interface Features {
  due_dates:           DueDates;
  sprints:             CustomFields;
  time_tracking:       TimeTracking;
  points:              CustomFields;
  custom_items:        CustomFields;
  priorities:          Priorities;
  tags:                CustomFields;
  wip_limits?:         CustomFields;
  time_estimates?:     TimeEstimates;
  check_unresolved?:   CheckUnresolved;
  zoom:                CustomFields;
  milestones:          CustomFields;
  custom_fields:       CustomFields;
  remap_dependencies?: CustomFields;
  dependency_warning?: CustomFields;
  status_pies:         CustomFields;
  multiple_assignees:  CustomFields;
  emails?:             CustomFields;
}

export interface CheckUnresolved {
  enabled:    boolean;
  subtasks:   null;
  checklists: null;
  comments:   null;
}

export interface CustomFields {
  enabled: boolean;
}

export interface DueDates {
  enabled:               boolean;
  start_date:            boolean;
  remap_due_dates:       boolean;
  remap_closed_due_date: boolean;
}

export interface Priorities {
  enabled:    boolean;
  priorities: PriorityElement[];
}

export interface PriorityElement {
  color:      Color;
  id:         string;
  orderindex: string;
  priority:   PriorityEnum;
}

export enum Color {
  D8D8D8 = "#d8d8d8",
  F50000 = "#f50000",
  F8Ae00 = "#f8ae00",
  The6Fddff = "#6fddff",
}

export enum PriorityEnum {
  High = "high",
  Low = "low",
  Normal = "normal",
  Urgent = "urgent",
}

export interface TimeEstimates {
  enabled:      boolean;
  rollup:       boolean;
  per_assignee: boolean;
}

export interface TimeTracking {
  enabled: boolean;
  harvest: boolean;
  rollup:  boolean;
}

export interface Status {
  id:         string;
  status:     string;
  type:       Type;
  orderindex: number;
  color:      string;
}

export enum Type {
  Closed = "closed",
  Custom = "custom",
  Done = "done",
  Open = "open",
  Unstarted = "unstarted",
}
