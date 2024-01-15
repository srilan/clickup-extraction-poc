// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { clickUpEndPoint } from '@/app/config/config';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const spaceId = req.query.spaceId;
  //const foldersEndPoint = `${clickUpEndPoint}/space/${spaceId}/folder?archived=false`;
  const foldersEndPoint = `${clickUpEndPoint}/team/45045244/folder`;
  const data = await fetch(foldersEndPoint, {
    headers: {
      Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
    }
  })
  const folders = await data.json();
  console.log(folders)
  res.status(200).json(folders);
}
