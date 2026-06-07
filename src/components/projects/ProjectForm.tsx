"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, type ProjectFormState } from "@/actions/projects";

const initial: ProjectFormState = { error: null };

interface ProjectFormProps {
  onSuccess?: (projectId: string) => void;
  onCancel?: () => void;
}

export function ProjectForm({ onSuccess, onCancel }: ProjectFormProps) {
  const router = useRouter();
  const [isCourse, setIsCourse] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (prev: ProjectFormState, formData: FormData) => {
      const result = await createProject(prev, formData);
      if (!result.error && result.projectId) {
        onSuccess?.(result.projectId);
        router.push(`/projects/${result.projectId}`);
      }
      return result;
    },
    initial
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <div className="alert alert-error text-sm py-2">
          <span>{state.error}</span>
        </div>
      )}

      <label className="form-control">
        <div className="label pb-1"><span className="label-text font-medium">Project name *</span></div>
        <input
          type="text"
          name="name"
          placeholder="e.g. Machine Learning Course"
          className="input input-bordered"
          required
          maxLength={100}
        />
      </label>

      <label className="form-control">
        <div className="label pb-1"><span className="label-text font-medium">Description</span></div>
        <textarea
          name="description"
          placeholder="What is this project about?"
          className="textarea textarea-bordered resize-none h-20"
          maxLength={500}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="form-control">
          <div className="label pb-1"><span className="label-text font-medium">Deadline *</span></div>
          <input
            type="date"
            name="deadline"
            className="input input-bordered"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </label>

        <label className="form-control">
          <div className="label pb-1"><span className="label-text font-medium">Priority *</span></div>
          <select name="priority" className="select select-bordered" defaultValue="Medium">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>

      {/* Course toggle */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={isCourse}
            onChange={(e) => setIsCourse(e.target.checked)}
          />
          <span className="label-text font-medium">This is a course (YouTube, Udemy, etc.)</span>
        </label>
        <input type="hidden" name="is_course" value={String(isCourse)} />
      </div>

      {isCourse && (
        <label className="form-control">
          <div className="label pb-1">
            <span className="label-text font-medium">Course Link *</span>
            <span className="label-text-alt text-base-content/50">YouTube or external course URL (e.g. Udemy)</span>
          </div>
          <input
            type="url"
            name="youtube_link"
            placeholder="e.g. https://www.udemy.com/course/... or YouTube playlist"
            className="input input-bordered"
            required={isCourse}
          />
        </label>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary flex-1" disabled={isPending}>
          {isPending ? <span className="loading loading-spinner loading-sm" /> : "Create project"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
