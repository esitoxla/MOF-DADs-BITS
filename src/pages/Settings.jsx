import Accounts from "../components/Accounts";
import SettingsChangePass from "../components/SettingsChangePass";

export default function Settings() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
      <p className="mt-1 text-gray-500">
        Manage your personal information and security
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <Accounts />
        <SettingsChangePass />
      </div>
    </div>
  );
}
