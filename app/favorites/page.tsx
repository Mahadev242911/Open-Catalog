"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Example: fetch favorites from localStorage or API
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavs);
  }, []);

  return (
    <div className="p-4">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "Hide Favorites" : "View Favorites"}
        </button>
      </div>

      {/* Favorites Section */}
      {showFavorites && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.length === 0 ? (
            <p>No favorites yet.</p>
          ) : (
            favorites.map((item, index) => (
              <div key={index} className="border p-2 rounded shadow">
                {item.name || "Favorite Item"}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
