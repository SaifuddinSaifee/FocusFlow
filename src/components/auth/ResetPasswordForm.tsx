"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword, type AuthResult } from "@/actions/auth";

const initial: AuthResult = { error: null };

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, initial);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body gap-4">
        <h2 className="card-title text-xl">Reset password</h2>
        <p className="text-sm text-base-content/60">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {state.error && (
          <div className="alert alert-error text-sm py-2">
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-3">
          <label className="form-control">
            <div className="label pb-1">
              <span className="label-text">Email</span>
            </div>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
              autoComplete="email"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending}
          >
            {isPending ? <span className="loading loading-spinner loading-sm" /> : "Send reset link"}
          </button>
        </form>

        <p className="text-center text-sm text-base-content/60">
          <Link href="/login" className="link link-primary">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
