import { NextResponse } from "next/server";

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
