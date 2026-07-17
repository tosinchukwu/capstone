"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Tip = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
};

const CATEGORIES = [
  "All",
  "Daily Routine",
  "Nutrition",
  "Mental Health",
  "Fitness",
  "Preventive Care",
  "Sleep",
  "Hydration",
  "General Wellness",
];

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [filteredTips, setFilteredTips] = useState<Tip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tips")
      .then((res) => res.json())
      .then((data) => {
        setTips(data);
        setFilteredTips(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = tips;
    if (selectedCategory !== "All") {
      result = result.filter((tip) => tip.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tip) =>
          tip.title.toLowerCase().includes(term) ||
          tip.content.toLowerCase().includes(term)
      );
    }
    setFilteredTips(result);
  }, [selectedCategory, searchTerm, tips]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">Loading tips...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">💡 All Health Tips</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tips by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredTips.length} tips
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="bg-white p-4 rounded-lg shadow border hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-blue-700">{tip.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{tip.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {tip.category} • {new Date(tip.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
