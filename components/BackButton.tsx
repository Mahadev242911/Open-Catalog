"use client"; // ✅ Required for interactivity

export default function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="self-start mb-4 px-4 py-2 rounded-lg text-slate-700 font-medium
        hover:bg-slate-100 transition"
    >
      ← Back
    </button>
  );
}
