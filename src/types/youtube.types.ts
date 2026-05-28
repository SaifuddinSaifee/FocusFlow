export type YouTubeVideoItem = {
  videoId: string;
  title: string;
  thumbnail: string;
  durationSeconds: number;
  position: number;
};

export type YouTubePlaylistResult = {
  playlistId: string;
  title: string;
  thumbnail: string;
  videoCount: number;
  videos: YouTubeVideoItem[];
};

export type YouTubeVideoResult = {
  videoId: string;
  title: string;
  thumbnail: string;
  durationSeconds: number;
};

export type ParsedYouTubeUrl =
  | { type: "video"; videoId: string; playlistId?: never }
  | { type: "playlist"; playlistId: string; videoId?: never }
  | { type: "video+playlist"; videoId: string; playlistId: string }
  | { type: "invalid" };
