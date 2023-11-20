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
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const id = req.query.folderId
    if (id) {
      const fileName = await download(id as string);
      //const csvFile = fs.readFileSync(fileName);
      res
      .status(200)
      .setHeader("Content-Type", "text/csv")
      .setHeader("Content-Disposition", `attachment; filename="test.csv"`)
      .send(fileName as unknown as Data);
    } else {
      res.status(400).json({
        message: "Invalid Folder ID"
      })
    }
  } else {
    res.status(404);
  }
  
}
