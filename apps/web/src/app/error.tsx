"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <h2 className="text-3xl">Oops, Something went wrong!</h2>
      <button
        className="py-2 cursor-pointer bg-white text-black px-4 rounded-md mt-4"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
