export interface FolderData {
  folders: Folder[];
}

export interface ListData {
  lists: List[];
}

export interface Folder {
  reportsOpen: any;
  id:                string;
  name:              string;
  orderindex:        number;
  override_statuses: boolean;
  hidden:            boolean;
  space:             FolderSpace;
  task_count:        string;
  archived:          boolean;
  statuses:          StatusElement[];
  lists:             List[];
  permission_level:  PermissionLevel;
}

export interface List {
  reportsOpen: any;
  id:                string;
  name:              string;
  orderindex:        number | null;
  content?:          string;
  status:            PurpleStatus | null;
  priority:          null;
  assignee:          null;
  task_count:        number;
  due_date:          null | string;
  start_date:        null | string;
  space:             ListSpace;
  archived:          boolean;
  override_statuses: boolean | null;
  statuses:          StatusElement[];
  permission_level:  PermissionLevel;
}

export enum PermissionLevel {
  Create = "create",
}

export interface ListSpace {
  id:     string;
  name:   Name;
  access: boolean;
}

export enum Name {
  TrajectorProjects = "✨Trajector Projects",
}

export interface PurpleStatus {
  status:     string;
  color:      string;
  hide_label: boolean;
}

export interface StatusElement {
  id:         string;
  status:     StatusEnum;
  orderindex: number;
  color:      Color;
  type:       Type;
}

export enum Color {
  A875Ff = "#A875FF",
  C8844D = "#C8844D",
  Color1F7Ec5 = "#1f7ec5",
  Color45C17B = "#45c17b",
  ColorFf540D = "#ff540d",
  D3D3D3 = "#d3d3d3",
  E50000 = "#e50000",
  F9D900 = "#f9d900",
  Ff00Df = "#FF00DF",
  Ff4081 = "#FF4081",
  Ff540D = "#FF540D",
  Ff7Fab = "#FF7FAB",
  Ff9900 = "#ff9900",
  Ffcc00 = "#FFCC00",
  Ffcf00 = "#ffcf00",
  The000000 = "#000000",
  The0231E8 = "#0231E8",
  The08Adff = "#08adff",
  The1Bbc9C = "#1bbc9c",
  The1D7616 = "#1D7616",
  The1F7Ec5 = "#1F7EC5",
  The3D4763 = "#3D4763",
  The4194F6 = "#4194f6",
  The45C17B = "#45C17B",
  The667684 = "#667684",
  The696358 = "#696358",
  The6Bc950 = "#6bc950",
}

export enum StatusEnum {
  Accepted = "accepted ",
  Backlog = "backlog",
  Blocked = "blocked",
  Cancelled = "cancelled",
  Closed = "Closed",
  CodeReview = "code review",
  Delivered = "delivered",
  Done = "done",
  Draft = "draft",
  InProgress = "in progress",
  InQAReview = "in qa review",
  InReview = "in review",
  InformationNeeded = "information needed",
  New = "new",
  Open = "Open",
  OpenTasks = "open tasks",
  PostMeetingActionItems = "post meeting action items",
  QA = "qa",
  Queued = "queued",
  ReadyToDeliver = "ready to deliver",
  ReadyToDeploy = "ready to deploy",
  Rejected = "rejected",
  Review = "review",
  Scheduled = "scheduled",
  TestInStaging = "test in staging",
  Triage = "triage",
  Unscheduled = "unscheduled",
  Verified = "verified",
}

export enum Type {
  Closed = "closed",
  Custom = "custom",
  Done = "done",
  Open = "open",
  Unstarted = "unstarted",
}

export interface FolderSpace {
  id:   string;
  name: Name;
}
