import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    __version: 1,
    content: {
      hero: {
        title: "Title from API (KV simulation)",
      },
    },
  });
}
