import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Task } from './model';
/**
 * This is the main extractor service.
 * This can be converted into a standalone app.
 */

export const clickUpEndPoint = process.env.NEXT_CLICKUP_URL || '';


export const getListsByFolder = async (folderId: string) => {
  const taskEndPoint = `${clickUpEndPoint}/folder/${folderId}?archived=false`;
  const data = await fetch(taskEndPoint, {
    headers: {
      Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
    }
  })
  const taskData = await data.json();
  return taskData;
}

export const extractByTask = async (id: string) => {
  const taskEndPoint = `${clickUpEndPoint}/task/${id}?archived=false`;
  const data = await fetch(taskEndPoint, {
    headers: {
      Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
    }
  })
  const taskData = await data.json();
  return taskData;
}

export const extractByList = async (id: string) => {

  /**
   * get task details
   */
  const listEndPoint = `${clickUpEndPoint}/list/${id}/task?archived=false`;
  const data = await fetch(listEndPoint, {
    headers: {
      Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
    }
  })
  const list = await data.json();
  return list;
}

const formatData = (data: any) => {
  const newData: Task = {
    id: data.id,
    custom_id: data.custom_id,
    name: data.name,
    description: data.description,
    status_status: data.status.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
    date_closed: data.date_closed,
    date_done: data.date_done,
    archived: data.archived,
    creator_email: data.creator.email,
    assignees_email: data.assignees.email,
    watchers_email: data.watchers.email,
    parent: data.watchers.parent,
    priority: data.watchers.priority,
    due_date: data.watchers.due_date,
    start_date: data.watchers.start_date,
    points: data.watchers.points,
    time_estimate: data.watchers.time_estimate,
    time_spent: data.watchers.time_spent,
    home_list: data.locations.name,
    list_name: data.list.name,
  }
  return newData;
}

export const writeExtracted = async (data: any[], fileName: string) => {
  fileName = fileName.replaceAll(" ", "_");
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  const tasks = data.map(d=>formatData(d));
  const location = join(__dirname, `${fileName}.json`)
  await writeFileSync(location, JSON.stringify(tasks), {
    flag: 'w',
  });
}

export const extract = async (folderId: string) => {
  const { lists, name } = await getListsByFolder(folderId);
  const tasks: any[] = [];
  lists.map(async (l: any)=> {
    const list = await extractByList(l.id);
    tasks.concat(list.tasks);
    console.log("list", tasks)
  })
  await writeExtracted(tasks, name);
}