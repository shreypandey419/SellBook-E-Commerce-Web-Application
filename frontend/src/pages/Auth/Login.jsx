import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../api/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!emailPattern.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.password) nextErrors.password = "Enter your password.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Logged in successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleLogin = async () => {
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Google sign-in failed.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"><p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Welcome back</p><h1 className="mt-2 text-center text-3xl font-black tracking-tight text-slate-900">Sign in to SellBook</h1><p className="mt-2 text-center text-sm text-slate-500">Continue your reading journey.</p><form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate><div><label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</label><input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={onChange} aria-invalid={Boolean(errors.email)} className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 ${errors.email ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"}`} placeholder="you@example.com" />{errors.email && <p className="mt-1.5 text-sm text-rose-600">{errors.email}</p>}</div><div><div className="flex items-center justify-between"><label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label><span className="text-xs text-slate-500">Minimum 8 characters</span></div><div className="relative mt-2"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={formData.password} onChange={onChange} aria-invalid={Boolean(errors.password)} className={`block w-full rounded-xl border bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:ring-4 ${errors.password ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"}`} /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 px-4 text-slate-500 hover:text-indigo-600" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>{errors.password && <p className="mt-1.5 text-sm text-rose-600">{errors.password}</p>}</div><button type="submit" disabled={submitting || googleSubmitting} className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Signing in…</> : "Sign in"}</button></form><div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />OR<span className="h-px flex-1 bg-slate-200" /></div><button type="button" onClick={onGoogleLogin} disabled={submitting || googleSubmitting} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60">{googleSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" /> : <FcGoogle className="text-xl" />}{googleSubmitting ? "Connecting to Google…" : "Continue with Google"}</button><p className="mt-7 text-center text-sm text-slate-600">Don&apos;t have an account? <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">Create one</Link></p></section></main>;
}

export default Login;
