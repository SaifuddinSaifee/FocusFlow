import { signOut } from "@/actions/auth";

export default function AccountSettingsPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8 pb-6 border-b border-base-200/60">
        <h2 className="text-xl font-bold text-base-content">Account Security</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Manage your account security, active sessions, and authentication methods.
        </p>
      </div>
      
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-base font-semibold text-base-content mb-1">Device Sessions</h3>
          <p className="text-sm text-base-content/60 mb-4">
            If you notice any suspicious activity, you can sign out of all your active sessions.
          </p>
          <form action={signOut}>
            <button type="submit" className="btn btn-outline btn-sm">
              Sign out of all devices
            </button>
          </form>
        </div>
        
        <div className="border-t border-error/20 pt-8 mt-4">
          <h3 className="text-base font-semibold text-error mb-1">Danger Zone</h3>
          <p className="text-sm text-base-content/60 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button 
            className="btn btn-sm bg-error/10 hover:bg-error hover:text-white border-error/20 text-error disabled:bg-error/5 disabled:text-error/40 disabled:border-error/10" 
            disabled
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
