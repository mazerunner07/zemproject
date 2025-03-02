import { db } from "@/lib/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await db.user.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
