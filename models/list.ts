export interface ListData {
    lists: List[];
  }
  
  export interface List {
    reportsOpen: any;
    id: string;
    name: string;
    orderindex: number;
    content: string | null;
    status: Status | null;
    priority: null;
    assignee: null;
    task_count: number;
    due_date: string | null;
    start_date: string | null;
    folder: Folder;
    space: Space;
    archived: boolean;
    override_statuses: boolean | null;
    permission_level: PermissionLevel;
  }
  
  export interface Status {
    status: string;
    color: string;
    hide_label: boolean;
  }
  
  export interface Folder {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  }
  
  export interface Space {
    id: string;
    name: string;
    access: boolean;
  }
  
  export enum PermissionLevel {
    Create = "create",
  }
  