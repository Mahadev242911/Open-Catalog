"use client";

import { useState } from "react";
import { getPokemonById } from "@/lib/api";
import BackButton from "@/components/BackButton";

// ===== STAT BAR COLOR =====
const statColor = (value: number) => {
  if (value >= 100) return "bg-green-500";
  if (value >= 70) return "bg-yellow-400";
  return "bg-red-500";
};

// ===== TOTAL STATS =====
const totalStats = (p: any) =>
  p.stats.reduce((sum: number, s: any) => sum + s.base_stat, 0);

// ===== STAT ICONS =====
const statIcons: Record<string, string> = {
  hp: "❤️",
  attack: "⚔️",
  defense: "🛡️",
  "special-attack": "✨",
  "special-defense": "🔮",
  speed: "⚡",
};

export default function ComparePage() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [p1, setP1] = useState<any>(null);
  const [p2, setP2] = useState<any>(null);
  const [error, setError] = useState("");

  const compare = async () => {
    if (!id1 || !id2) {
      setError("Please enter both Pokémon IDs");
      return;
    }

    if (id1 === id2) {
      setError("Please select two different Pokémon");
      return;
    }

    try {
      setError("");
      const [a, b] = await Promise.all([
        getPokemonById(id1),
        getPokemonById(id2),
      ]);
      setP1(a);
      setP2(b);
    } catch {
      setError("Invalid Pokémon ID(s). Try again.");
      setP1(null);
      setP2(null);
    }
  };

  return (
    <div
      className="
      relative min-h-screen px-6 py-8 transition-colors
      bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.15),transparent_45%)]
      dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.25),transparent_45%),linear-gradient(to_bottom,#020617,#020617)]
      text-white
    "
    >
      {/* VIGNETTE */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6))]" />

      <BackButton />

      <h1 className="text-3xl font-bold text-center mb-8">
        ⚔️ Compare Pokemon
      </h1>

      {/* INPUT CARD */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              min="1"
              placeholder="Pokemon ID 1"
              value={id1}
              onChange={(e) => setId1(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg
              bg-black/40 border border-white/10 outline-none"
            />

            <input
              type="number"
              min="1"
              placeholder="Pokemon ID 2"
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg
              bg-black/40 border border-white/10 outline-none"
            />

            <button
              onClick={compare}
              className="px-6 py-2 rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:brightness-110 font-semibold transition"
            >
              Compare
            </button>
          </div>

          {error && (
            <p className="text-center text-red-400 mt-3">{error}</p>
          )}
        </div>
      </div>

      {/* RESULT */}
      {p1 && p2 && (
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {[p1, p2].map((p, index) => {
              const opponent = index === 0 ? p2 : p1;

              return (
                <div
                  key={p.id}
                  className="
                  backdrop-blur-xl bg-white/10
                  rounded-3xl p-6 shadow-2xl
                  border border-white/10
                  hover:scale-[1.02] transition
                "
                >
                  {/* IMAGE */}
                  <img
                    src={p.sprites.front_default}
                    alt={p.name}
                    className="w-40 h-40 mx-auto
                    drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                  />

                  {/* NAME */}
                  <h2
                    className="
                    text-2xl font-bold text-center capitalize mt-2
                    bg-gradient-to-r from-indigo-400 to-pink-400
                    bg-clip-text text-transparent
                  "
                  >
                    {p.name}
                  </h2>

                  {/* TYPES */}
                  <div className="flex justify-center gap-2 mt-3 flex-wrap">
                    {p.types.map((t: any) => (
                      <span
                        key={t.type.name}
                        className="px-3 py-1 text-xs rounded-full
                        bg-white/20 backdrop-blur capitalize"
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>

                  {/* TOTAL POWER */}
                  <p className="text-center mt-4 text-sm text-slate-300">
                    Total Power:{" "}
                    <span className="font-bold text-white">
                      {totalStats(p)}
                    </span>
                  </p>

                  {/* STATS */}
                  <div className="mt-6 space-y-4">
                    {p.stats.map((s: any, i: number) => {
                      const otherStat = opponent.stats[i].base_stat;
                      const isWinner = s.base_stat > otherStat;

                      return (
                        <div key={s.stat.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">
                              {statIcons[s.stat.name]}{" "}
                              {s.stat.name.replace("-", " ")}
                            </span>
                            <span
                              className={`font-semibold ${
                                isWinner
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {s.base_stat}
                            </span>
                          </div>

                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isWinner
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                  : "bg-gradient-to-r from-red-500 to-pink-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  s.base_stat,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* VS BADGE */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
            <div
              className="
              bg-gradient-to-r from-red-500 to-pink-500
              text-white font-extrabold px-8 py-4
              rounded-full shadow-2xl text-xl
            "
            >
              VS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
