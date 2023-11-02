
/**
 * This is the main extractor service.
 * This can be converted into a standalone app.
 */

export const clickUpEndPoint = process.env.NEXT_CLICKUP_URL || '';


export const extractByTask = async (id: string) => {

  /**
   * get task details
   */
  const taskEndPoint = `${clickUpEndPoint}https://api.clickup.com/api/v2/task/${id}?archived=false`;
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
  const listEndPoint = `${clickUpEndPoint}https://api.clickup.com/api/v2/list/${id}/task?archived=false`;
  const data = await fetch(listEndPoint, {
    headers: {
      Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
    }
  })
  const list = await data.json();
  return list.tasks;
}