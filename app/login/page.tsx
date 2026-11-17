
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(
          "Invalid email or password. Please check your account details."
        );
        return;
      }

      // Redirect to Home after successful login
      router.push("/");
      router.refresh();

    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <Link href="/login" className="auth-logo">
          Y-Learning <span>Hub</span>
        </Link>

        <div className="auth-heading">
          <span className="eyebrow">WELCOME</span>
          <h1>Student Login</h1>
          <p>
            Continue your learning journey with us.
          </p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="forgot-row">
            <Link href="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-navy auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>

        </form>

        <p className="auth-bottom">
          Don't have an account?{" "}
          <Link href="/signup">
            Create Account
          </Link>
        </p>

      </section>
    </main>
  );
}
