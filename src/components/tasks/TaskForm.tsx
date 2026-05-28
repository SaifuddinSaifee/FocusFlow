"use client";

import { useActionState } from "react";
import { createTask, type TaskFormState } from "@/actions/tasks";
import { Modal } from "@/components/ui/Modal";

const initial: TaskFormState = { error: null };

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  projectId?: string | null;
  chapterId?: string | null;
}

export function TaskForm({ open, onClose, projectId, chapterId }: TaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prev: TaskFormState, formData: FormData) => {
      const result = await createTask(prev, formData);
      if (!result.error) onClose();
      return result;
    },
    initial
  );

  return (
    <Modal open={open} onClose={onClose} title="Add task" size="sm">
      <form action={formAction} className="flex flex-col gap-3">
        {state.error && (
          <div className="alert alert-error text-sm py-2">
            <span>{state.error}</span>
          </div>
        )}

        {projectId && <input type="hidden" name="project_id" value={projectId} />}
        {chapterId && <input type="hidden" name="chapter_id" value={chapterId} />}

        <label className="form-control">
          <div className="label pb-1"><span className="label-text">Task title *</span></div>
          <input
            type="text"
            name="title"
            placeholder="What needs to be done?"
            className="input input-bordered input-sm"
            required
            autoFocus
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="form-control">
            <div className="label pb-1"><span className="label-text">Deadline</span></div>
            <input type="date" name="deadline" className="input input-bordered input-sm" />
          </label>

          <label className="form-control">
            <div className="label pb-1"><span className="label-text">Priority</span></div>
            <select name="priority" className="select select-bordered select-sm" defaultValue="Medium">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
        </div>

        <div className="flex gap-2 mt-1">
          <button type="submit" className="btn btn-primary btn-sm flex-1" disabled={isPending}>
            {isPending ? <span className="loading loading-spinner loading-xs" /> : "Add task"}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
