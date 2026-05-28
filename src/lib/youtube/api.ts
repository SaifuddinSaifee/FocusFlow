import type { YouTubePlaylistResult, YouTubeVideoItem, YouTubeVideoResult } from "@/types/youtube.types";

const BASE = "https://www.googleapis.com/youtube/v3";

function iso8601ToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const s = parseInt(match[3] ?? "0");
  return h * 3600 + m * 60 + s;
}

export async function fetchPlaylist(playlistId: string): Promise<YouTubePlaylistResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

  // Fetch playlist metadata
  const metaRes = await fetch(
    `${BASE}/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
  );
  const metaData = await metaRes.json();
  const playlist = metaData.items?.[0];
  if (!playlist) throw new Error("Playlist not found");

  // Fetch all playlist items (paginated)
  const videos: YouTubeVideoItem[] = [];
  let pageToken: string | undefined;
  let position = 0;

  do {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId,
      maxResults: "50",
      key: apiKey,
      ...(pageToken ? { pageToken } : {}),
    });

    const res = await fetch(`${BASE}/playlistItems?${params}`);
    const data = await res.json();

    for (const item of data.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId;
      if (!videoId) continue;
      videos.push({
        videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.medium?.url ??
          item.snippet.thumbnails?.default?.url ??
          "",
        durationSeconds: 0, // filled below
        position: position++,
      });
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  // Batch-fetch video durations (50 at a time)
  for (let i = 0; i < videos.length; i += 50) {
    const batch = videos.slice(i, i + 50);
    const ids = batch.map((v) => v.videoId).join(",");
    const durRes = await fetch(
      `${BASE}/videos?part=contentDetails&id=${ids}&key=${apiKey}`
    );
    const durData = await durRes.json();
    for (const item of durData.items ?? []) {
      const video = batch.find((v) => v.videoId === item.id);
      if (video) {
        video.durationSeconds = iso8601ToSeconds(
          item.contentDetails?.duration ?? ""
        );
      }
    }
  }

  return {
    playlistId,
    title: playlist.snippet.title,
    thumbnail:
      playlist.snippet.thumbnails?.medium?.url ??
      playlist.snippet.thumbnails?.default?.url ??
      "",
    videoCount: videos.length,
    videos,
  };
}

export async function fetchVideo(videoId: string): Promise<YouTubeVideoResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

  const res = await fetch(
    `${BASE}/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
  );
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) throw new Error("Video not found");

  return {
    videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails?.medium?.url ??
      item.snippet.thumbnails?.default?.url ??
      "",
    durationSeconds: iso8601ToSeconds(item.contentDetails?.duration ?? ""),
  };
}
