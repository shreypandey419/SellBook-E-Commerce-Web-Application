import { useEffect, useState } from "react";
import { FaLock, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuthContext } from "../../api/AuthContext";
import userApi from "../../api/userApi";

const inputClass = "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

function Profile() {
  const { user, logout } = useAuthContext();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) setFormData({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
  }, [user]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setProfileErrors((current) => ({ ...current, [name]: "" }));
  };

  const onUpdateProfile = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Enter a valid email address.";
    if (Object.keys(errors).length) return setProfileErrors(errors);

    setProfileSubmitting(true);
    try {
      await userApi.updateProfile({ ...formData, name: formData.name.trim(), email: formData.email.trim() });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update your profile.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const onUpdatePassword = async (event) => {
    event.preventDefault();
    if (!passwords.oldPassword || passwords.newPassword.length < 8) {
      setPasswordError("Enter your current password and a new password of at least 8 characters.");
      return;
    }

    setPasswordSubmitting(true);
    setPasswordError("");
    try {
      await userApi.updatePassword(passwords);
      setPasswords({ oldPassword: "", newPassword: "" });
      toast.success("Password updated successfully.");
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Unable to update your password.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const initials = (user?.name || "U").trim().slice(0, 1).toUpperCase();
  const avatar = user?.avatar || user?.photoURL;

  return <div className="mx-auto max-w-5xl py-4 sm:py-8"><section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-900 p-6 text-white shadow-xl sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white/30 bg-white/15 text-3xl font-black">{avatar ? <img src={avatar} alt="Profile" className="h-full w-full object-cover" /> : initials}</div><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">My account</p><h1 className="mt-1 text-3xl font-black">{user?.name || "Your profile"}</h1><p className="mt-1 text-indigo-100">{user?.email || "Manage your SellBook account"}</p></div></div></section><div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-3"><FaUserCircle className="text-2xl text-indigo-600" /><div><h2 className="text-xl font-black text-slate-900">Edit profile</h2><p className="text-sm text-slate-500">Keep your account details up to date.</p></div></div><form onSubmit={onUpdateProfile} className="mt-6 space-y-5" noValidate><div><label htmlFor="name" className="text-sm font-semibold text-slate-700">Name</label><input id="name" name="name" value={formData.name} onChange={onChange} className={inputClass} aria-invalid={Boolean(profileErrors.name)} />{profileErrors.name && <p className="mt-1 text-sm text-rose-600">{profileErrors.name}</p>}</div><div><label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</label><input id="email" name="email" type="email" value={formData.email} onChange={onChange} className={inputClass} aria-invalid={Boolean(profileErrors.email)} />{profileErrors.email && <p className="mt-1 text-sm text-rose-600">{profileErrors.email}</p>}</div><div><label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone number</label><input id="phone" name="phone" type="tel" value={formData.phone} onChange={onChange} className={inputClass} placeholder="Optional" /></div><button type="submit" disabled={profileSubmitting} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{profileSubmitting ? "Saving…" : "Save profile"}</button></form></section><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-3"><FaLock className="text-xl text-indigo-600" /><div><h2 className="text-xl font-black text-slate-900">Change password</h2><p className="text-sm text-slate-500">Use a new password with at least 8 characters.</p></div></div><form onSubmit={onUpdatePassword} className="mt-6 space-y-5"><div><label htmlFor="oldPassword" className="text-sm font-semibold text-slate-700">Current password</label><input id="oldPassword" name="oldPassword" type="password" autoComplete="current-password" value={passwords.oldPassword} onChange={(event) => setPasswords((current) => ({ ...current, oldPassword: event.target.value }))} className={inputClass} /></div><div><label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">New password</label><input id="newPassword" name="newPassword" type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(event) => { setPasswords((current) => ({ ...current, newPassword: event.target.value })); setPasswordError(""); }} className={inputClass} /><p className="mt-1 text-xs text-slate-500">Minimum 8 characters.</p></div>{passwordError && <p className="text-sm text-rose-600">{passwordError}</p>}<button type="submit" disabled={passwordSubmitting} className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60">{passwordSubmitting ? "Updating…" : "Update password"}</button></form></section></div><div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 p-5 sm:flex sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">Sign out of SellBook</h2><p className="mt-1 text-sm text-slate-600">You can sign in again at any time.</p></div><button type="button" onClick={logout} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-rose-700 sm:mt-0"><FaSignOutAlt />Logout</button></div></div>;
}

export default Profile;
