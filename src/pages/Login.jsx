import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire this up to your real auth (e.g. Supabase auth.signInWithPassword).
    // Navigating straight to /dashboard here is a demo convenience only —
    // gate this behind an actual successful sign-in once auth is wired up.
    navigate("/dashboard");
  }

  function handleGoogle() {
    // TODO: wire this up to your OAuth provider (e.g. Supabase signInWithOAuth)
    console.log("continue with google");
  }

  return (
    <div className="min-h-screen bg-cod-bg flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md animate-fadeUp">
        <div className="mb-6">
          <Logo className="h-16 w-16" />
        </div>

        <h1 className="text-slate-900 text-3xl font-bold mb-1">Welcome Back!</h1>
        <p className="text-slate-500 mb-8">Sign into your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="block text-slate-700 mb-2">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field py-3.5"
            />
          </label>

          <label className="block">
            <span className="block text-slate-700 mb-2">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field py-3.5"
            />
          </label>

          <button
            type="submit"
            className="focus-ring w-full rounded-full bg-cod-btn text-white font-semibold py-3.5 shadow-md
                       transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-5">
          <Link to="/forgot-password" className="focus-ring text-cod-blue font-semibold text-sm hover:text-cod-blue-dark transition-colors">
            Forgot password?
          </Link>
        </div>

        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-sm">Or</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="focus-ring w-full rounded-full border border-slate-200 py-3.5 flex items-center justify-center gap-3
                     font-semibold text-cod-blue transition-all duration-200 hover:border-slate-300 hover:shadow-sm active:scale-[0.98]"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-sm">Don't have an account?</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="text-center">
          <Link to="/signup" className="focus-ring text-cod-blue font-bold hover:text-cod-blue-dark transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.88c2.27-2.09 3.57-5.17 3.57-8.66z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11C3.24 21.3 7.29 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.28A7.19 7.19 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4.01-3.11z" />
      <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.29 0 3.24 2.7 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}
