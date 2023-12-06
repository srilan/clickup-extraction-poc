// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { download, extract } from '@/service/extract';
import { clickUpEndPoint } from '@/app/config/config';
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = req.query.folderId
    const page = req.query.page
    if (id) {
      const data = await download(id as string, page as string);
      //const csvFile = fs.readFileSync(fileName);
      res
      .status(200)
      .json(data);
    } else {
      res.status(400).json({
        message: "Invalid Folder ID"
      })
    }
  } else {
    res.status(404);
  }
  
}
