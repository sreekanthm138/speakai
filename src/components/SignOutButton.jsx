import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function SignOutButton({ className = "" }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    await signOut(); // clears session in Supabase + triggers auth change
    navigate("/login"); // send user to login page
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-2 rounded-xl bg-slate-800 text-slate-100 hover:bg-slate-700 ${className}`}
    >
      Sign out
    </button>
  );
}
