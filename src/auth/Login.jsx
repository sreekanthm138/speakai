import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/coach";

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signInWithEmail(email, password);
    setBusy(false);
    if (error) setErr(error.message);
    else navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4">Log in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full p-3 rounded-xl bg-slate-800"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 rounded-xl bg-slate-800"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <button
            disabled={busy}
            className="w-full p-3 rounded-xl bg-emerald-500 font-medium disabled:opacity-60"
          >
            {busy ? "Logging in…" : "Log in"}
          </button>
        </form>
        <button
          onClick={signInWithGoogle}
          className="mt-4 w-full p-3 rounded-xl bg-white text-black font-medium"
        >
          Continue with Google
        </button>
        <p className="mt-4 text-sm text-slate-400">
          No account?{" "}
          <Link className="text-emerald-400" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
