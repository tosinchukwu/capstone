"use client";
import { useEffect, useState } from "react";

type Settings = {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    instagram: string;
};

export default function HospitalInfo() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/settings")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch hospital info");
                return res.json();
            })
            .then((data) => {
                setSettings(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching hospital info:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-gray-400 text-sm">Loading hospital info...</div>;
    }

    if (!settings) {
        return null;
    }

    // Use fallback values if fields are empty
    const name = settings.name || "MEDCRUSH BLOCKCHAIN HOSPITAL";
    const address = settings.address || "2, Hospital Road, Benin";
    const phone = settings.phone || "08023000000";
    const email = settings.email || "medcrush@gmail.com";

    return (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p className="font-semibold text-gray-700 dark:text-gray-200">{name}</p>
            <p>{address}</p>
            <p>📞 {phone}</p>
            <p>✉️ {email}</p>
        </div>
    );
}