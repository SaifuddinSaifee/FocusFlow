"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/profiles";
import { useAuthStore } from "@/stores/authStore";
import type { Profile } from "@/types/app.types";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.display_name ?? "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { user } = useAuthStore();

  const avatarUrl = profile.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfile(profile.id, { display_name: name });
      setMessage(result.error ?? "Profile updated!");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      {message && (
        <div className={`alert text-sm py-2 ${message.includes("error") ? "alert-error" : "alert-success"}`}>
          {message}
        </div>
      )}

      {/* Avatar Preview */}
      <div className="flex items-center gap-4 mb-2 p-3 bg-base-300/50 rounded-xl border border-base-300">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center overflow-hidden text-sm font-bold">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || "User"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>
                {(name || profile.email)?.[0]?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-base-content text-sm">{name || "User"}</h3>
          <p className="text-xs text-base-content/60">{profile.email}</p>
        </div>
      </div>
      <label className="form-control">
        <div className="label pb-1"><span className="label-text">Display name</span></div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered"
          placeholder="Your name"
        />
      </label>
      <label className="form-control">
        <div className="label pb-1"><span className="label-text">Email</span></div>
        <input
          type="email"
          value={profile.email}
          className="input input-bordered input-disabled"
          disabled
        />
      </label>
      <button type="submit" className="btn btn-primary btn-sm self-start" disabled={isPending}>
        {isPending ? <span className="loading loading-spinner loading-xs" /> : "Save changes"}
      </button>
    </form>
  );
}
