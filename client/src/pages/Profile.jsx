import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";

export default function Profile() {
    const { user, logout } = useAuth();
    const [form, setForm] = useState({
        name: user?.displayName || "",
        photoURL: user?.photoURL || "",
    });
    const [saving, setSaving] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        try {
            setSaving(true);
            await updateProfile(auth.currentUser, {
                displayName: form.name || null,
                photoURL: form.photoURL || null,
            });
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-[280px,1fr]">
            {/* Profile Card */}
            <div className="card bg-base-100 shadow-md rounded-2xl">
                <div className="card-body items-center text-center p-6 sm:p-8">
                    <div className="avatar">
                        <div className="w-28 h-28 rounded-full overflow-hidden shadow-sm">
                            <img
                                src={
                                    form.photoURL ||
                                    user?.photoURL ||
                                    `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                                        user?.displayName || user?.email || "User"
                                    )}`
                                }
                                alt="User avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-3">
                        {user?.displayName || "Unnamed User"}
                    </h2>
                    <p className="text-sm text-base-content/70 break-all">{user?.email}</p>

                    <div className="card-actions mt-6 w-full">
                        <button
                            onClick={logout}
                            className="btn w-full h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <div className="card bg-base-100 shadow-md rounded-2xl">
                <div className="card-body p-6 sm:p-8 md:p-10">
                    <h1 className="text-xl font-bold mb-3">Edit Profile</h1>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Full name</label>
                            <input
                                name="name"
                                className="input w-full h-11 rounded-xl border border-base-300/30 bg-base-200/40 focus:outline-none focus:border-primary transition px-4"
                                placeholder="Your name"
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>

                        {/* Photo URL */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Photo URL</label>
                            <input
                                name="photoURL"
                                className="input w-full h-11 rounded-xl border border-base-300/30 bg-base-200/40 focus:outline-none focus:border-primary transition px-4"
                                placeholder="https://..."
                                value={form.photoURL}
                                onChange={onChange}
                            />
                            <p className="text-xs text-base-content/60 ml-1">
                                Tip: Use a square image for best results.
                            </p>
                        </div>

                        {/* Email (read-only) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                className="input w-full h-11 rounded-xl border border-base-300/30 bg-base-200/40 text-base-content/80 px-4"
                                value={user?.email || ""}
                                disabled
                                readOnly
                            />
                        </div>

                        {/* Save button */}
                        <div className="pt-2">
                            <button
                                className="btn w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                                disabled={saving}
                                type="submit"
                            >
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
