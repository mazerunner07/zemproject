import { NextApiRequest, NextApiResponse } from "next";
import {db} from "@/lib/prisma/db"; // Ensure this is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const count = await db.user.count();
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
