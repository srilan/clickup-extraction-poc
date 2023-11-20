// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { extract } from '@/service/extract';
import { clickUpEndPoint } from '@/pages/config';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const ids = req.body.spaceIds
    await extract("90110126223");
    await extract("90020074200");
    await extract("90050261708");
    await extract("90020074266");
    
    res.status(200).json({
      message: "done"
    });
  } else {
    res.status(404);
  }
  
}
