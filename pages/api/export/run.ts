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
  if (req.method === "POST") {
    const ids = req.body.spaceIds
    
    const foldersEndPoint = `${clickUpEndPoint}/space/${ids}/folder?archived=false`;
    const data = await fetch(foldersEndPoint, {
      headers: {
        Authorization: `${process.env.NEXT_CLICKUP_PUBLIC_KEY}`
      }
    })
    const folders = await data.json();
    res.status(200).json(folders);
  } else {
    res.status(404);
  }
  
}
