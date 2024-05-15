import { NextApiRequest, NextApiResponse } from "next";
import { extractByList, writeExtracted } from "@/service/extract";

type Data = {
    message: string
}

export async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let tasks: any[] = [];
    if (req.method === 'POST') {
        const id = req.body.id;
        const data = await extractByList(id);
        tasks = data.tasks;
        console.log('Huh?');
        const csv = await writeExtracted(tasks, id);
        // Set response headers for CSV download
        res.setHeader('Content-Disposition', `attachment; filename=${id}.csv`);
        res.setHeader('Content-Type', 'text/csv');
        // Send the CSV data in the response
        res.status(200).send({ message: csv });
    } else if (req.method === 'GET') {
        res.status(200).json({
            message: "GET"
        });
    }
}

export default handler;
