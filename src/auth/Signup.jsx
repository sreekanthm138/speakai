import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Signup = () => {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [err, setErr] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    const { error } = await signUpWithEmail(email, password);
    if (error) setErr(error.message);
    else setMessage("Check your email to confirm your account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
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
          {message && <p className="text-emerald-400 text-sm">{message}</p>}
          <button className="w-full p-3 rounded-xl bg-emerald-500 font-medium">
            Create account
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="text-emerald-400" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
