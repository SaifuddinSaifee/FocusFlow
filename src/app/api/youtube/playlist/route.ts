import { NextResponse } from "next/server";
import { fetchPlaylist } from "@/lib/youtube/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get("playlistId");

  if (!playlistId) {
    return NextResponse.json({ error: "playlistId is required" }, { status: 400 });
  }

  try {
    const result = await fetchPlaylist(playlistId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch playlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
