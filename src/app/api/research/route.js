import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), ".data", "research-cache.json");

export async function GET() {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf-8");
    const { items = [] } = JSON.parse(raw);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
