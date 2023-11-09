
export interface Task {
  id: string;
  custom_id?: string;
  name: string;
  description: string;
  status_status: string;
  date_created: string;
  date_updated: string;
  date_closed: string;
  date_done: string;
  archived: string;
  creator_email: string;
  watchers_email: string;
  assignees_email: string;
  parent: string;
  priority: string;
  due_date: string;
  start_date: string;
  points: string;
  time_estimate: string;
  time_spent: string;
  home_list: string;
  list_name: string;
}