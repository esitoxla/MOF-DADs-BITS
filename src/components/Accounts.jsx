import { useEffect, useRef, useState } from "react";
import { AtSign, Calendar, Camera, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  removeProfilePic,
  updateProfile,
  uploadAvatar,
} from "../store/features/authSlice";

const roleLabels = {
  admin: "Admin",
  data_entry: "Data entry",
  approver: "Approver",
  reviewer: "Reviewer",
};

function formatMemberSince(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function Field({ icon, label, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-800">
        {icon}
        {label}
      </span>
      <input
        {...inputProps}
        className={`w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500 ${
          inputProps.className || ""
        }`}
      />
    </label>
  );
}

export default function Accounts() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { authUser, loading } = useSelector((store) => store.auth);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(authUser?.name || "");
    setPhone(authUser?.phone || "");
  }, [authUser]);

  if (!authUser) return null;

  const hasAvatar = !!authUser.avatarUrl;
  const avatarSrc = preview || authUser.avatarUrl;
  const nameParts = (authUser.name || "").trim().split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.[0] || "?").toUpperCase();
  const memberSince = formatMemberSince(
    authUser.createdAt || authUser.created_at
  );

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await dispatch(uploadAvatar(formData)).unwrap();
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err || "Avatar upload failed");
      setPreview(null);
    }
  };

  const removeAvatar = async () => {
    setShowMenu(false);
    try {
      await dispatch(removeProfilePic()).unwrap();
      setPreview(null);
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error(err || "Failed to remove profile picture");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfile({ name, phone })).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              if (hasAvatar || preview) {
                setShowMenu((open) => !open);
                return;
              }
              fileInputRef.current?.click();
            }}
            aria-label="Upload profile photo"
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-600 text-2xl font-semibold text-white"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <span className="pointer-events-none absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow ring-1 ring-gray-200">
            <Camera size={16} />
          </span>

          {showMenu && (
            <div className="absolute left-0 top-full z-20 mt-2 w-40 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  fileInputRef.current?.click();
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                {hasAvatar ? "Change photo" : "Upload photo"}
              </button>
              {hasAvatar && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Remove photo
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">
              {authUser.name}
            </p>
            <span className="inline-flex items-center gap-1 rounded-md border border-transparent bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-900 transition-colors hover:bg-slate-100/80">
              <ShieldCheck className="mr-1 h-3 w-3" />
              {roleLabels[authUser.role] || "User"}
            </span>
          </div>
          <p className="text-sm text-gray-500">{authUser.email}</p>
          {memberSince && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
              <Calendar size={14} />
              Member since {memberSince}
            </p>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs font-semibold tracking-wider text-gray-500">
        PROFILE INFORMATION
      </p>

      <form onSubmit={handleSave} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          icon={<User size={14} />}
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
        />
        <Field
          icon={<AtSign size={14} />}
          label="Username"
          type="text"
          value={authUser.username || ""}
          disabled
        />
        <Field
          icon={<Mail size={14} />}
          label="Email"
          type="email"
          value={authUser.email || ""}
          disabled
        />
        <Field
          icon={<Phone size={14} />}
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />

        <div className="flex justify-end md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#0f9b80] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0c846c] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
