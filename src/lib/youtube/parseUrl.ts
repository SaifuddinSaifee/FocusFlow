import type { ParsedYouTubeUrl } from "@/types/youtube.types";

export function parseYouTubeUrl(url: string): ParsedYouTubeUrl {
  try {
    const u = new URL(url.trim());

    // youtu.be/<videoId>
    if (u.hostname === "youtu.be") {
      const videoId = u.pathname.slice(1).split("?")[0];
      if (!videoId) return { type: "invalid" };
      const playlistId = u.searchParams.get("list") ?? undefined;
      if (playlistId) return { type: "video+playlist", videoId, playlistId };
      return { type: "video", videoId };
    }

    // youtube.com variants
    if (
      u.hostname === "www.youtube.com" ||
      u.hostname === "youtube.com" ||
      u.hostname === "m.youtube.com"
    ) {
      const videoId = u.searchParams.get("v") ?? null;
      const playlistId = u.searchParams.get("list") ?? null;

      // /playlist?list=...
      if (u.pathname === "/playlist" && playlistId) {
        return { type: "playlist", playlistId };
      }

      // /watch?v=...&list=...
      if (videoId && playlistId) {
        return { type: "video+playlist", videoId, playlistId };
      }

      // /watch?v=...
      if (videoId) {
        return { type: "video", videoId };
      }

      // /embed/<videoId>
      const embedMatch = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embedMatch) {
        return { type: "video", videoId: embedMatch[1] };
      }
    }
  } catch {
    // Not a valid URL
  }

  return { type: "invalid" };
}
