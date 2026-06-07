"use client";

import { useState, useTransition } from "react";
import { addProjectResource, deleteProjectResource } from "@/actions/resources";
import type { ProjectResource } from "@/lib/supabase/queries/resources";

interface ProjectResourcesProps {
  projectId: string;
  initialResources: ProjectResource[];
}

export function ProjectResources({ projectId, initialResources }: ProjectResourcesProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    try {
      new URL(url.trim());
    } catch {
      alert("Please enter a valid URL (including https://)");
      return;
    }

    startTransition(async () => {
      await addProjectResource(projectId, title.trim(), url.trim());
      setTitle("");
      setUrl("");
      setIsAdding(false);
    });
  };

  const handleDelete = (resourceVal: string) => {
    if (!confirm("Are you sure you want to remove this resource link?")) return;
    startTransition(async () => {
      await deleteProjectResource(projectId, resourceVal);
    });
  };

  // Helper to determine the platform icon
  const getResourceIcon = (linkUrl: string) => {
    const lowerUrl = linkUrl.toLowerCase();
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center border border-error/20">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.002 3.002 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );
    }
    if (lowerUrl.includes("udemy.com")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-[#a435f0]/10 text-[#a435f0] flex items-center justify-center border border-[#a435f0]/20">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-3.5h-2V7h2v6z" />
          </svg>
        </div>
      );
    }
    if (lowerUrl.includes("github.com")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-base-content/10 text-base-content flex items-center justify-center border border-base-content/20">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
          </svg>
        </div>
      );
    }
    // Generic website / globe icon
    return (
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-base-content">Project Resources</h2>
          <p className="text-sm text-base-content/60 mt-0.5">
            Add documentation, courses, repositories, or any reference links.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-primary btn-sm gap-1.5 shadow-md hover:shadow-primary/20 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Resource
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card bg-base-200 border border-base-300 p-4 gap-4 animate-fadeIn">
          <h3 className="font-semibold text-sm text-base-content">New Resource Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <div className="label py-1"><span className="label-text text-xs font-semibold">Title</span></div>
              <input
                type="text"
                placeholder="e.g. GitHub Repository, Course Playlist"
                className="input input-bordered input-sm w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isPending}
              />
            </label>
            <label className="form-control w-full">
              <div className="label py-1"><span className="label-text text-xs font-semibold">URL</span></div>
              <input
                type="url"
                placeholder="https://..."
                className="input input-bordered input-sm w-full"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={isPending}
              />
            </label>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsAdding(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isPending}
            >
              {isPending ? <span className="loading loading-spinner loading-xs" /> : "Save Resource"}
            </button>
          </div>
        </form>
      )}

      {initialResources.length === 0 ? (
        <div className="card border border-dashed border-base-300 bg-base-100/50 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="font-medium text-sm text-base-content/70">No resources linked yet</p>
          <p className="text-xs text-base-content/50 max-w-xs mt-1">
            Keep all your study links, reference code, documentation, and external courses in one place.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialResources.map((resource) => (
            <div
              key={resource.url}
              className="group card bg-base-100 border border-base-300 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
            >
              <div className="card-body p-4 flex flex-row items-center gap-4">
                {getResourceIcon(resource.url)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-base-content truncate">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-base-content/40 truncate mt-0.5 select-all">
                    {resource.url}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                    title="Open Resource ↗"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    onClick={() => handleDelete(resource.url)}
                    className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove link"
                    disabled={isPending}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
