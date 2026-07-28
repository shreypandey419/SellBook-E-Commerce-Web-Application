import { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../api/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", password2: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const passwordsMatch = Boolean(formData.password2) && formData.password === formData.password2;

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Enter your name.";
    if (!emailPattern.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (formData.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.password2) nextErrors.password2 = "Passwords do not match.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setSubmitting(true);
    try {
      await register(formData.name.trim(), formData.email, formData.password);
      toast.success("Registered successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (field) => `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 ${errors[field] ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"}`;

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"><p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Start your library</p><h1 className="mt-2 text-center text-3xl font-black tracking-tight text-slate-900">Create your account</h1><p className="mt-2 text-center text-sm text-slate-500">Save books, manage orders, and more.</p><form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate><div><label htmlFor="name" className="text-sm font-semibold text-slate-700">Name</label><input id="name" name="name" type="text" autoComplete="name" value={formData.name} onChange={onChange} aria-invalid={Boolean(errors.name)} className={fieldClass("name")} placeholder="Your name" />{errors.name && <p className="mt-1.5 text-sm text-rose-600">{errors.name}</p>}</div><div><label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</label><input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={onChange} aria-invalid={Boolean(errors.email)} className={fieldClass("email")} placeholder="you@example.com" />{errors.email && <p className="mt-1.5 text-sm text-rose-600">{errors.email}</p>}</div><div><div className="flex items-center justify-between"><label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label><span className="text-xs text-slate-500">Minimum 8 characters</span></div><div className="relative"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={formData.password} onChange={onChange} aria-invalid={Boolean(errors.password)} className={`${fieldClass("password")} pr-12`} /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-2 right-0 px-4 text-slate-500 hover:text-indigo-600" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>{errors.password ? <p className="mt-1.5 text-sm text-rose-600">{errors.password}</p> : <p className="mt-1.5 text-xs text-slate-500">Use 8 or more characters.</p>}</div><div><label htmlFor="password2" className="text-sm font-semibold text-slate-700">Confirm password</label><div className="relative"><input id="password2" name="password2" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={formData.password2} onChange={onChange} aria-invalid={Boolean(errors.password2)} className={`${fieldClass("password2")} pr-12`} /><button type="button" onClick={() => setShowConfirmPassword((current) => !current)} className="absolute inset-y-2 right-0 px-4 text-slate-500 hover:text-indigo-600" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button></div>{formData.password2 && <p className={`mt-1.5 flex items-center gap-1 text-sm ${passwordsMatch ? "text-emerald-600" : "text-rose-600"}`}>{passwordsMatch ? <FaCheck /> : <FaTimes />}{passwordsMatch ? "Passwords match" : "Passwords do not match"}</p>}{errors.password2 && <p className="mt-1.5 text-sm text-rose-600">{errors.password2}</p>}</div><button type="submit" disabled={submitting} className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}{submitting ? "Creating account…" : "Create account"}</button></form><p className="mt-7 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">Sign in</Link></p></section></main>;
}

export default Register;
