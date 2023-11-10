import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Task } from './model';
import { ProductOrCapabilityOptions, TaskTypeOptions, TeamsOptions, customFields } from './configs';
import { json2csv } from 'json-2-csv';
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
const handleString = (val: string | undefined) => {
  if (val) {
    return val;
  } else {
    return '';
  }
}


const formatData = (data: any) => {
  const newData: Task = {
    id: handleString(data.id),
    custom_id: handleString(data.custom_id),
    name: handleString(data.name),  
    description: handleString(data.description),
    status_status: handleString(data.status.status),
    date_created: handleString(data.date_created),
    date_updated: handleString(data.date_updated),
    date_closed: handleString(data.date_closed),
    date_done: handleString(data.date_done),
    archived: handleString(data.archived),
    creator_email: handleString(data.creator.email),
    assignees_email: handleString(data.assignees.email),
    watchers_email: handleString(data.watchers.email),
    parent: handleString(data.watchers.parent),
    priority: handleString(data.watchers.priority),
    due_date: handleString(data.watchers.due_date),
    start_date: handleString(data.watchers.start_date),
    points: handleString(data.watchers.points),
    time_estimate: handleString(data.watchers.time_estimate),
    time_spent: handleString(data.watchers.time_spent),
    home_list: handleString(data.locations.name),
    list_name:handleString(data.list.name),
  }
  const customData = addCustomFields(data);
  return {
    ...newData,
    ...customData
  };
}

export const addCustomFields = (data: any) => {
  const output: never[] = [];
  customFields.forEach((c)=> {
    const options = c.options?.map((o)=> {
      return o.name;
    })

    output[`custom_fields_name_${c.suffix}`] = c.name;
    output[`custom_fields_options_${c.suffix}`] = options ? options.toString(): '';
    output[`custom_fields_type_${c.suffix}`] = handleString(c.type);
    const v = data.custom_fields?.filter((f: any)=> {
      return f.id == c.id;
    });
    output[`custom_fields_value_${c.suffix}`] = v.value || '';
  })
  return output;
}

export const writeExtracted = async (data: any[], fileName: string) => {
  fileName = fileName.replaceAll(" ", "_");
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  /*const tasks = data.map(d=>formatData(d));
  const replacer = (key: any, value: any) => { return value === null ? '' : value } 
  const header = Object.keys(tasks[0])
  const csv = [
    header.join(','),
    ...tasks.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n')
  */
  const tasks = data.map(d=>formatData(d))
  const csv = json2csv(tasks);
  const location = join(__dirname, `${fileName}.csv`)
  await writeFileSync(location, csv, {
    flag: 'w',
  });
}

export const extract = async (folderId: string) => {
  const { lists, name } = await getListsByFolder(folderId);
  let tasks: any[] = [];
  const taskData = lists.map(async (l: any)=> {
    const list = await extractByList(l.id);
    return list.tasks;
  });
  await Promise.all(taskData).then((res)=> {
    res.forEach((task:any) => {
      tasks = tasks.concat(task)
    });
    writeExtracted(tasks, name);
  }).finally(()=>{
    console.log("completed")
  })
}