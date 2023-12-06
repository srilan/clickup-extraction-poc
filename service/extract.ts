import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Comment, Task } from './model';
import { ProductOrCapabilityOptions, TaskTypeOptions, TeamsOptions, customFields } from './configs';
import { json2csv } from 'json-2-csv';
import format from 'date-fns/format';
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
  let page = 0;
  let last = false;
  let taskData: never[] = [];
  while(!last && page < 20) {
    console.log("Extracting page", page)
    const listEndPoint = `${clickUpEndPoint}/list/${id}/task?archived=false&subtasks=true&page=${page}`;
    const data = await fetch(listEndPoint, {
      headers: {
        Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
      }
    })
    const currPage = await data.json()
    last = currPage.last_page;
    if (currPage.last_page) {
      last = true;
    } else {
      last = false;
    }
    taskData = taskData.concat(currPage.tasks);
    page++;
  }
  return taskData;
}
const handleString = (val: string | undefined) => {
  if (val) {
    return val;
  } else {
    return '';
  }
}

const formatDate = (val: string | undefined) => {
  if (val) {
    const dateTime = new Date(Number.parseInt(val));
    try { 
      const formatted = format(dateTime, 'yyyy/MM/dd HH:mm:ss');
      return formatted;
    } catch (e) {
      console.log("invalid", e)
    }
    return "";
  } else {
    return '';
  }
}


export const extractTaskComments = async (id: string) => {

  /**
   * get task details
   */
  const listEndPoint = `${clickUpEndPoint}/task/${id}/comment`;
  const data = await fetch(listEndPoint, {
    headers: {
      Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
    }
  })
  const list = await data.json();
  return list;
}

const formatData = async (data: any) => {
  const newData: Task = {
    id: handleString(data.id),
    custom_id: handleString(data.custom_id),
    name: handleString(data.name),
    description: handleString(data.description),
    status_status: handleString(data.status.status),
    date_created: formatDate(data.date_created),
    date_updated: formatDate(data.date_updated),
    date_closed: formatDate(data.date_closed),
    date_done: formatDate(data.date_done),
    archived: handleString(data.archived.toString()),
    creator_email: handleString(data.creator.email),
    assignees_email: handleString(data.assignees.map((a: any) => a.email).toString()),
    watchers_email: handleString(data.watchers.map((a: any) => a.email).toString()),
    parent: handleString(data.parent),
    priority: handleString(data.priority?.priority),
    due_date: formatDate(data.due_date),
    start_date: formatDate(data.start_date),
    points: handleString(data.points),
    //time_estimate: handleString(data.time_estimate),
    //time_spent: handleString(data.time_spent),
    list_name: handleString(data.list.name),
    time_estimate: '',
    time_spent: '',
  }
  const customData = addCustomFields(data);
  const comments = await getComments(data.id);
  return {
    ...newData,
    ...customData,
    comments: formatComments(comments).toString()
  };
}

const formatComments = (comments: Array<Comment>) => {
  return comments.map(c => {
    c.comment_text = c.comment_text.replace(/\n$/, '');
    return `Comment: "${c.comment_text}" Sender: ${c.user} Sent at: ${c.date}`
  })
}

export const getComments = async (taskId: string): Promise<Array<Comment>> => {
  const commentsData = await extractTaskComments(taskId);
  if (commentsData.comments) {
    const comments = commentsData.comments.map((c: any)=> {
      return {
        user: c.user.email,
        date: c.date,
        comment_text: c.comment_text,
      } as Comment
    })
    return comments
  } else {
    return []
  }
}

export const addCustomFields = (data: any) => {
  const output: never[] = [];
  customFields.forEach((c)=> {
    const options = c.options?.map((o)=> {
      return o.name;
    })

    /*
    output[`custom_fields_name_${c.suffix}`] = c.name;
    output[`custom_fields_options_${c.suffix}`] = options ? options.toString(): '';
    output[`custom_fields_type_${c.suffix}`] = handleString(c.type);
    */
    const v = data.custom_fields?.find((f: any)=> {
      return f.id == c.id;
    });
    let value = "";
    if (v && v.value) {
      if (v.value.length > 0 && Array.isArray(v.value)) {
        console.log("v", v.value)
        const fromOptions = v.value.map((v: string) => {
          const opt = c.options?.find(o=>o.id == v);
          return opt?.name;
        });
        value = fromOptions.toString();
      } else if(options && options[v.value]) {
        value = options ? options[v.value] || ''  : '';
      } else {
        value = v.value;
      }
    }
    output[`custom_fields_value_${c.suffix}`] = value;
  })
  return output;
}

export const writeExtracted = async (data: any[], fileName: string) => {
  fileName = fileName.replaceAll(" ", "_");
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  fileName += `_${new Date().getTime()}`
  /*const tasks = data.map(d=>formatData(d));
  const replacer = (key: any, value: any) => { return value === null ? '' : value } 
  const header = Object.keys(tasks[0])
  const csv = [
    header.join(','),
    ...tasks.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n')
  */
  const tasks = data.map(async d=> { return await formatData(d) })
  const doneTasks = await Promise.all(tasks);
  const csv = json2csv(doneTasks);
  const location = join(__dirname, `${fileName}.csv`)
  //await writeFileSync(location, csv, {
  //  flag: 'w',
  //});
  return csv;
}

export const extract = async (folderId: string) => {
  const { lists, name } = await getListsByFolder(folderId);
  let tasks: any[] = [];
  const taskData = lists.map(async (l: any)=> {
    const list = await extractByList(l.id);
    return list;
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


export const download = async (folderId: string) => {
  const { lists, name } = await getListsByFolder(folderId);
  let tasks: any[] = [];
  const taskData = lists.map(async (l: any)=> {
    const list = await extractByList(l.id);
    return list;
  });
  const res = await Promise.all(taskData).then((res)=> {
    res.forEach((task:any) => {
      tasks = tasks.concat(task)
    });
    return writeExtracted(tasks, name);
  }).finally(()=>{
    console.log("completed")
  });
  return res;
}