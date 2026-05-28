"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => { destroy: () => void };
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onEnded?: () => void;
  onPlaying?: () => void;
}

export function YouTubePlayer({ videoId, onEnded, onPlaying }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<{ destroy: () => void } | null>(null);

  const createPlayer = useCallback((container: HTMLDivElement) => {
    // YT.Player replaces its target element with an iframe.
    // Always give it a fresh div so the React-managed container stays intact.
    container.innerHTML = "";
    const target = document.createElement("div");
    container.appendChild(target);
    playerRef.current = new window.YT.Player(target, {
      videoId,
      playerVars: { rel: 0, modestbranding: 1, origin: window.location.origin },
      events: {
        onStateChange: (e) => {
          if (e.data === 0) onEnded?.();
          if (e.data === 1) onPlaying?.();
        },
      },
    });
  }, [videoId, onEnded, onPlaying]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // `active` guards against StrictMode's double-invoke:
    // the first effect's cleanup sets active=false so its queued
    // onYouTubeIframeAPIReady callback is a no-op when it eventually fires.
    let active = true;

    const init = () => {
      if (active && container.isConnected) createPlayer(container);
    };

    if (window.YT?.Player) {
      init();
    } else {
      // Chain onto any previously registered callback so multiple
      // component instances don't clobber each other.
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
      if (!document.getElementById("yt-iframe-api")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    }

    return () => {
      active = false;
      playerRef.current?.destroy();
      playerRef.current = null;
      container.innerHTML = "";
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="aspect-video bg-base-300 rounded-xl overflow-hidden w-full [&_iframe]:w-full [&_iframe]:h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
