import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(() => navigate("/coach", { replace: true }));
  }, [navigate]);
  return <div className="p-6 text-center text-slate-100">Signing you in…</div>;
};
export default AuthCallback;
