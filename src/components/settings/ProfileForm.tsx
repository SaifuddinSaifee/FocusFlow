"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/profiles";
import type { Profile } from "@/types/app.types";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.display_name ?? "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

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
