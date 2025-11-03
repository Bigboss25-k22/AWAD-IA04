import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { getProfile } from "../api/authApi";

type User = { id?: string; email: string; name?: string } | null;

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getProfile();
        if (mounted) setUser(profile);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        if (mounted) setError(err?.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>

            <div className="mt-6 flex justify-end">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );

  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!user) return <div>No user</div>;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Profile</h2>
            <p className="text-sm text-gray-500 mt-1">User account details</p>
          </div>
          <div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">{(user.name || user.email || "?")[0]}</div>
            <div>
              <div className="text-lg font-medium">{user.name || user.email}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}