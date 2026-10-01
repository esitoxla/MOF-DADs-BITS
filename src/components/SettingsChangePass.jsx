import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { changePassword, logoutUser } from "../store/features/authSlice";

function PasswordField({ label, value, onChange, visible, onToggle, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-800">
        {label}
      </span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:border-gray-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

export default function SettingsChangePass() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!authUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
      toast.success("Password changed successfully. Please log in again.");
      dispatch(logoutUser());
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <KeyRound size={18} className="text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordField
          label="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          visible={showOldPassword}
          onToggle={() => setShowOldPassword((prev) => !prev)}
          placeholder="Enter your current password"
        />
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          visible={showNewPassword}
          onToggle={() => setShowNewPassword((prev) => !prev)}
          placeholder="Enter a new password"
        />
        <PasswordField
          label="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          visible={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((prev) => !prev)}
          placeholder="Confirm your new password"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#0f9b80] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0c846c] disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
