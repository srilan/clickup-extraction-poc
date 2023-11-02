// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { clickUpEndPoint } from '@/pages/config';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { folderId } = req.query;
  const listsEndPoint = `${clickUpEndPoint}/folder/${folderId}/list?archived=false`;
  const data = await fetch(listsEndPoint, {
    headers: {
      Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
    }
  });
  const lists = await data.json();
  res.status(200).json(lists);
}
