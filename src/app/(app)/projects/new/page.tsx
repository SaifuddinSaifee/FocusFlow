import { ProjectForm } from "@/components/projects/ProjectForm";

export const metadata = { title: "New Project — FocusFlow" };

export default function NewProjectPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">New Project</h1>
        <p className="text-sm text-base-content/60 mt-0.5">Create a project to organize your tasks and notes.</p>
      </div>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}
