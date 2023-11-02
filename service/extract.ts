import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
/**
 * This is the main extractor service.
 * This can be converted into a standalone app.
 */

export const clickUpEndPoint = process.env.NEXT_CLICKUP_URL || '';


export const extractByTask = async (id: string) => {

  /**
   * get task details
   */
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

export const writeExtracted = async (data: [], filename: string) => {
  const location = join(__dirname, `${filename}.json`)
  console.log("loc", location)
  await writeFileSync(location, JSON.stringify(data), {
    flag: 'w',
  });
}

export const extract = async (listId: string) => {
  const list = await extractByList(listId);
  await writeExtracted(list.tasks, list.id);
}