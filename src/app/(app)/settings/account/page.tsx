import { signOut } from "@/actions/auth";

export default function AccountSettingsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Account</h2>
      <div className="flex flex-col gap-4">
        <div className="alert alert-warning text-sm">
          <span>Danger zone — these actions cannot be undone.</span>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-outline btn-error btn-sm">
            Sign out of all devices
          </button>
        </form>
      </div>
    </div>
  );
}
