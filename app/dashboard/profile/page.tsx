"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) return;
    fetch(`/api/doctors/profile?wallet=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // Not registered yet – redirect to register
          router.push("/register-doctor");
        } else {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [address, isConnected, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/doctors/profile", {
      method: "PUT",
      body: JSON.stringify({ ...profile, wallet: address }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      alert("Profile updated successfully!");
    } else {
      alert("Failed to update profile.");
    }
  };

  if (!isConnected) {
    return <div className="p-4">Please connect your wallet.</div>;
  }
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Doctor Profile</h1>
        <Link href="/dashboard" className="text-primary-600 hover:underline">← Dashboard</Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Specialty</label>
          <input
            type="text"
            value={profile.specialty || ""}
            onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hospital</label>
          <input
            type="text"
            value={profile.hospital || ""}
            onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={profile.location || ""}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Years of Experience</label>
          <input
            type="number"
            value={profile.yearsExperience || ""}
            onChange={(e) => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={profile.autoConfirm || false}
              onChange={(e) => setProfile({ ...profile, autoConfirm: e.target.checked })}
            />
            Auto-confirm appointments
          </label>
        </div>
        <button type="submit" className="btn-primary w-full">Update Profile</button>
      </form>
    </div>
  );
}
