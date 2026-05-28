"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthResult } from "@/actions/auth";

const initial: AuthResult = { error: null };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUp, initial);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body gap-4">
        <h2 className="card-title text-xl">Create your account</h2>

        {state.error && (
          <div className="alert alert-error text-sm py-2">
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-3">
          <label className="form-control">
            <div className="label pb-1"><span className="label-text">Name</span></div>
            <input
              type="text"
              name="displayName"
              placeholder="Your name"
              className="input input-bordered w-full"
              required
              autoComplete="name"
            />
          </label>

          <label className="form-control">
            <div className="label pb-1"><span className="label-text">Email</span></div>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
              autoComplete="email"
            />
          </label>

          <label className="form-control">
            <div className="label pb-1"><span className="label-text">Password</span></div>
            <input
              type="password"
              name="password"
              placeholder="Min 8 characters"
              className="input input-bordered w-full"
              required
              autoComplete="new-password"
              minLength={8}
            />
          </label>

          <button type="submit" className="btn btn-primary w-full mt-1" disabled={isPending}>
            {isPending ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
          </button>
        </form>

        <div className="divider text-xs text-base-content/40">or</div>

        <form action="/api/auth/google" method="post">
          <button type="submit" className="btn btn-outline w-full gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
