"use client";

export default function Error({
  error,
}: {
  error: Error;
}) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-500">
        Something went wrong
      </h2>
      <p className="mt-2">{error.message}</p>
    </div>
  );
}
